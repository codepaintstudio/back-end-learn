# back-end-learn

针对前端开发者的全栈学习路线。

## 目录说明：

- [docs](./docs): 教学文档、讲义
- [projects](./projects): 教学项目
- [homeWork](./homework): 提交的作业羡慕

## 20250727 授课主要内容总结

### [一些认知上的事情](./docs/01.一些认知上的事情.md)

- 前端 = 用户界面的实现者 + 用户体验的把控者 + 浏览器环境的适配者。
- 后端 = 数据的守护者 + 业务规则的裁判 + 系统资源的调度者。

一句话总结：前端让用户看得见、点得动，后端让系统跑得通、守得住

### [为什么选择 Node](./docs/02.为什么选择Node.md)

对前端开发来说，Node 是转全栈最顺滑的路径，门槛最低、产出最快、生态最友好。

### [Node 初讲](./docs/04.Node初讲.md)

1. NVM 安装和使用
2. node 的 global 和浏览器的 window 区别
3. Node 核心模块：

   - fs：文件操作，比如写和读；writeFile, readFile，以及同步和异步
   - path：路径操作，比如路径的拼接；join, resolve，**dirname, **filename, extname 等
   - os：操作系统信息；platform, arch, totalmem, freemem, cpus, hostname, homedir 等
   - http：网络操作，比如创建服务器；createServer, listen, 注意两个参数：
     - req：请求对象，包含请求头、请求体、请求方法、请求路径等信息
     - req.on()：监听请求体的传输，通过 data 事件监听，通过 end 事件结束
     - res：响应对象，包含响应头、响应体、响应状态码等信息
     - res.writeHead()：设置响应头
     - res.end()：设置响应体

4. 后端的简单架构：

- 三层架构：路由、业务逻辑、数据访问

### [文件上传流程](./codes/03-file-server/server.js)

1. 第一阶段：通过 http 的 api 接口传输

- 前端通过 post 方法和 api/files 路径上传了文件；

2. 第二阶段：服务端解析路由，然后指定对应的处理函数

- 服务端解析路径和方法，发现是要进行上传文件，然后执行的对应的处理函数；

3. 第三阶段：文件的解析和存储

- 因为是文件，所以要持续监听传输，把文件的切片存放到字符串中；
- 解析文件字符串：通过 边界值 解析，获得文件们的数组[]<pathname, content>
- 解析文件的信息，比如文件名、文件大小和类型等；
- 把文件存通过 fs 的 writeFile 写到文件夹下面，指定了路径、文件内容和文件扩展；
- 更新数据库（假的数据库），把文件信息写到里面；

4. 第四阶段：返回文件信息

- 通过 res.end 返回文件信息给前端，注意这里的信息通过包装了一下；

---

## 20250803 授课主要内容总结

### Express 基础

1. 创建 Express 应用

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

2. Express 的核心：中间件

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // 调用下一个中间件
});
```

3. 中间件是个大大的洋葱模型

```js
app.use((req, res, next) => {
  console.log("第一层中间件前置");
  next();
  console.log("第一层中间件后置");
});

app.use((req, res, next) => {
  console.log("第二层中间件前置");
  next();
  console.log("第二层中间件后置");
});

// 访问 http://localhost:3000/ 时，输出：
// 第一层中间件前置
// 第二层中间件前置
// 第二层中间件后置
// 第一层中间件后置
```

### 中间件

1. express 自带的中间件

```js
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码请求体
```

2. 自定义中间件

```js
// 日志中间件
app.use((req, res, next) => {
  const startTime = Date.now();
  next(); // 调用下一个中间件
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
});
```

3. 错误处理中间件

错误处理：捕获所有异常并返回错误信息，防止服务器崩溃；

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

### Docker

1. docker 简介：docker 是一个开源的容器平台，它可以将应用程序打包成镜像，并运行在容器中。

2. 为什么需要 docker：

   - 解决环境一致性问题：不同的开发环境、测试环境和生产环境可能存在差异，docker 可以确保在任何环境中运行相同的应用程序。
   - 提高部署效率：docker 可以快速构建、测试和部署应用程序，从而提高开发效率。
   - 资源隔离：docker 可以将应用程序和其依赖项打包在一起，从而实现资源隔离，避免不同应用程序之间的冲突。

3. 核心概念：

   - 镜像：docker 镜像是一个只读的模板，用于创建容器。镜像包含应用程序及其依赖项。
   - 容器：docker 容器是镜像的一个实例，是一个运行中的应用程序。容器是轻量级的、可移植的、可执行的。
   - Dockerfile：dockerfile 是创建镜像的脚本，包含构建镜像的指令。
   - Docker Compose：docker compose 是一个用于定义和运行多容器 Docker 应用程序的工具。

### [ApiProxy 作业需求文档 (Express 分层架构版本)](./docs/09.apiproxy_homework.md)
