const dayjs = require('dayjs');

/**
 * 好友标签表
 */
module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize;

  const FriendTagModel = app.model.define('friendTagModel', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID',
    },
    friend_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '好友ID',
      references: {
        model: 't_friend',
        key: 'id',
      },
      onUpdate: 'restrict',
      onDelete: 'cascade',
    },
    tag_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '标签ID',
      references: {
        model: 't_tag',
        key: 'id',
      },
      onUpdate: 'restrict',
      onDelete: 'cascade',
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
    tableName: 't_friend_tag', // 表名
  });

  return FriendTagModel;
};

