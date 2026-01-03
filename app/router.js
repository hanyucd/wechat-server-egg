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
  // 举报用户/群聊
  apiAppRouter.post('/user/report', controller.userController.userReport);

  // 申请添加好友
  apiAppRouter.post('/friend/apply', controller.friendApplyController.friendApply);
  // 获取好友申请列表
  apiAppRouter.get('/friend/apply/list', controller.friendApplyController.friendApplyList);
  // 处理好友申请
  apiAppRouter.post('/friend/apply/handle/:applyId', controller.friendApplyController.friendApplyHandle);
  // 待处理好友申请 count
  apiAppRouter.get('/friend/apply/pending/count', controller.friendApplyController.friendApplyPendingCount);
  // 获取好友列表(通讯录)
  apiAppRouter.get('/friend/list', controller.friendController.friendList);
  // 查看好友资料
  apiAppRouter.get('/friend/info/:friendId', controller.friendController.friendInfo);
  // 设置好友星标
  apiAppRouter.post('/friend/set-star/:friendId', controller.friendController.friendSetStar);
  // 设置好友拉黑
  apiAppRouter.post('/friend/set-black/:friendId', controller.friendController.friendSetBlack);
  // 朋友圈设置查看权限
  apiAppRouter.post('/friend/circle-setlook/:friendId', controller.friendController.friendCircleSetLook);
  // 设置好友标签和备注
  apiAppRouter.post('/friend/set-remark-tag/:friendId', controller.friendController.friendSetTagAndRemark);

  // 配置 WebSocket 全局中间件
  app.ws.use(async (ctx, next) => {
    console.log('websocket open');
    await next();
    console.log('websocket closed');
  });

  // websocket
  app.ws.route('/ws', controller.chatController.connect);
};
