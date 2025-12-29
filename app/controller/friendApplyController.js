const dayjs = require('dayjs');
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

    // 查找最新的一次申请记录
    const lastFriendApplyRecord = (await app.model.FriendApplyModel.findOne({
      where: { user_id: stateUser.id, friend_id },
      order: [[ 'created_at', 'DESC' ]], // 按创建时间倒序排序
    }))?.toJSON();

    if (lastFriendApplyRecord) {
      // 若申请时间未过期 且 状态为 pending | 3 日内只能申请一次
      if (dayjs(lastFriendApplyRecord.expire_time).isAfter(dayjs()) && lastFriendApplyRecord.status === 'pending') ctx.throw(400, '3 日内只能申请一次');
    }

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

  /**
   * 处理好友申请
   */
  async friendApplyHandle() {
    const { ctx, app } = this;

    ctx.validate({
      applyId: { type: 'number', required: false, desc: '好友申请id' },
      nickname: { type: 'string', required: false, desc: '昵称' },
      lookme: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '看我' },
      lookhim: { type: 'int', required: true, range: { in: [ 0, 1 ] }, desc: '看他' },
      status: { type: 'string', required: true, range: { in: [ 'refuse', 'agree', 'ignore' ] }, desc: '处理结果' },
    });

    const applyId = parseInt(ctx.params.applyId);
    const { status, nickname, lookme, lookhim } = ctx.request.body;
    const stateUser = ctx.state.user;

    const friendApplyRecord = await app.model.FriendApplyModel.findOne({
      where: { id: applyId, friend_id: stateUser.id },
    });
    if (!friendApplyRecord) ctx.throw(400, '好友申请不存在');
    if (friendApplyRecord.status === 'refuse') ctx.throw(400, '已拒绝，不能重复操作');
    if (friendApplyRecord.status === 'agree') ctx.throw(400, '已同意，不能重复操作');
    if (friendApplyRecord.status === 'ignore') ctx.throw(400, '已忽略，不能重复操作');
    if (friendApplyRecord.status === 'expire') ctx.throw(400, '已过期，不能重复操作');

    // 创建事务
    const transaction = await app.model.transaction();
    try {
      // 1. 更新申请 status
      await friendApplyRecord.update({ status }, { transaction });

      if (status === 'agree') {
        // 2. 查询我是否已经添加过对方
        const queryMeRecord = await app.model.FriendModel.findOne({
          where: { user_id: stateUser.id, friend_id: friendApplyRecord.user_id },
          transaction,
        });
        // 3. 将对方 加入到我的好友列表
        if (!queryMeRecord) {
          await app.model.FriendModel.create({
            user_id: stateUser.id,
            friend_id: friendApplyRecord.user_id,
            nickname,
            lookme,
            lookhim,
          }, { transaction });
        }
        // 4. 查询对方是否已经添加过我
        const queryHimRecord = await app.model.FriendModel.findOne({
          where: { user_id: friendApplyRecord.user_id, friend_id: stateUser.id },
          transaction,
        });
        // 5. 将我 加入到对方的好友列表
        if (!queryHimRecord) {
          await app.model.FriendModel.create({
            user_id: friendApplyRecord.user_id,
            friend_id: stateUser.id,
            nickname: friendApplyRecord.nickname,
            lookme: friendApplyRecord.lookhim,
            lookhim: friendApplyRecord.lookme,
          }, { transaction });
        }
      }
      await transaction.commit(); // 提交事务
      ctx.resSuccess('好友申请处理成功');
    } catch (error) {
      await transaction.rollback(); // 回滚事务
      ctx.resFail('好友申请处理失败');
      // ctx.throw(500, '好友申请处理失败');
    }
  }
}

module.exports = FriendApplyController;
