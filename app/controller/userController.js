const bcryptUtil = require('../utils/bcryptUtil');
const Controller = require('egg').Controller;

class UserController extends Controller {
  async find(options) {
    const { ctx, app } = this;
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
    const { ctx, app } = this;

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

    const findUser = await app.model.UserModel.findOne({ where: { username } });
    if (findUser) ctx.throw(400, '用户名已存在');

    const regUser = await app.model.UserModel.create({ username, password });
    if (!regUser) ctx.throw(400, '注册失败');

    ctx.resSuccess(regUser);
  }

  /**
   * 登录
   */
  async userLogin() {
    const { ctx, app, service } = this;

    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
    });

    const { username, password } = ctx.request.body;
    // 验证该用户是否存在 | 验证该用户状态是否启用
    const findUser = await app.model.UserModel.findOne({
      where: { username, status: 1 },
      // 排除查询出 ? 字段
      // attributes: { exclude: [ 'status' ] },
    });
    if (!findUser) ctx.throw(400, '用户不存在或已被禁用');

    // 验证密码是否正确
    const passwordCompare = bcryptUtil.bcryptCompare(password, findUser.password);
    if (!passwordCompare) ctx.throw(400, '密码错误');

    const loginUser = findUser.toJSON();
    delete loginUser.password;

    const userToken = service.userService.signToken(loginUser);
    // 添加 token 到返回数据中
    loginUser.token = userToken;

    const redisResult = await service.redisService.set(`user_${loginUser.id}`, userToken);
    console.log('redisResult', redisResult);

    ctx.resSuccess(loginUser);
  }
}

module.exports = UserController;

