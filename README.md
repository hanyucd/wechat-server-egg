# 服务端: wechat-server-egg

技术栈：Egg.js + Mysql + Sequelize + Redis + JWT(token)

- egg-cors 跨域
- egg-valparams 参数校验
- egg-jwt token鉴权
- egg-sequelize 数据库ORM
- egg-redis redis缓存
- egg-oss 阿里云OSS
- bcryptjs 密码加密

## 全栈项目

- 前端：https://github.com/hanyucd/wechat-client-uni
- 后端：https://github.com/hanyucd/wechat-server-egg

### Docker 启动数据库容器 MySQL@8.4.7

```bash
# 拉取 MySQL 镜像
docker pull mysql:8.4.7
# 启动并后台运行 MySQL 容器，将 MySQL 数据目录映射到宿主机的 database 目录下，设置 MySQL root密码为 123456 **(必须)**
docker run -d --name mysql8.4 -p 3306:3306 -v ./database:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:8.4.7

# 启动容器
docker start mysql8.4
# 进入容器
docker exec -it mysql8.4 /bin/bash
# 进入 MySQL 命令行
mysql -u root -p
# 查看数据库
show databases;
# 退出 MySQL 命令行
exit
# 退出容器
exit
# 停止容器
docker stop mysql8.4
# 删除容器
docker rm mysql8.4
```

### MySQL 数据库

- MySQL 数据库对象命名规范： https://cloud.tencent.com/developer/article/1923882
- 21分钟 MySQL 入门教程：https://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html

```bash
# 进入 MySQL 命令行
mysql -u root -p
# 创建数据库
create database egg_wechat;
# 查看数据库
show databases;
# 使用数据库
use egg_wechat;
# 查看表
show tables;
```

### Sequelize ORM 生产环境同步数据库

```bash
npm install --save-dev sequelize-cli

# 1. 在项目根目录创建 .sequelizerc 文件，并写入：
const path = require("path");

module.exports = {
  "config": path.join(__dirname, "data-migrate/config.json"),
  "migrations-path": path.join(__dirname, "data-migrate/migrations"),
  "seeders-path": path.join(__dirname, "data-migrate/seeders"),
  "models-path": path.join(__dirname, "app/model"),
};

# 2. 初始化配置文件
npx sequelize init:config
# 3. 修改 database/config.json 中的数据库配置
...
# 4. 初始化迁移文件
npx sequelize init:migrations
# 5. 创建数据库
npx sequelize db:create
# 6. 创建数据库表 t_user
npx sequelize migration:generate --name=t_user
# 7. 迁移
npx sequelize db:migrate
# 撤消迁移
npx sequelize db:migrate:undo
# 撤消所有迁移,可以恢复到初始状态
npx sequelize db:migrate:undo:all
```

#### Sequelize 报错：nodejs.SequelizeDatabaseError: Too many keys specified; max 64 keys allowed

> 问题原因: MySQL InnoDB 存储引擎限制一张表最多只能包含 64 个次索引

```bash
当开发环境中使用 sequelize.sync({ alter: true }) 时，如果给非主键字段设置 unique: true 时，每次执行 sequelize.sync({ alter: true }) 时，都会创建一个新的索引，直到达到 64 个索引为止。

```
> 解决方法:

```bash
# 示例
sequelize.define('user', {
  email: {
    type: STRING(30),
    allowNull: false,
    comment: '邮箱',
    // unique: true, // 是否唯一 **（移除）**
  },
}, {
  indexes: [
    # 这里添加
    { unique: true, fields: ['email'] },
  ]
})
```
> 解决参考：

- https://juejin.cn/post/7052711737736298533
- https://github.com/sequelize/sequelize/issues/9653


### Docker 启动缓存数据库容器 Redis@8.4.0

```bash
# 拉取 Redis 镜像
docker pull redis:8.4.0
# 启动并后台运行 Redis 容器，将 Redis 数据目录映射到宿主机的 dataredis 目录下 | redis-server --requirepass "123456"：明确告诉 Redis 服务器启动时需要密码 --appendonly yes：建议加上，确保持久化生效
docker run -d --name redis8.4 -p 6379:6379 -v ./dataredis:/data redis:8.4.0 redis-server --requirepass "123456" --appendonly yes
# 启动容器
docker start redis8.4
# 进入容器
docker exec -it redis8.4 /bin/bash
# 连接时输入密码
redis-cli -a 123456
# 查看 Redis 版本
info
# 退出 Redis 命令行
exit
# 退出容器
exit
# 停止容器
docker stop redis8.4
# 删除容器
docker rm redis8.4
```

### Development

```bash
npm i
npm run dev
open http://localhost:7001/
```

### Deploy

```bash
npm start
npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

[egg]: https://eggjs.org
