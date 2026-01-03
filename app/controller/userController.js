const Controller = require('egg').Controller;
const bcryptUtil = require('../utils/bcryptUtil');

class UserController extends Controller {
  /**
   * 注册
   */
  async userSignin() {
    const { ctx, app, service } = this;

    // 校验失败时 throw 异常
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
    // 随机生成用户昵称
    const randomNickname = service.userService.randomNickname();

    const regUser = await app.model.UserModel.create({ username, password, nickname: randomNickname });
    if (!regUser) ctx.throw(400, '注册失败');

    ctx.resSuccess({ username: regUser.toJSON().username });
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
    // 添加 token 到返回 body 中
    loginUser.token = userToken;

    // token 存入 redis 过期时间为 1 天
    const redisSetToken = await service.redisService.set(`user:${loginUser.id}`, userToken, 1 * 24 * 60 * 60);
    console.log('redisSetToken: ', redisSetToken);

    ctx.resSuccess(loginUser);
  }

  /**
   * 退出登录
   */
  async userLogout() {
    const { ctx, service } = this;
    const stateUser = ctx.state.user;
    console.log('stateUser:', stateUser);

    const redisRemoveToken = await service.redisService.remove(`user:${stateUser.id}`);
    console.log('redisRemoveToken: ', redisRemoveToken);
    ctx.resSuccess('退出成功');
  }

  /**
   * 搜索用户
   */
  async userSearch() {
    const { ctx, app } = this;

    ctx.validate({
      keyword: { type: 'string', required: true, desc: '关键词' },
    });
    const { keyword } = ctx.query;

    const searchUser = await app.model.UserModel.findOne({
      where: { username: keyword.trim() },
      // 排除字段
      attributes: { exclude: [ 'password' ] },
    });

    ctx.resSuccess(searchUser ? searchUser.toJSON() : null);
  }

  /**
   * 举报用户/群聊
   */
  async userReport() {
    const { ctx, app } = this;

    ctx.validate({
      target_id: { type: 'int', required: true, desc: '被举报人/群聊ID' },
      report_type: { type: 'string', required: true, range: { in: [ 'user', 'group' ] }, desc: '举报类型：user用户 group群聊' },
      category: { type: 'string', required: true, desc: '举报分类' },
      content: { type: 'string', required: true, desc: '举报内容' },
    });

    const { target_id, report_type, content, category } = ctx.request.body;
    const stateUser = ctx.state.user;
    // 不能举报自己
    if (report_type === 'user' && target_id === stateUser.id) ctx.throw(400, '不能举报自己');

    const reportRecord = await app.model.ReportModel.create({
      user_id: stateUser.id,
      target_id,
      content,
      report_type,
      category,
    });
    if (!reportRecord) ctx.throw(500, '举报失败');

    ctx.resSuccess(reportRecord.toJSON());
  }
}

module.exports = UserController;

