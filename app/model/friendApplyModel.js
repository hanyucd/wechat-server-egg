/**
 * 好友申请表
 */
module.exports = app => {
  const { STRING, INTEGER, ENUM } = app.Sequelize;

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
      values: [ 'pending', 'refuse', 'agree', 'ignore' ],
      allowNull: false,
      defaultValue: 'pending',
      comment: '申请状态',
    },
  }, {
    tableName: 't_friend_apply',
    indexes: [
      { unique: true, fields: [ 'user_id', 'friend_id' ] },
    ],
  });

  return FriendApplyModel;
};
