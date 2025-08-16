// 引入 TypeORM 数据源
const { DataSource } = require('typeorm');
const { UserSchema } = require('../entity/User');

/**
 * 数据库配置
 * 
 * 使用 SQLite 作为演示数据库，因为它不需要单独的数据库服务器
 * 在生产环境中，通常会使用 MySQL、PostgreSQL 等数据库
 */
const AppDataSource = new DataSource({
  // 使用 SQLite 数据库
  type: "sqlite",
  
  // 数据库文件路径
  database: "database.sqlite",
  
  // 同步模式 - 在生产环境中应设置为 false 并使用迁移
  synchronize: true,
  
  // 日志 - 在开发环境中启用，生产环境中应根据需要配置
  logging: false,
  
  // 实体列表 - 需要在此注册所有实体
  entities: [UserSchema],
  
  // 迁移文件路径
  migrations: [],
  
  // 订阅者路径
  subscribers: [],
  
  // 设置时区为 UTC
  timezone: 'UTC'
});

module.exports = {
  AppDataSource
};