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
      comment: '能否看我朋友圈：0否 1是',
    },
    lookhim: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: '能否看他朋友圈：0否 1是',
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
      allowNull: false,
      // defaultValue: NOW, // 当期时间
      // defaultValue: () => dayjs().add(3, 'day').toDate(), // 过期时间默认值为 3 天
      defaultValue: () => dayjs().add(10, 'minute').toDate(), // 过期时间默认值为 10 分钟
      get() {
        const val = this.getDataValue('expire_time');
        return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : val;
      },
      comment: '过期时间',
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
    tableName: 't_friend_apply',
  });

  // 在 Egg-Sequelize 中，当 Egg.js 启动并加载完所有 Model 文件后， egg-sequelize 插件会自动扫描每个 Model，如果发现定义了 associate 方法，就会执行它
  // 作用 ：这样做是为了确保在建立关联时，所有的 Model 都已经被加载进内存了，避免“循环依赖”或“找不到模型”的问题
  // as: 简单来说，定义关系中的 as 是“起名字”，查询函数中的 as 是“叫名字”。 只有名字叫对了，才能把人（数据）喊出来。
  FriendApplyModel.associate = function() {
    const { UserModel } = app.model;

    // 好友申请表 关联 用户表
    FriendApplyModel.belongsTo(UserModel, {
      foreignKey: 'user_id',
      as: 'user', // 给关联起个 “别名”
    });

    // 好友申请表 关联 用户表
    FriendApplyModel.belongsTo(UserModel, {
      foreignKey: 'friend_id',
      as: 'friend',
    });
  };

  return FriendApplyModel;
};
