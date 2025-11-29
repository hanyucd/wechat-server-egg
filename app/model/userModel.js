const bcryptUtil = require('../utils/bcryptUtil');

module.exports = app => {
  const { INTEGER, STRING, DATE, ENUM } = app.Sequelize;

  const UserModel = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true, // 主键
      autoIncrement: true, // 自增
      comment: '主键ID', // 注释
    },
    username: {
      type: STRING(30),
      allowNull: false, // 是否允许为空
      defaultValue: '', // 默认值
      comment: '用户名称', // 注释
      unique: true, // 是否唯一
    },
    password: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      comment: '密码',
      set(value) {
        const passwordHash = bcryptUtil.bcryptHash(value);
        this.setDataValue('password', passwordHash);
      },
    },
    nickname: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
      comment: '昵称',
    },
  }, {
    tableName: 't_user', // 表名
  });

  return UserModel;
};
