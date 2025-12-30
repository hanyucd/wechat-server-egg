const dayjs = require('dayjs');
const Subscription = require('egg').Subscription;

class FriendApplyExpireSchedule extends Subscription {
  /**
   * 通过 schedule 属性来设置定时任务的执行间隔等配置
   */
  static get schedule() {
    return {
      interval: '1m', // 1 分钟间隔
      type: 'worker', // worker: 随机挑选一个 worker 执行，避免重复执行 | all: 每个进程（worker）都会执行。如果你的应用启动了多个·
      immediate: true, // 应用启动完成后立即执行一次
      disable: true, // 配置该参数为 true 时，这个定时任务不会被启动
    };
  }

  /**
   * 定时任务：检查好友申请是否过期
   */
  async subscribe() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;

    try {
      // 将所有 pending 状态且已过期的申请更新为 expire
      const [ count ] = await app.model.FriendApplyModel.update({
        status: 'expire',
      }, {
        where: {
          status: 'pending',
          expire_time: {
            // 小于等于当前时间，即已过期
            [Op.lte]: dayjs().toDate(),
            // [Op.lte]: new Date(),
          },
        },
      });

      if (count > 0) {
        ctx.logger.info(`[FriendApplyExpireSchedule] 已处理 ${count} 条好友过期申请`);
      }
      console.log(`[FriendApplyExpireSchedule] 已处理 ${count} 条好友过期申请`);
    } catch (error) {
      ctx.logger.error('[FriendApplyExpireSchedule] 运行出错:', error);
    }
  }
}

module.exports = FriendApplyExpireSchedule;
