/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 设置路由前缀
  // router.prefix('/api');
  const apiAppRouter = router.namespace('/api');
  const apiAdminRouter = router.namespace('/api/admin');

  // 测试服务器是否正常
  apiAppRouter.get('/status.ok', controller.homeController.statusOK);

  // 用户注册
  apiAppRouter.post('/user/signin', controller.userController.userSignin);
  // 用户登录
  apiAppRouter.post('/user/login', controller.userController.userLogin);
  // 用户退出登录
  apiAppRouter.post('/user/logout', controller.userController.userLogout);
  // 用户搜索
  apiAppRouter.get('/user/search', controller.userController.userSearch);
  // 申请添加好友
  apiAppRouter.post('/friend/apply', controller.friendApplyController.friendApply);
  // 获取好友申请列表
  apiAppRouter.get('/friend/apply/list', controller.friendApplyController.friendApplyList);
  // 处理好友申请
  apiAppRouter.post('/friend/apply/handle/:applyId', controller.friendApplyController.friendApplyHandle);
};
