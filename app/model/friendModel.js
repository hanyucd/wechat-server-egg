const dayjs = require('dayjs');

/**
 * 好友表
 */
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const FriendModel = app.model.define('friendModel', {
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
      onUpdate: 'restrict', // restrict 父表更新时 阻止更新关联的该记录
      onDelete: 'cascade', // cascade 父表删除时 级联删除关联的该记录
    },
    friend_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '好友ID',
      references: {
        model: 't_user',
        key: 'id',
      },
      onUpdate: 'restrict',
      onDelete: 'cascade',
    },
    nickname: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '好友备注',
    },
    lookme: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: '能否看我朋友圈：0否 1是',
    },
    lookhim: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: '能否看他朋友圈：0否 1是',
    },
    isstar: {
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
    tableName: 't_friend', // 表名
    indexes: [
      {
        name: 'idx_userid_friendid',
        unique: true, // 开启唯一约束
        // 保证相同 user_id 和 friend_id 记录只能在friendModel(好友表)中存在唯一的一条
        // 复合索引 | 指定哪几个字段组合必须唯一
        fields: [ 'user_id', 'friend_id' ],
      },
      { name: 'idx_user_id', fields: [ 'user_id' ] },
      { name: 'idx_friend_id', fields: [ 'friend_id' ] },
    ],
  });

  // 定义关联关系
  FriendModel.associate = function() {
    const { UserModel, TagModel, FriendTagModel } = app.model;

    // 定义关联关系：好友表 属于 用户表（作为好友）
    // as: 简单来说，定义关系中的 as 是“起名字”，查询函数中的 as 是“叫名字”。 只有名字叫对了，才能把人（数据）喊出来。
    FriendModel.belongsTo(UserModel, {
      foreignKey: 'friend_id',
      targetKey: 'id',
      as: 'friend',
    });

    // 定义关联关系：好友表 属于 用户表（作为用户）
    FriendModel.belongsTo(UserModel, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'user',
    });

    // 定义关联关系：好友表 与 标签表 多对多关联关系
    FriendModel.belongsToMany(TagModel, {
      through: FriendTagModel,
      foreignKey: 'friend_id',
      otherKey: 'tag_id',
      as: 'tags',
    });
  };

  return FriendModel;
};
