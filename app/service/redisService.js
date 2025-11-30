
const Service = require('egg').Service;

class RedisService extends Service {
  /**
   * 设置 redis 缓存
   * @param { String } key 键
   * @param {String | Object | array} value 值
   * @param { Number } expir 过期时间 单位秒
   * @return { String } 返回成功字符串OK
   */
  async set(key, value, expir = 0) {
    const { app } = this;

    if (expir === 0) {
      return await app.redis.set(key, JSON.stringify(value));
    }
    return await app.redis.set(key, JSON.stringify(value), 'EX', expir);
  }

  /**
   * 获取 redis 缓存
   * @param { String } key 键
   * @return { String | array | Object } 返回获取的数据
   */
  async get(key) {
    const { app } = this;

    const result = await app.redis.get(key);
    return JSON.parse(result);
  }
}

module.exports = RedisService;

