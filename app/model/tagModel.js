const dayjs = require('dayjs');

/**
 * 标签表
 */
module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize;

  const TagModel = app.model.define('tagModel', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID',
    },
    name: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '标签名称',
    },
    user_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '创建用户ID',
      references: {
        model: 't_user',
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
    tableName: 't_tag', // 表名
    indexes: [
      { unique: true, fields: [ 'name' ] },
    ],
  });

  TagModel.associate = function() {
    const { FriendModel, FriendTagModel } = app.model;

    // 定义 tag 与 friend 多对多关联关系
    TagModel.belongsToMany(FriendModel, {
      through: FriendTagModel,
      foreignKey: 'tag_id',
      otherKey: 'friend_id',
      as: 'friends',
    });
  };


  return TagModel;
};

