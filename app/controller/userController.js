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

    ctx.validate({
      // range 参数范围控制
      username: { type: 'string', required: true, range: { min: 5, max: 20 }, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
      repassword: { type: 'string', required: true, desc: '确认密码' },
    }, {
      // equals 参数比较是否相等
      equals: [
        [ 'password', 'repassword' ],
      ],
    });

    const { username, password } = ctx.request.body;

    const user = await ctx.model.UserModel.create({
      username,
      password,
      nickname: '张三-李四',
    });

    ctx.resSuccess(user);
    // ctx.throw(400, '注册失败');
  }

  /**
   * 登录
   */
  async userLogin() {
    const { ctx } = this;
  }
}

module.exports = UserController;

