const Controller = require('egg').Controller;

class UserController extends Controller {
  async find(options) {
    const { ctx } = this;
    // ctx.body = await ctx.service.user.find();
    ctx.resSuccess({
      name: '张三-李四',
      age: 18,
    });
  }

  /**
   * 注册
   */
  async userSignin() {
    const { ctx } = this;

    const { username, password } = ctx.request.body;

    console.log('username: ', username);
    console.log('password:', password);

    try {
      const userRes = await ctx.model.UserModel.create({
        username,
        password,
        nickname: '张三-李四',
      });

      ctx.resSuccess(userRes);
    } catch (error) {
      ctx.throw(400, '注册失败');
      // ctx.throw(400);
    }
    // ctx.resSuccess('注册成功');
  }

  /**
   * 登录
   */
  async userLogin() {
    const { ctx } = this;
  }
}

module.exports = UserController;

