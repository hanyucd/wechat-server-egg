const Service = require('egg').Service;

class FriendService extends Service {

  /**
   * 查找好友
   * @param {number} friendId - 好友id
   * @return {object} friendInfo - 好友信息
   */
  async findFriend(friendId) {
    const { ctx, app } = this;
    const stateUser = ctx.state.user;

    const findUser = await app.model.UserModel.findOne({
      where: { id: friendId, status: 1 },
      attributes: {
        exclude: [ 'password' ],
      },
    });
    if (!findUser) ctx.throw(400, '好友不存在或禁封');

    // 好友资料
    let friendInfo = {
      id: findUser.id,
      username: findUser.username,
      nickname: findUser.nickname ? findUser.nickname : findUser.username,
      avatar: findUser.avatar,
      // sex: user.sex,
      // sign: user.sign,
      // area: user.area,
      isFriend: false,
    };

    // 查找好友关系
    const findFriend = (await app.model.FriendModel.findOne({
      where: { user_id: stateUser.id, friend_id: friendId },
    }))?.toJSON();

    if (findFriend) {
      friendInfo.isFriend = true; // 好友关系
      if (findFriend.nickname) friendInfo.nickname = findFriend.nickname; // 好友备注

      friendInfo = {
        ...friendInfo,
        lookme: findFriend.lookme,
        lookhim: findFriend.lookhim,
        star: findFriend.star,
        isblack: findFriend.isblack,
      };
    }

    return friendInfo;
  }
}

module.exports = FriendService;
