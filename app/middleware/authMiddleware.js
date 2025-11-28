module.exports = (options, app) => {
  return async function authMiddleware(ctx, next) {
    console.log('授权验证-开始');
    await next();
    console.log('授权验证-结束');
  };
};
