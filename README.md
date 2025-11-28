# 服务端: wechat-searver-egg

技术栈：eggjs + mysql + sequelize + redis + jwt

## 全栈项目

- 前端：https://github.com/hanyucd/wechat-client-uni
- 后端：https://github.com/hanyucd/wechat-searver-egg

### Docker 安装数据库 MySQL@8.4.7

```bash
# 拉取 MySQL 镜像
docker pull mysql:8.4.7
# 启动并后台运行 MySQL 容器，将 MySQL 数据目录映射到宿主机的 mysqldata 目录下，设置 MySQL root密码为 123456 **(必须)**
docker run -d --name mysql8.4 -p 3306:3306 -v ./mysqldata:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:8.4.7

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

```bash
# 进入 MySQL 命令行
mysql -u root -p
# 创建数据库
create database egg_wechat;
# 查看数据库
show databases;
# 使用数据库
use wechat;
# 查看表
show tables;
```

- MySQL 数据库对象命名规范： https://cloud.tencent.com/developer/article/1923882
- 21分钟 MySQL 入门教程：https://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html


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
