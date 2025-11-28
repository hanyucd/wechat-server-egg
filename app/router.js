/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 设置路由前缀
  // router.prefix('/api');
  const apiRouter = router.namespace('/api');
  const apiAdminRouter = router.namespace('/api/admin');

  router.get('/status.ok', controller.homeController.statusOK);


  apiRouter.get('/user', controller.userController.find);
  // 用户注册
  apiRouter.post('/user/signin', controller.userController.userSignin);
  // 用户登录
  apiRouter.post('/user/login', controller.userController.userLogin);
};
