module.exports = (options, app) => {
  return async function authMiddleware(ctx, next) {
    console.log('start-授权中间件');

    const { authorization } = ctx.header;
    if (!authorization) ctx.throw(401, '您没有权限访问该接口!');

    const token = authorization.split('Bearer ')[1];
    let authUser = null;

    try {
      authUser = ctx.service.userService.verifyToken(token);
    } catch (error) {
      const errMsg = error.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
      ctx.throw(401, errMsg);
    }
    // console.log('authUser:', authUser);

    // 查询用户
    let loginUser = await app.model.UserModel.findByPk(authUser.id);
    loginUser = loginUser.toJSON();
    if (!loginUser || loginUser.status === 0) ctx.throw(400, '用户不存在或已被禁用');

    // 把 user 信息挂载到全局 ctx 上
    ctx.state.user = loginUser;

    await next();
    console.log('end-授权中间件');
  };
};
