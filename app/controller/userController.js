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
      username: {
        type: 'string',
        required: true,
        range: { min: 5, max: 20 },
        desc: '用户名',
      },
      password: {
        type: 'string',
        required: true,
        desc: '密码',
      },
      repassword: {
        type: 'string',
        required: true,
        desc: '确认密码',
      },
    }, {
      equals: [
        [ 'password', 'repassword' ],
      ],
    });

    const { username, password } = ctx.request.body;

    console.log('username: ', username);
    console.log('password:', password);

    // ctx.throw(400, '自爆一个错误');
    try {
      const user = await ctx.model.UserModel.create({
        username,
        password,
        nickname: '张三-李四',
      });

      ctx.resSuccess(user);
    } catch (error) {
      ctx.throw(400, '注册失败');
      // ctx.throw(400, error.message);
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

