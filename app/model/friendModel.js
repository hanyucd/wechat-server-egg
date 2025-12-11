module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const FriendModel = app.model.define('t_friend', {
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
    },
    friend_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '好友ID',
      references: {
        model: 't_user', // 对应表名称（数据表名称）
        key: 'id', // 对应表的主键
      },
    },
  }, {
    tableName: 't_friend', // 表名
    indexes: [
      // { unique: true, fields: [ 'user_id', 'friend_id' ] },
    ],
  });

  return FriendModel;
};
