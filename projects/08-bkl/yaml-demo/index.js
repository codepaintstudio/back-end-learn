// 引入 Node.js 内建的 fs 模块，用于读取文件
const fs = require('fs');

// 引入 YAML 解析库
const YAML = require('yaml');

/**
 * 演示 YAML 配置文件的使用
 * 
 * YAML 是一种人类可读的数据序列化标准，常用于配置文件
 * 相比 .env 文件，YAML 支持更复杂的数据结构
 */

// 读取 YAML 配置文件
console.log('=== 读取 YAML 配置文件 ===');
const file = fs.readFileSync('./config.yaml', 'utf8');

// 解析 YAML 文件内容
const config = YAML.parse(file);

// 输出解析后的配置信息
console.log('配置文件加载成功');
console.log('应用程序名称:', config.app.name);
console.log('应用程序版本:', config.app.version);

// 演示访问嵌套配置
console.log('\n=== 服务器配置 ===');
console.log(`主机: ${config.server.host}`);
console.log(`端口: ${config.server.port}`);
console.log(`HTTPS: ${config.server.https ? '启用' : '禁用'}`);

// 演示访问数组类型配置
console.log('\n=== 应用程序设置 ===');
console.log('支持的语言:', config.app.languages.join(', '));
console.log('默认语言:', config.app.defaultLanguage);

// 演示访问数据库配置
console.log('\n=== 数据库配置 ===');
console.log(`类型: ${config.database.type}`);
console.log(`主机: ${config.database.connection.host}`);
console.log(`端口: ${config.database.connection.port}`);
console.log(`数据库: ${config.database.connection.database}`);
console.log(`连接池最小连接数: ${config.database.pool.min}`);
console.log(`连接池最大连接数: ${config.database.pool.max}`);

// 演示访问功能开关
console.log('\n=== 功能开关 ===');
console.log(`用户认证: ${config.features.authentication ? '启用' : '禁用'}`);
console.log(`缓存功能: ${config.features.caching ? '启用' : '禁用'}`);
console.log(`监控功能: ${config.features.monitoring ? '启用' : '禁用'}`);

// 演示访问日志配置
console.log('\n=== 日志配置 ===');
console.log(`日志级别: ${config.logging.level}`);
console.log(`日志文件: ${config.logging.file}`);
console.log(`控制台输出: ${config.logging.console ? '启用' : '禁用'}`);

// 演示遍历数组
console.log('\n=== 遍历语言列表 ===');
config.app.languages.forEach((lang, index) => {
  console.log(`  ${index + 1}. ${lang}`);
});

// 演示条件逻辑
if (config.features.authentication) {
  console.log('\n=== 认证功能已启用 ===');
  console.log('需要用户登录才能访问受保护的资源');
}

if (config.logging.level === 'debug') {
  console.log('\n=== 调试模式 ===');
  console.log('显示详细的调试信息');
}

console.log('\n=== 演示完成 ===');
console.log('YAML 配置文件已成功加载和使用');