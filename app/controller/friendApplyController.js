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
    if (friend_id === stateUser.id) ctx.throw(400, '不能申请添加自己为好友');

    const friendUser = await app.model.UserModel.findOne({
      where: { id: friend_id, status: 1 },
    });
    if (!friendUser) ctx.throw(400, '好友不存在或已被禁用');

    const friendApplyRecord = await app.model.FriendApplyModel.create({
      friend_id,
      user_id: stateUser.id,
    });
    if (!friendApplyRecord) ctx.throw(500, '好友申请失败');

    ctx.resSuccess(friendApplyRecord.toJSON());
  }

  /**
   * 获取好友申请列表
   */
  async friendApplyList() {
    const { ctx, app } = this;
    let { page = 1, size = 10 } = ctx.query;

    page = Number(page);
    size = Number(size);
    const stateUser = ctx.state.user;

    const { count, rows } = await app.model.FriendApplyModel.findAndCountAll({
      where: { friend_id: stateUser.id },
      // include: [{
      //   model: app.model.UserModel,
      //   attributes: [ 'id', 'username', 'nickname' ],
      // }],
      offset: (page - 1) * size,
      limit: size,
      order: [[ 'created_at', 'DESC' ]], // 按创建时间倒序排序
    });

    const result = {
      page,
      size,
      count,
      total: Math.ceil(count / size) || 1,
      list: rows.map(item => item.toJSON()),
    };

    ctx.resSuccess(result);
  }
}


module.exports = FriendApplyController;
