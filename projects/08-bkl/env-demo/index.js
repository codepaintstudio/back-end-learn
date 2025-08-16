// 引入 dotenv 模块，加载 .env 文件中的环境变量
// dotenv 会将 .env 文件中的键值对添加到 process.env 对象中
require('dotenv').config();

// 引入 Node.js 内建的 path 模块，用于处理文件路径
const path = require('path');

/**
 * 演示环境变量的使用
 * 
 * 本示例展示了如何使用 dotenv 加载和使用环境变量
 * 环境变量通常用于存储配置信息，如数据库连接信息、API密钥等
 */

// 从 process.env 中读取环境变量
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const port = process.env.PORT || 3000; // 提供默认值
const host = process.env.HOST || 'localhost';
const jwtSecret = process.env.JWT_SECRET;
const logLevel = process.env.LOG_LEVEL;

// 输出环境变量信息（注意：实际项目中不要输出敏感信息如密码）
console.log('=== 环境变量演示 ===');
console.log(`数据库主机: ${dbHost}`);
console.log(`数据库用户: ${dbUser}`);
console.log(`数据库名称: ${dbName}`);
console.log(`服务器端口: ${port}`);
console.log(`服务器主机: ${host}`);
console.log(`日志级别: ${logLevel}`);
console.log(`JWT密钥已设置: ${!!jwtSecret}`); // 使用 !! 将值转换为布尔值

// 演示环境变量的类型（环境变量始终是字符串）
console.log('\n=== 环境变量类型演示 ===');
console.log(`PORT 的类型: ${typeof process.env.PORT}`); // string
console.log(`PORT 的值: ${process.env.PORT}`); // "3000"
console.log(`转换为数字后的 PORT: ${Number(process.env.PORT)}`); // 3000

// 演示默认值的使用
const timeout = process.env.TIMEOUT || 5000; // 如果未设置 TIMEOUT，则使用默认值 5000
console.log(`\n超时时间: ${timeout}ms`);

// 演示条件逻辑
if (logLevel === 'debug') {
  console.log('\n=== 调试信息 ===');
  console.log('显示详细的调试信息');
} else {
  console.log('\n=== 基本信息 ===');
  console.log('仅显示基本信息');
}

console.log('\n=== 演示完成 ===');
console.log('环境变量已成功加载和使用');

// 模拟应用启动
console.log(`\n服务器正在 ${host}:${port} 上运行...`);