const dayjs = require('dayjs');
const bcryptUtil = require('../utils/bcryptUtil');

/**
 * 用户表
 */
module.exports = app => {
  const { INTEGER, STRING, DATE, ENUM } = app.Sequelize;

  const UserModel = app.model.define('userModel', {
    id: {
      // .UNSIGNED 表示该字段为无符号整数 无符号整数只能存储非负值（0 和正数
      // 相比有符号整数可以存储更大的正数值范围，无符号 INTEGER：0 到 4294967295
      type: INTEGER(20).UNSIGNED,
      primaryKey: true, // 主键
      autoIncrement: true, // 自增
      comment: '主键ID', // 注释
    },
    username: {
      type: STRING(30), // 字符串类型, 长度为 30
      allowNull: false, // 是否允许为空
      defaultValue: '', // 默认值
      comment: '用户账号', // 注释
      // unique: true, // 是否唯一
    },
    password: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      comment: '账号密码',
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
    avatar: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      comment: '头像',
    },
    status: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: '状态 1: 正常、0: 禁用',
    },
    created_at: {
      type: DATE,
      get() {
        const val = this.getDataValue('created_at');
        return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : val;
      },
    },
    updated_at: {
      type: DATE,
      get() {
        const val = this.getDataValue('updated_at');
        return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : val;
      },
    },
  }, {
    tableName: 't_user', // 表名
    indexes: [
      { unique: true, fields: [ 'username' ] },
    ],
  });

  return UserModel;
};
