const Controller = require('egg').Controller;

class FriendApplyController extends Controller {
  /**
   * 好友申请
   */
  async friendApply() {
    const { ctx, app } = this;

    ctx.validate({
      friend_id: { type: 'int', required: true, desc: '好友id' },
    });

    const { friend_id } = ctx.request.body;
    const stateUser = ctx.state.user;
    // console.log(stateUser);
    if (friend_id === stateUser.id) ctx.throw(400, '不能申请添加自己为好友');

    const friendUser = await app.model.UserModel.findOne({
      where: { id: friend_id, status: 1 },
    });
    if (!friendUser) ctx.throw(400, '好友不存在或已被禁用');


    ctx.resSuccess({ friend_id, user_id: stateUser.id });
  }
}


module.exports = FriendApplyController;
