/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 设置全局前缀
  router.prefix('/api');

  router.get('/', controller.home.index);
  router.get('/user', controller.userController.find);
};
