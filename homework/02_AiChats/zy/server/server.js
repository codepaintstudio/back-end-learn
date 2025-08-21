const http = require('http')
const app = require('./app')
const { PORT, DB_HOST } = require('./config/config.js')
const { AppDataSource } = require('./config/config.js') // 导入数据源

const server = http.createServer(app)

// 启动服务器和数据库连接的异步函数
async function startServer() {
    try {
        // 初始化数据库连接
        await AppDataSource.initialize()
        console.log('  数据库连接成功')

        // 启动HTTP服务器
        server.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`)
            console.log(` API文档: http://localhost:${PORT}/api-docs`)
            console.log(` CORS允许来源: ${process.env.CORS_ORIGIN}`)
            console.log(` 数据库连接: ${DB_HOST}`)
        })
    } catch (error) {
        console.error('❌ 数据库连接失败:', error)
        process.exit(1) // 如果数据库连接失败，退出进程
    }
}

// 调用启动函数
startServer()
