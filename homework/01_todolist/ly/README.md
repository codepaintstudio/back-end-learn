# Todo 任务管理系统

## 项目介绍

Todo 任务管理系统是一个基于 Node.js 构建的简单高效的任务管理工具，提供了任务的创建、查询、更新和删除功能。系统采用前后端开发模式，后端使用原生 Node.js 搭建 HTTP 服务，前端使用 Vue.js 构建用户界面，数据以 JSON 格式存储在本地文件中，便于快速部署和使用。

主要功能包括：
- 查看所有任务列表
- 创建新任务（包含标题、描述信息）
- 更新任务（可修改标题、描述及完成状态）
- 删除任务

## 技术栈

- **后端**：Node.js（原生 HTTP 模块）
- **前端**：Vue.js 2、Axios
- **数据存储**：JSON 文件
- **依赖库**：uuid（生成唯一 ID）、dayjs（时间格式化）

## 项目结构

```
Back-end/
├── client/                 # 前端代码
│   ├── index.html          # 前端页面
│   └── index.css           # 样式文件
│   └── index.js            # 前端逻辑
├── server/                 # 后端代码
│   ├── data/
│   │   └── todos.json      # 任务数据存储文件
│   ├── utils/
│   │   └── format.js       # 时间格式化工具
│   ├── server.js           # 后端服务入口
│   └── package.json        # 后端依赖配置
├── docs/
│   └── img.md              # 图片
│   └── api.md              # API 文档
│   └── Domo.Screenshots.md # 项目演示
└── README.md               # 项目说明
├── package.json            # 项目依赖配置
└── package-lock.json       # 依赖版本锁定文件
```

## 安装与运行

### 前提条件

- 安装 Node.js（v14+ 推荐）
- 安装 npm（通常随 Node.js 一同安装）

### 安装步骤

1. 克隆或下载项目到本地
2. 进入项目根目录（Back-end 文件夹）
3. 安装依赖：
   ```bash
   npm install
   ```

### 运行项目

1. 启动服务：
   ```bash
   node server/server.js
   ```
2. 打开浏览器，访问 `http://localhost:3000` 即可使用系统

## API 接口说明

系统提供以下 API 接口用于任务管理：

- **获取所有任务**：`GET /api/todos`
- **创建任务**：`POST /api/todos`（需提供 title，description 可选）
- **更新任务**：`PUT /api/todos/id`（需提供 id，其他字段可选）
- **删除任务**：`DELETE /api/todos/id`（需提供 id）

详细接口参数及响应格式可参考 `docs/api.md` 文件。

## 功能演示

可参考 `docs/Demo Screenshots.md` 文件查看各功能的演示截图及操作说明。

