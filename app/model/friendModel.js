/**
 * 好友表
 */
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const FriendModel = app.model.define('friend', {
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
      references: { //  1. references 用于在模型属性中指定外键引用，但它不创建关联，只是数据库层面的外键约束 | 需要结合关联方法使用
        model: 't_user', // 2. 指向哪个表的表名（这里用您Model中定义的tableName）
        key: 'id', // 3. 指向目标表的哪个字段
      },
      onUpdate: 'restrict', // restrict 更新时操作: 阻止更新引用的键
      onDelete: 'cascade', // cascade 删除时操作：删除引用的键时，级联删除关联的记录
    },
    friend_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '好友ID',
      references: {
        model: 't_user',
        key: 'id',
      },
    },
    nickname: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '备注',
    },
    lookme: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: '看我：0否 1是',
    },
    lookhim: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: '看他：0否 1是',
    },
    star: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 0,
      comment: '是否为星标朋友：0否 1是',
    },
    isblack: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 0,
      comment: '是否加入黑名单：0否 1是',
    },
  }, {
    tableName: 't_friend', // 表名
    indexes: [
      // { unique: true, fields: [ 'user_id', 'friend_id' ] },
    ],
  });

  return FriendModel;
};
