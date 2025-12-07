/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 设置路由前缀
  // router.prefix('/api');
  const apiRouter = router.namespace('/api');
  const apiAdminRouter = router.namespace('/api/admin');

  // 测试服务器是否正常
  apiRouter.get('/status.ok', controller.homeController.statusOK);

  // 用户注册
  apiRouter.post('/user/signin', controller.userController.userSignin);
  // 用户登录
  apiRouter.post('/user/login', controller.userController.userLogin);
  // 用户退出登录
  apiRouter.post('/user/logout', controller.userController.userLogout);
  // 用户搜索
  apiRouter.get('/user/search', controller.userController.userSearch);
};
