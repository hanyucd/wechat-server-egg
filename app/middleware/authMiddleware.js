module.exports = (options, app) => {
  return async function authMiddleware(ctx, next) {
    console.log('授权中间件-start');
    await next();
    console.log('授权中间件-end');
  };
};
