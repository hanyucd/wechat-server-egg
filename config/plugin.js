/** @type Egg.EggPlugin */
module.exports = {
  // 路由 插件
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
  // 跨域 插件
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // 数据库 ORM 插件
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
};
