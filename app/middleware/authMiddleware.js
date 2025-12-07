module.exports = (options, app) => {
  return async function authMiddleware(ctx, next) {
    console.log('start-授权中间件');

    const { authorization } = ctx.header;
    if (!authorization) ctx.throw(401, '您没有权限访问该接口!');

    const token = authorization.split('Bearer ')[1];
    let jwtUser = null;

    try {
      jwtUser = ctx.service.userService.verifyToken(token);
    } catch (error) {
      const errMsg = error.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
      ctx.throw(401, errMsg);
    }

    // redis 获取 token
    const redisGetToken = await ctx.service.redisService.get(`user:${jwtUser.id}`);
    console.log('redisGetToken: ', redisGetToken);
    // if (!redisGetToken || token !== redisGetToken) ctx.throw(401, 'Token 令牌不合法!');


    // 查询用户
    let loginUser = await app.model.UserModel.findByPk(jwtUser.id);
    loginUser = loginUser.toJSON();
    if (!loginUser || loginUser.status === 0) ctx.throw(400, '用户不存在或已被禁用');

    // 把 user 信息挂载到全局 ctx 上
    ctx.state.user = loginUser;

    await next();
    console.log('end-授权中间件');
  };
};
