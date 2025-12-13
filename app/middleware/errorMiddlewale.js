
module.exports = (options, app) => {
  return async function errorMiddlewale(ctx, next) {
    try {
      console.log('start-错误中间件');
      const result = await next();
      console.log('end-错误中间件');
      // 404 处理
      if (ctx.status === 404 && !ctx.body) {
        ctx.body = {
          code: 404,
          msg: 'fail',
          data: '404 错误',
        };
      }
    } catch (err) {
      // 记录一条错误日志
      app.emit('err', err, ctx);
      // console.log('err-错误中间件：', err);

      const errStatus = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      let errMessage = (errStatus === 500 && app.config.env === 'prod')
        ? 'Server Internal Error'
        : err.message;

      console.log('错误中间件-err status: ', err.status);
      console.log('错误中间件-err message: ', err.message);

      // 参数验证异常
      if (errStatus === 422 && err.message === 'Validation Failed') {
        if (err.errors && Array.isArray(err.errors)) {
          errMessage = err.errors[0].err[0] ? err.errors[0].err[0] : err.errors[0].err[1];
        }
      }

      ctx.body = {
        code: errStatus,
        msg: errMessage,
        data: null,
      };

      ctx.status = errStatus;
    }
  };
};
