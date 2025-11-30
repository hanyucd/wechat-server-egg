/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1763995494042_1699';

  config.cluster = {
    listen: {
      port: 3000,
      hostname: '0.0.0.0',
    },
  };

  config.middleware = [
    'errorMiddlewale',
    'authMiddleware',
  ];

  // 给自定义中间件添加配置参数
  config.errorMiddlewale = {
    desc: '给中间件添加 options 参数',
  };

  config.security = {
    csrf: {
      enable: false, // 关闭 csrf
    },
    domainWhiteList: [],
  };

  config.jwt = {
    secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_789',
    sign: {
      expiresIn: '10s',
      // expiresIn: '30m', // 30 分钟过期
      // expiresIn: '1h', // 1 小时过期
      // expiresIn: '7d', // 7 天过期
    },
  };

  // 参数校验配置
  config.valparams = {
    locale: 'zh-cn', // 设置错误信息的语言，例如 'zh-cn'
    throwError: true, // 校验失败时抛出异常
  };

  config.sequelize = {
    Sequelize: require('sequelize'), // 默认情况下，egg-sequelize 将使用 sequelize@5, 可以通过配置 sequelize 来指定版本
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '123456',
    port: 3306,
    database: 'egg_wechat',
    timezone: '+08:00', // 中国时区
    // 注：这里未生效，可在 app.js 中配置同步 | 同步数据库结构，force: true 会删除表，alter: true 会修改表结构
    // sync: { force: false, alter: true },
    define: {
      freezeTableName: true, // 取消数据表名复数
      timestamps: true, // 自动写入时间戳 created_at、updated_at
      underscored: true, // 转换列名的驼峰命名规则为下划线命令规则
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      // paranoid: true, // 字段生成软删除时间戳 deleted_at
      // deletedAt: 'deleted_at',
    },
  };

  config.redis = {
    Redis: require('ioredis'),
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '123456',
      db: 0,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
