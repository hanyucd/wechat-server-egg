const dayjs = require('dayjs');

/**
 * 好友申请表
 */
module.exports = app => {
  const { STRING, INTEGER, ENUM, DATE, NOW } = app.Sequelize;

  const FriendApplyModel = app.model.define('friendApply', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID',
    },
    user_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '用户ID',
      references: {
        model: 't_user',
        key: 'id',
      },
      onUpdate: 'restrict',
      onDelete: 'cascade',
    },
    friend_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '申请好友ID',
      references: {
        model: 't_user',
        key: 'id',
      },
    },
    status: {
      type: ENUM,
      values: [ 'pending', 'refuse', 'agree', 'ignore', 'expire' ],
      allowNull: false,
      defaultValue: 'pending',
      comment: '申请状态',
    },
    expire_time: {
      type: DATE,
      // defaultValue: NOW, // 当期时间
      defaultValue: () => dayjs().add(10, 'minute').toDate(), // 过期时间默认值为 10 分钟
      // defaultValue: () => dayjs().add(3, 'day').toDate(), // 过期时间默认值为 3 天
      allowNull: false,
      comment: '过期时间',
    },
  }, {
    tableName: 't_friend_apply',
  });

  return FriendApplyModel;
};
