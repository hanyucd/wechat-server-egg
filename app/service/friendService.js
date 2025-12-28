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
    const friendInfo = {
      id: findUser.id,
      username: findUser.username,
      nickname: findUser.nickname ? findUser.nickname : findUser.username,
      avatar: findUser.avatar,
      sex: findUser.sex,
      sign: findUser.sign,
      area: findUser.area,
      isFriend: false,
      lookme: 1,
      lookhim: 1,
      isstar: 0,
      isblack: 0,
      tags: [],
    };

    // 查找好友关系
    const findFriend = (await app.model.FriendModel.findOne({
      where: { user_id: stateUser.id, friend_id: friendId },
      include: [
        // 在 belongsToMany 关联中，中间表的数据默认会被包含在返回结果的一个嵌套对象中
        {
          model: app.model.TagModel,
          as: 'tags',
          attributes: [ 'id', 'name' ],
          // 使用 through: { attributes: [] } 来告诉 Sequelize 不要查询中间表的任何字段
          through: { attributes: [] },
        },
      ],
    }))?.toJSON();

    if (findFriend) {
      friendInfo.isFriend = true; // 好友关系
      if (findFriend.nickname) friendInfo.nickname = findFriend.nickname; // 好友备注

      friendInfo.lookme = findFriend.lookme;
      friendInfo.lookhim = findFriend.lookhim;
      friendInfo.isstar = findFriend.isstar;
      friendInfo.isblack = findFriend.isblack;
      friendInfo.tags = findFriend.tags;
    }

    return friendInfo;
  }
}

module.exports = FriendService;
