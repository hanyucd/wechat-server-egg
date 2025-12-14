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
}

module.exports = FriendController;
