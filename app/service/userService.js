
const Service = require('egg').Service;

class UserService extends Service {
  /**
   * 生成token
   * @param {*} userInfo 用户信息
   */
  signToken(userInfo) {
    const { app } = this;

    const userToken = app.jwt.sign(userInfo, app.config.jwt.secret);
    return userToken;
  }

  /**
   * 验证token
   * @param {*} token token
   */
  verifyToken(token) {
    const { app } = this;

    const userInfo = app.jwt.verify(token, app.config.jwt.secret);
    console.log('userInfo: ', userInfo);
    return userInfo;
  }
}

module.exports = UserService;
