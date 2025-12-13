module.exports = {
  // 成功提示
  resSuccess(data = '', msg = 'ok', code = 0) {
    this.body = { msg, data, code };
    this.status = 200;
  },
  // 失败提示
  resFail(data = '', msg = 'fail', code = 400) {
    this.body = { msg, data, code };
    this.status = 200;
  },
};
