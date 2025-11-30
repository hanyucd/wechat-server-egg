/** @type Egg.EggPlugin */
module.exports = {
  // 路由
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
  // cors 跨域
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // 参数校验
  valparams: {
    enable: true,
    package: 'egg-valparams',
  },
  // token 鉴权
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  // 数据库 ORM
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  // 缓存
  redis: {
    enable: true,
    package: 'egg-redis',
  },
};
