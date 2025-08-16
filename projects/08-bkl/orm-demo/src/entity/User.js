// 引入 BaseEntity 和其他需要的类
const { BaseEntity, EntitySchema } = require('typeorm');

/**
 * User 实体类
 * 
 * 这个类映射到数据库中的 users 表
 * 每个属性对应表中的一列
 */
class User extends BaseEntity {
  constructor(user) {
    super();
    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.password = user.password;
      this.role = user.role || 'user';
    }
  }
}

// 定义 User 实体模式
const UserSchema = new EntitySchema({
  name: "User",
  target: User,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true
    },
    username: {
      type: "varchar",
      unique: true
    },
    email: {
      type: "varchar",
      unique: true
    },
    password: {
      type: "varchar"
    },
    role: {
      type: "varchar",
      default: "user"
    },
    createdAt: {
      type: "datetime",
      nullable: true
    },
    updatedAt: {
      type: "datetime",
      nullable: true
    }
  }
});

module.exports = {
  User,
  UserSchema
};