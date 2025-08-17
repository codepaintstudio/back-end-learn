const express = require('express')
const cors = require('cors')
const postRoutes = require('./routes/posts')
const { AppDataSource } = require('./data-source')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.use('/api/posts', postRoutes)

// 初始化数据库并启动服务器
AppDataSource.initialize()
    .then(() => {
        console.log('数据库连接已建立')

        app.listen(PORT, () => {
            console.log(`服务器正在${PORT}端口上运行`)
            console.log(`访问 http://localhost:${PORT} 使用API`)
        })
    })
    .catch((error) => {
        console.error('数据库连接错误:', error)
    })
