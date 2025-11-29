'use strict';

module.exports = {
  // up: 负责创建和修改数据库结构
  up: async (queryInterface, Sequelize) => {
    // 解构出所需的数据类型
    const { INTEGER, STRING, DATE } = Sequelize;

    // 创建表 t_user
    await queryInterface.createTable('t_user', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键ID',
      },
      username: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        unique: true, // 保持唯一性约束
        comment: '用户名称',
      },
      password: {
        type: STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '密码',
      },
      nickname: {
        type: STRING(50),
        allowNull: false,
        defaultValue: '',
        comment: '昵称',
      },
      // ⚠️ 必须手动添加时间戳字段
      created_at: {
        type: DATE,
        allowNull: false,
      },
      updated_at: {
        type: DATE,
        allowNull: false,
      },
    });
  },

  // down: 负责撤销 up 函数的操作
  down: async (queryInterface, Sequelize) => {
    // 删除表 t_user
    await queryInterface.dropTable('t_user');
  },
};
