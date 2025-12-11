# 服务端: wechat-server-egg

技术栈：Egg.js + Mysql + Sequelize + Redis + JWT(token)

Egg.js 奉行 **“约定优于配置”**，按照一套统一的约定开发应用，将功能不同的代码分类放置到不同的目录下管理，这对整体团队的开发成本提升有着明显的效果。

- egg-cors 跨域
- egg-valparams 参数校验
- egg-jwt token鉴权
- egg-sequelize 数据库ORM
- egg-redis redis缓存（推荐用 node-redis）
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


### Sequelize 数据库表关联

```
由于在 Sequelize 中，表与表之间的关系是通过关联方法来定义的，而 references 是用于在模型定义中指定外键的引用：

1. 关系类型

- 一对一（One-to-One）：一个源模型实例关联一个目标模型实例。
- 一对多（One-to-Many）：一个源模型实例关联多个目标模型实例。
- 多对多（Many-to-Many）：一个源模型实例关联多个目标模型实例，同时一个目标模型实例也可以关联多个源模型实例。

2. 关联方法

- hasOne：表示一对一关系，但关系的外键存在于目标模型中。也就是说，源模型具有一个目标模型
- belongsTo：也表示一对一关系，但关系的外键存在于源模型中。也就是说，源模型属于目标模型。
- hasMany：表示一对多关系，关系的外键存在于目标模型中。也就是说，源模型具有多个目标模型
- belongsToMany：表示多对多关系，通过一个中间表（联结表）来连接两个模型。两个模型都可以拥有多个对方模型

3. references 的含义和用法

在模型 define 定义中，references 是用于定义外键的引用。它是在定义模型属性时，作为该属性（通常是外键）的一个配置项。references 对象包含两个属性：

- model：指定引用的模型。
- key：指定引用的模型中的键，默认为被引用模型的主键。
注意：references 只是指定了外键的引用，但并不会自动创建关联。关联需要通过上述的关联方法来创建

4. 总结

references 用于在模型属性中指定外键引用，但它不创建关联，只是数据库层面的外键约束。

关联方法（HasOne, BelongsTo, HasMany, BelongsToMany）用于建立模型之间的关联，并提供了 Sequelize 级别的关联方法（如获取关联数据）。

在一对一和一对多关系中，外键通常放在目标模型中（使用hasOne或hasMany），或者放在源模型中（使用belongsTo）。在多对多关系中，外键放在中间表中。

注意：在定义关联时，如果使用了外键（foreignKey），那么该外键必须在模型定义中存在（可以是通过 references 定义，也可以只是普通字段）。同时，关联方法中的 foreignKey 配置项应该与模型定义中的外键字段名一致

5. 关联方法的参数

  5.1 HasOne 和 HasMany 参数：

  - foreignKey：{String | Object} 外键字段名或配置 如果为字符串，则指定外键字段名；如果为对象，则可以详细配置外键字段（如名称、类型等）
  - sourceKey：{String} 源模型中的字段，作为关联的键。默认为源模型的主键
  - as：{String | Object} 别名。用于在查询中标识关联
  - onUpdate：{String} 参照完整性动作，可选值：'CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION'
  - onDelete：{String} 参照完整性动作，可选值：'CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION'
  - hooks：{Boolean} 别名。是否在关联操作时触发钩子
  - constraints：{Boolean} 是否在数据库层面创建外键约束。默认为true。设置为false可以避免创建约束

  5.2 BelongsTo 参数：

  - 以上 5.1 中的所有（排除 sourceKey）
  - targetKey：{String} 目标模型中的字段，作为关联的键。默认为目标模型的主键

  5.3 BelongsToMany 参数：

  - 以上 5.1 中的所有（排除 sourceKey）
  - through：{Model 或 String} 必须指定。可以是表示中间表的模型或字符串（表名）
  - targetKey：{String} 目标模型中的字段，作为关联的键。默认为目标模型的主键
  - constraints：{Boolean} 是否在数据库层面创建外键约束。默认为true。注意，多对多关联中，约束是针对中间表与两个模型之间的外键

6. onUpdate 和 onDelete 详解（完整性动作）

这两个选项用于定义参照完整性动作，当父表中的键被更新（onUpdate）或删除（onDelete）时，数据库应该如何处理子表中的外键

可选值及其含义：

CASCADE（级联）：
  onDelete: 'CASCADE' 删除父表记录时，自动删除所有关联的子表记录
  onUpdate: 'CASCADE' 更新父表主键时，自动更新子表外键为相同值

SET NULL（设为空）：
  onDelete: 'SET NULL' 删除父表记录时，将子表外键设为NULL
  onUpdate: 'SET NULL' 更新父表主键时，将子表外键设为NULL
  要求：外键字段必须允许NULL

RESTRICT（限制）：
  onDelete: 'RESTRICT' 如果存在关联的子表记录，则阻止删除父表记录
  onUpdate: 'RESTRICT' 如果存在关联的子表记录，则阻止更新父表主键

NO ACTION（无动作）：
  与 RESTRICT 类似，但检查时机可能不同（某些数据库在事务结束时检查）
  类似于RESTRICT，但有些数据库（如SQLite）中，NO ACTION在事务提交时才检查，而RESTRICT在语句执行时检查。

SET DEFAULT（设为默认值）：
  onDelete: 'SET DEFAULT' 删除父表记录时，将子表外键设为默认值
  onUpdate: 'SET DEFAULT' 更新父表主键时，将子表外键设为默认值
  注意：不是所有数据库都支持，需要数据库字段有默认值

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
