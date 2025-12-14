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

    const result = {
      count,
      list: rows.map(item => item.toJSON()),
    };
    ctx.resSuccess(result);
  }
}

module.exports = FriendController;
