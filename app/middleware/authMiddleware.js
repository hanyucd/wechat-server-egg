module.exports = (options, app) => {
  return async function authMiddleware(ctx, next) {
    try {
      console.log('授权验证-开始');
      next();
      console.log('授权验证-结束');
    } catch (error) {
      console.log('error:', error);
    }
  };
};
