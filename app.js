// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但还并未生效
    // 这是应用层修改配置的最后机会
    // 注意：此函数只支持同步调用
  }

  async didLoad() {
    // 所有配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义服务

    if (this.app.config.env === 'local' || this.app.config.env === 'unittest') {
      this.app.beforeStart(async () => {
        // await this.app.model.sync({ force: true });
        await this.app.model.sync({ alter: true });
      });
    }
  }

  async willReady() {
    // 所有插件已启动完毕，但应用整体尚未 ready
    // 可进行数据初始化等操作，这些操作成功后才启动应用
  }

  async didReady() {
    // 应用已启动完毕
  }

  async serverDidReady() {
    // http/https 服务器已启动，开始接收外部请求
    // 此时可以从 app.server 获取 server 实例
  }
}

module.exports = AppBootHook;
