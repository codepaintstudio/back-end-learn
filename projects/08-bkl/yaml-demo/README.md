# YAML 配置文件使用演示

这个项目演示了如何在 Node.js 应用中使用 YAML 配置文件。

## 项目结构

```
yaml-demo/
├── config.yaml       # YAML 配置文件
├── package.json      # 项目配置文件
├── index.js          # 主程序文件
└── README.md         # 说明文档
```

## YAML 简介

YAML (YAML Ain't Markup Language) 是一种人类可读的数据序列化标准，常用于配置文件。相比 .env 文件，YAML 支持更复杂的数据结构，包括：

1. 嵌套对象
2. 数组
3. 不同的数据类型

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

### 1. 安装和引入 YAML 库

```bash
npm install yaml
```

```javascript
const YAML = require("yaml");
```

### 2. 读取和解析 YAML 文件

```javascript
const fs = require("fs");
const file = fs.readFileSync("./config.yaml", "utf8");
const config = YAML.parse(file);
```

### 3. 访问配置值

```javascript
// 访问简单值
const port = config.server.port;

// 访问嵌套值
const dbHost = config.database.connection.host;

// 访问数组
const languages = config.app.languages;
```

## YAML 语法示例

### 基本语法

```yaml
# 这是注释
string_value: "字符串值"
number_value: 42
boolean_value: true
null_value: null
```

### 对象和嵌套

```yaml
server:
  host: localhost
  port: 3000
```

### 数组

```yaml
languages:
  - zh
  - en
```

### 复杂示例

```yaml
database:
  connection:
    host: localhost
    port: 3306
```

## 最佳实践

1. 使用有意义的键名
2. 添加注释说明复杂的配置项
3. 按功能模块组织配置
4. 为数组元素提供一致的结构
5. 使用适当的缩进（通常为 2 个空格）
