const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'egg service';
  }

  async statusOK() {
    const { ctx } = this;
    // ctx.body = 'service ok';
    ctx.resSuccess('service ok');
  }
}

module.exports = HomeController;
