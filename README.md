# 服务端: wechat-searver-egg

技术栈：Eggjs + Mysql + Sequelize + Redis + JWT(token)

## 全栈项目

- 前端：https://github.com/hanyucd/wechat-client-uni
- 后端：https://github.com/hanyucd/wechat-server-egg

### Docker 安装数据库 MySQL@8.4.7

```bash
# 拉取 MySQL 镜像
docker pull mysql:8.4.7
# 启动并后台运行 MySQL 容器，将 MySQL 数据目录映射到宿主机的 sqldata 目录下，设置 MySQL root密码为 123456 **(必须)**
docker run -d --name mysql8.4 -p 3306:3306 -v ./sqldata:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:8.4.7

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

### Sequelize ORM

```bash
npm install --save-dev sequelize-cli

# 在项目根目录创建 .sequelizerc 文件，并写入：
const path = require("path");

module.exports = {
  config: path.join(__dirname, "database/config.json"),
  "migrations-path": path.join(__dirname, "database/migrations"),
  "seeders-path": path.join(__dirname, "database/seeders"),
  "models-path": path.join(__dirname, "app/model"),
};

# 初始化配置文件
npx sequelize init:config
# 修改 database/config.json 中的数据库配置
...
# 初始化迁移文件
npx sequelize init:migrations
# 创建数据库
npx sequelize db:create
# 创建数据库表 t_user
npx sequelize migration:generate --name=t_user
# 迁移
npx sequelize db:migrate
# 撤消迁移
npx sequelize db:migrate:undo
# 撤消所有迁移,可以恢复到初始状态
npx sequelize db:migrate:undo:all
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
