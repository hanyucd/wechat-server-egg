// 'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  /**
   * fff
   */
  async find(options) {
    const { ctx } = this;
    // ctx.body = await ctx.service.user.find();
    ctx.body = {
      name: '张三',
      age: 18,
    };

    return {
      name: '李四',
      age: 18,
    };
  }
}

module.exports = UserController;

