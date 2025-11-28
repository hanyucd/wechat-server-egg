/**
 * 未使用
 */
module.exports = (options, app) => {
  return async function responseMiddleware(ctx, next) {
    try {
      await next();
    } catch (error) {
      ctx.throw(400, '响应中间错误');
    }
  };
};
