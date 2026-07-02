module.exports = {
  // 成功提示
  resSuccess(data = '', msg = 'ok', code = 0) {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
    this.body = { msg, data, code };
    this.status = 200;
  },
  // 失败提示
  resFail(data = '', msg = 'fail', code = 400) {
    this.body = { msg, data, code };
    this.status = 200;
  },
};
