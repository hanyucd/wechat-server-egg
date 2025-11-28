
module.exports = (options, app) => {
  return async function errorMiddlewale(ctx, next) {
    try {
      console.log('错误处理-开始');
      const result = await next();
      console.log('错误处理-结束');
      // 404 处理
      if (ctx.status === 404 && !ctx.body) {
        ctx.body = {
          code: 404,
          msg: 'fail',
          data: '404 错误',
        };
      }
    } catch (error) {
      // 记录一条错误日志
      app.emit('error', error, ctx);

      const status = error.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const errorMsg = (status === 500 && app.config.env === 'prod')
        ? 'Server Internal Error'
        : error.message;

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        code: status,
        msg: 'fail',
        data: errorMsg,
      };
      ctx.status = status;
    }
  };
};
