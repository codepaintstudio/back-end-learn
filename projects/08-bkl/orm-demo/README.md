# ORM 技术演示

这个项目演示了如何在 Node.js 应用中使用 ORM（对象关系映射）技术。

## 项目结构

```
orm-demo/
├── src/
│   ├── entity/
│   │   └── User.js        # 用户实体类
│   ├── config/
│   │   └── database.js    # 数据库配置
│   └── service/
│       └── UserService.js # 用户服务类
├── package.json           # 项目配置文件
├── index.js               # 主程序文件
└── README.md              # 说明文档
```

## 什么是 ORM？

ORM（Object Relational Mapping，对象关系映射）是一种编程技术，用于在关系型数据库和面向对象编程语言之间进行数据转换。它创建了一个"虚拟对象数据库"，可以在编程语言中直接操作。

### ORM 的核心概念

1. **实体（Entity）**：与数据库表对应的类
2. **属性（Property）**：与表字段对应的类属性
3. **关系（Relationship）**：表之间的关联关系（一对一、一对多、多对多）
4. **查询构建器**：用于构建数据库查询的工具

## 为什么需要 ORM？

### 1. 提高开发效率
- 避免编写大量重复的 SQL 语句
- 使用面向对象的方式操作数据库
- 自动生成 SQL 语句

### 2. 提高代码可维护性
- 更好的代码组织结构
- 类型安全（特别是在 TypeScript 中）
- 易于重构和扩展

### 3. 数据库无关性
- 可以轻松切换不同的数据库系统
- 统一的 API 接口

### 4. 安全性
- 自动防止 SQL 注入攻击
- 内置数据验证

### 5. 高级功能
- 迁移系统
- 关系管理
- 缓存机制
- 事务支持

## ORM 与原生 SQL 的对比

| 特性 | 原生 SQL | ORM |
|------|----------|-----|
| **性能** | 更高 | 略低（有抽象层开销） |
| **学习成本** | 需要熟悉 SQL | 需要熟悉 ORM API |
| **开发效率** | 复杂查询效率高 | 简单操作效率高 |
| **可维护性** | 较低 | 较高 |
| **类型安全** | 无 | 有（TypeScript） |
| **数据库切换** | 困难 | 容易 |

## 安装和运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 运行项目：
   ```bash
   npm start
   ```

   或者使用 nodemon 进行开发：
   ```bash
   npm run dev
   ```

## 代码说明

### 1. 实体定义（User.js）

```javascript
@Entity('users')
class User {
  @PrimaryGeneratedColumn()
  id;

  @Column({ unique: true })
  username;

  @Column({ unique: true })
  email;

  @Column()
  password;
}
```

### 2. 数据库配置（database.js）

```javascript
const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  entities: [User],
});
```

### 3. 服务类（UserService.js）

```javascript
class UserService {
  async createUser(userData) {
    const user = new User(userData);
    return await this.getUserRepository().save(user);
  }

  async findUserById(id) {
    return await this.getUserRepository().findOneBy({ id });
  }
}
```

### 4. 使用 ORM（index.js）

```javascript
// 初始化数据库连接
await AppDataSource.initialize();

// 创建用户
const user = await userService.createUser({
  username: 'alice',
  email: 'alice@example.com',
  password: 'encrypted_password'
});

// 关闭数据库连接
await AppDataSource.destroy();
```

## 常见的 Node.js ORM 框架

1. **TypeORM**：功能最全面的 ORM，支持 TypeScript 和 JavaScript
2. **Sequelize**：支持多种数据库的 ORM
3. **Mongoose**：专为 MongoDB 设计的 ODM（对象文档映射）
4. **Prisma**：现代化的数据库工具，提供类型安全的查询

## 最佳实践

1. **合理设计实体关系**
2. **使用连接池提高性能**
3. **避免 N+1 查询问题**
4. **合理使用事务**
5. **定期进行数据库迁移**
6. **在生产环境中禁用自动同步**