# 简单博客 CRUD 应用程序

这是一个使用 Node.js、Express、TypeORM 和 MySQL 构建的简单博客应用程序，演示了基本的 CRUD（创建、读取、更新、删除）操作。

## 功能特性

- 创建、读取、更新和删除博客文章
- 代码结构简单清晰
- RESTful API 设计
- 使用 TypeORM 与 MySQL 数据库集成

## 前提条件

- Node.js（v12 或更高版本）
- MySQL 数据库
- npm 或 yarn

## 设置

1. 克隆仓库（或导航到项目目录）

2. 安装依赖：

   ```bash
   npm install
   ```

3. 设置数据库：

   - 创建一个 MySQL 数据库（例如：`blog_db`）
   - 更新`.env`文件中的数据库凭证：
     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_USERNAME=你的MySQL用户名
     DB_PASSWORD=你的MySQL密码
     DB_NAME=blog_db
     ```

4. 运行应用程序：

   ```bash
   npm start
   ```

   或者在开发模式下运行（支持自动重启）：

   ```bash
   npm run dev
   ```

## API 端点

- `GET /` - 健康检查和 API 信息
- `GET /api/posts` - 获取所有文章
- `GET /api/posts/:id` - 根据 ID 获取特定文章
- `POST /api/posts` - 创建新文章
- `PUT /api/posts/:id` - 更新文章
- `DELETE /api/posts/:id` - 删除文章

## 使用示例

### 创建新文章

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"我的第一篇文章", "content":"这是我第一篇文章的内容"}'
```

### 获取所有文章

```bash
curl http://localhost:3000/api/posts
```

### 获取特定文章

```bash
curl http://localhost:3000/api/posts/1
```

### 更新文章

```bash
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"更新后的文章标题", "content":"更新后的内容"}'
```

### 删除文章

```bash
curl -X DELETE http://localhost:3000/api/posts/1
```

## 项目结构

```
src/
├── entity/          # 数据库实体
│   └── Post.js      # 文章实体
├── controller/      # 业务逻辑
│   └── PostController.js
├── routes/          # API路由
│   └── posts.js
├── data-source.js   # 数据库配置
└── index.js         # 主应用程序文件
```

## 依赖项

- express: Web 框架
- typeorm: 用于数据库操作的 ORM
- mysql2: MySQL 数据库驱动
- cors: 跨域资源共享中间件
- dotenv: 环境变量加载器

## 许可证

该项目是开源的，可在 MIT 许可证下使用。
