const Controller = require('egg').Controller;

class FriendApplyController extends Controller {
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
      include: [
        {
          model: app.model.UserModel,
          as: 'user', // as：指定别名，使用哪个“别名”来进行连接查询 | “叫名字”
          attributes: [ 'id', 'username', 'nickname', 'avatar' ],
        },
        {
          model: app.model.UserModel,
          as: 'friend',
          attributes: [ 'id', 'username', 'nickname', 'avatar' ],
        },
      ],
      offset: (page - 1) * size,
      limit: size,
      order: [[ 'created_at', 'DESC' ]], // 按创建时间倒序排序
      attributes: {
        exclude: [ 'updated_at' ],
      },
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

  /**
   * 好友申请
   */
  async friendApply() {
    const { ctx, app } = this;

    ctx.validate({
      friend_id: { type: 'int', required: true, desc: '好友id' },
      nickname: { type: 'string', required: false, desc: '昵称' },
      lookme: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '看我' },
      lookhim: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '看他' },
    });

    const { friend_id, nickname, lookme, lookhim } = ctx.request.body;
    const stateUser = ctx.state.user;
    if (friend_id === stateUser.id) ctx.throw(400, '不能申请添加自己为好友');

    const friendUser = await app.model.UserModel.findOne({
      where: { id: friend_id, status: 1 },
    });
    if (!friendUser) ctx.throw(400, '好友不存在或已被禁用');

    const friendApplyRecord = await app.model.FriendApplyModel.create({
      user_id: stateUser.id,
      friend_id,
      nickname,
      lookme,
      lookhim,
    });
    if (!friendApplyRecord) ctx.throw(500, '好友申请失败');

    ctx.resSuccess(friendApplyRecord.toJSON());
  }

  // 处理好友申请
  async friendApplyHandle() {
    const { ctx, app } = this;
    // 调试日志：在校验之前打印，确保能看到输入数据
    // console.log('DEBUG: ctx.params:', ctx.params);

    ctx.validate({
      applyId: { type: 'number', required: false, desc: '好友申请id' },
      nickname: { type: 'string', required: false, desc: '昵称' },
      lookme: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '看我' },
      lookhim: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '看他' },
      status: { type: 'string', required: true, range: { in: [ 'refuse', 'agree', 'ignore' ] }, desc: '处理结果' },
    });

    const applyId = parseInt(ctx.params.applyId);
    const stateUser = ctx.state.user;

    const friendApplyRecord = (await app.model.FriendApplyModel.findOne({
      where: { id: applyId, friend_id: stateUser.id },
    }))?.toJSON();
    if (!friendApplyRecord) ctx.throw(400, '好友申请不存在');

    console.log('friendApplyRecord:', friendApplyRecord);

    // if (accept) {
    //   // 同意好友申请
    //   await app.model.FriendApplyModel.update({
    //     status: 1,
    //   }, {
    //     where: { id: friend_apply_id },
    //   });
    // } else {
    //   // 拒绝好友申请
    //   await app.model.FriendApplyModel.update({
    //     status: 2,
    //   }, {
    //     where: { id: friend_apply_id },
    //   });
    // }

    ctx.resSuccess();
  }
}

module.exports = FriendApplyController;
