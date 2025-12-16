const dayjs = require('dayjs');

/**
 * 举报表
 */
module.exports = app => {
  const { STRING, TEXT, INTEGER, ENUM, DATE } = app.Sequelize;

  const ReportModel = app.model.define('reportModel', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID',
    },
    user_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '举报人ID',
      references: {
        model: 't_user',
        key: 'id',
      },
      onUpdate: 'restrict',
      onDelete: 'cascade',
    },
    target_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '被举报人/群聊ID',
    },
    report_type: {
      type: ENUM,
      values: [ 'user', 'group' ],
      allowNull: false,
      defaultValue: 'user',
      comment: '举报类型：user用户 group群聊',
    },
    category: {
      type: STRING(10),
      allowNull: true,
      defaultValue: '',
      comment: '举报分类',
    },
    content: {
      type: TEXT,
      allowNull: true,
      defaultValue: '',
      comment: '举报内容',
    },
    status: {
      type: ENUM,
      values: [ 'pending', 'refuse', 'agree', 'ignore' ],
      allowNull: false,
      defaultValue: 'pending',
      comment: '举报状态',
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
    tableName: 't_report', // 表名
  });

  ReportModel.associate = function() {
    const { UserModel } = app.model;

    // 定义关联关系：举报表 属于 用户表（作为举报人）
    ReportModel.belongsTo(UserModel, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return ReportModel;
};
