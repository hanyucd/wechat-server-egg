const SortWord = require('sort-word');
const Controller = require('egg').Controller;

class FriendController extends Controller {
  /**
   * 好友列表
   */
  async friendList() {
    const { ctx, app } = this;
    const stateUser = ctx.state.user;

    const { count, rows } = await app.model.FriendModel.findAndCountAll({
      where: { user_id: stateUser.id },
      include: [
        {
          model: app.model.UserModel,
          as: 'friend',
          attributes: [ 'id', 'username', 'nickname', 'avatar' ],
        },
      ],
      attributes: {
        exclude: [ 'user_id' ],
      },
    });
    const friendRows = rows.map(item => item.toJSON()).map(item => {
      // 取出好友用户的昵称
      let friendNickname = item.friend.nickname ? item.friend.nickname : item.friend.username;
      // 如果 我为好友 设置了昵称
      if (item.nickname) friendNickname = item.nickname;

      return {
        id: item.id,
        friend_id: item.friend.id,
        friend_nickname: friendNickname,
        friend_username: item.friend.username,
        friend_avatar: item.friend.avatar,
      };
    });

    let sortFriend = null;
    // 昵称首字母排序
    if (friendRows.length) sortFriend = new SortWord(friendRows, 'friend_nickname');

    const result = {
      // rows,
      count,
      list: sortFriend ? sortFriend.newList : [],
      index_list: sortFriend ? sortFriend.indexList : [],
    };

    ctx.resSuccess(result);
  }

  /**
   * 查看好友资料
   */
  async friendInfo() {
    const { ctx, app, service } = this;

    ctx.validate({
      friendId: { type: 'int', required: true, desc: '好友id' },
    });
    const friendId = parseInt(ctx.params.friendId);

    const friendResult = await service.friendService.findFriend(friendId);
    ctx.resSuccess(friendResult);
  }

  /**
   * 好友设置拉黑
   */
  async friendSetBlack() {
    const { ctx, app } = this;

    ctx.validate({
      friendId: { type: 'int', required: true, desc: '好友id' },
      isBlack: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '移入/移除黑名单' },
    });

    const friendId = parseInt(ctx.params.friendId);
    const findFriend = await app.model.FriendModel.findOne({
      where: { user_id: ctx.state.user.id, friend_id: friendId },
    });
    if (!findFriend) ctx.throw(400, '不存在好友关系');
    const { isBlack } = ctx.request.body;

    await findFriend.update({ isblack: isBlack });
    ctx.resSuccess();
  }

  /**
   * 好友设置星标
   */
  async friendSetStar() {
    const { ctx, app } = this;

    ctx.validate({
      friendId: { type: 'int', required: true, desc: '好友id' },
      isStar: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '移入/移除星标' },
    });

    const friendId = parseInt(ctx.params.friendId);
    const findFriend = await app.model.FriendModel.findOne({
      where: { user_id: ctx.state.user.id, friend_id: friendId },
    });
    if (!findFriend) ctx.throw(400, '不存在好友关系');
    if (findFriend.isblack) ctx.throw(400, '好友已被拉黑，不能设置星标');
    const { isStar } = ctx.request.body;

    await findFriend.update({ isstar: isStar });
    ctx.resSuccess();
  }

  /**
   * 设置好友朋友圈权限
   */
  async friendCircleSetLook() {
    const { ctx, app } = this;

    ctx.validate({
      friendId: { type: 'int', required: true, desc: '好友id' },
      lookme: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '查看我的朋友圈' },
      lookhim: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '查看好友的朋友圈' },
    });

    const friendId = parseInt(ctx.params.friendId);
    const findFriend = await app.model.FriendModel.findOne({
      where: { user_id: ctx.state.user.id, friend_id: friendId },
    });

    if (!findFriend) ctx.throw(400, '不存在好友关系');
    if (findFriend.isblack) ctx.throw(400, '好友已被拉黑，不能设置查看权限');
    const { lookme = 1, lookhim = 1 } = ctx.request.body;

    await findFriend.update({ lookme, lookhim });
    ctx.resSuccess();
  }
}

module.exports = FriendController;
