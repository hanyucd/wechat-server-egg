/* eslint valid-jsdoc: "off" */

// const errorMiddlewale = require("../app/middleware/errorMiddlewale");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1763995494042_1699';

  // add your middleware config here
  config.middleware = [
    'errorMiddlewale',
    'authMiddleware',
  ];

  // 给中间件添加配置参数
  config.errorMiddlewale = {
    desc: '给中间件添加 options 参数',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.cluster = {
    listen: {
      port: 3000,
      hostname: '0.0.0.0',
      // path: '/var/run/egg.sock',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
