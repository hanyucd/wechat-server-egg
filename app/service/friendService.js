const Service = require('egg').Service;

class FriendService extends Service {

  /**
   * 处理好友申请
   */
  async friendApplyHandle(applyId, status, nickname, lookme, lookhim) {
    const { ctx, app } = this;
  }
}

module.exports = FriendService;
