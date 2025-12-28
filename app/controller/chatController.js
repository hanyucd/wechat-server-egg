const { Controller } = require('egg');

class ChatController extends Controller {
  /**
   * websocket 连接
   */
  // 常见的关闭代码 { code: 1000, reason: '' }
  // 1000 - 正常关闭
  // 1001 - 端点离开
  // 1002 - 协议错误
  // 1003 - 无法处理的数据类型
  // 1005 - 无状态码
  // 1006 - 异常关闭
  // 1008 - 策略违规
  // 1009 - 消息过大
  // 1011 - 服务器错误
  async connect() {
    const { ctx, app, service } = this;

    if (!ctx.websocket) {
      ctx.throw(400, '非法访问');
    }

    console.log('client connected');

    ctx.websocket
      .on('message', msg => {
        console.log('receive', msg);
      })
      .on('close', (code, reason) => {
        console.log('websocket 已关闭', code, reason);
      });
  }
}

module.exports = ChatController;
