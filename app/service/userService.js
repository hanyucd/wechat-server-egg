const { uniqueNamesGenerator } = require('unique-names-generator');
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
    return userInfo;
  }

  // 随机生成用户昵称
  randomNickname() {
    const { app } = this;

    // 定义你自己的中文词典数组
    const chineseAdjectives = [ '奔跑的', '沉睡的', '微笑的', '傲娇的', '机智的', '迷路的', '闪亮的', '温暖的', '安静的', '跳跃的' ];
    const chineseColors = [ '琥珀色', '星空蓝', '翡翠绿', '珊瑚红', '月光银', '大地棕', '芥末黄', '丁香紫', '炭黑色', '奶油白' ];
    const chineseAnimals = [ '熊猫', '朱雀', '玄龟', '麒麟', '白泽', '锦鲤', '仙鹤', '灵猫', '松鼠', '雄狮', '猛虎', '神龙' ];

    const nickname = uniqueNamesGenerator({
      dictionaries: [ chineseAdjectives, chineseColors, chineseAnimals ],
      separator: '',
      length: 3,
    });
    return nickname;
  }
}

module.exports = UserService;
