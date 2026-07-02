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
      // as: 简单来说，定义关系中的 as 是“起名字”，查询函数中的 as 是“叫名字”。 只有名字叫对了，才能把人（数据）喊出来。
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
      // 好友备注 或者 好友昵称
      const friendNickname = item.nickname || item.friend.nickname;

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
   * 朋友圈设置查看权限
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

  /**
   * 设置好友标签和备注
   */
  async friendSetTagAndRemark() {
    const { ctx, app } = this;

    ctx.validate({
      friendId: { type: 'int', required: true, desc: '好友id' },
      tagList: { type: 'array', required: false, desc: '标签数组' },
      remark: { type: 'string', required: false, desc: '好友备注' },
    });

    const friendId = parseInt(ctx.params.friendId);
    const findFriend = await app.model.FriendModel.findOne({
      where: { user_id: ctx.state.user.id, friend_id: friendId },
      include: [
        {
          model: app.model.TagModel,
          as: 'tags',
          // attributes: [ 'id', 'name' ],
        },
      ],
    });
    if (!findFriend) ctx.throw(400, '不存在好友关系');
    if (findFriend.isblack) ctx.throw(400, '好友已被拉黑，不能设置标签和备注');
    const { tagList = [], remark = '' } = ctx.request.body;

    // 修改好友备注
    await findFriend.update({ nickname: remark });


    // 1. 获取用户所有的标签
    const userAllTags = await app.model.TagModel.findAll({
      where: { user_id: ctx.state.user.id },
    });

    // 2. 过滤出需要添加的标签
    const userAllTagNames = userAllTags.map(item => item.name);
    const newTagNames = tagList.filter(tName => !userAllTagNames.includes(tName));
    const bulkCreateTags = newTagNames.map(item => ({ name: item, user_id: ctx.state.user.id }));

    // 3. 批量创建新标签
    await app.model.TagModel.bulkCreate(bulkCreateTags);

    const { Op } = app.Sequelize;

    // 1. 查找我创建的 新标签
    const newTags = await app.model.TagModel.findAll({
      where: {
        user_id: ctx.state.user.id,
        name: { [Op.in]: newTagNames },
      },
    });

    const newTagIds = newTags.map(item => item.id);
    const oldTagsIds = findFriend.tags.map(item => item.id);
    // 2. 需要添加的新标签
    const addFriendTagIds = newTagIds.filter(item => !oldTagsIds.includes(item));
    // 3. 需要删除的标签
    const delFriendTagIds = oldTagsIds.filter(item => !newTagIds.includes(item));

    // 4. 批量新增 好友标签关联关系
    const bulkCreateFriendTags = addFriendTagIds.map(item => ({ tag_id: item, friend_id: friendId }));
    await app.model.FriendTagModel.bulkCreate(bulkCreateFriendTags);

    // 5. 删除 好友标签关联关系
    await app.model.FriendTagModel.destroy({
      where: {
        friend_id: friendId,
        tag_id: { [Op.in]: delFriendTagIds },
      },
    });

    ctx.resSuccess();
  }
}

module.exports = FriendController;
