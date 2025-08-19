// 初始化配置和依赖导入

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env'), debug: true })

console.log('当前环境变量:')
console.log('DB_HOST:', process.env.DB_HOST)
console.log('DB_USER:', process.env.DB_USERNAME)
console.log('DB_NAME:', process.env.DB_NAME)

const express = require('express')
const http = require('http')
const { exec } = require('child_process')
const axios = require('axios')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
// 中间件配置
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    })
)
app.options('*', cors())
// 请求体解析中间件
app.use(express.json()) // 解析JSON请求体
app.use(express.static(__dirname + '/../client/dist')) // 静态文件服务

// 数据库配置
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
})

/**
 * 调用Ollama AI服务生成回复
 * @param {string} prompt - 用户输入
 * @returns {Promise<string>} AI生成的回复
 */

// REST API路由

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running'
    })
})

// 聊天API(HTTP)
app.post('/api/chat', async (req, res) => {
    try {
        if (!req.body?.message) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Message is required'
            })
        }

        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'gemma3:4b',
            prompt: req.body.message,
            system: '请用中文回答用户的问题。',
            stream: false
        })

        res.json({
            response: response.data.response.trim()
            // isMarkdown: true
        })
    } catch (error) {
        console.error('API Error:', error)
        res.status(500).json({
            error: 'AI服务暂时不可用',
            details: error.message
        })
    }
})

// 数据库操作API

app.post('/api/save', async (req, res) => {
    try {
        console.log('收到请求体:', req.body)

        if (!req.body) {
            return res.status(400).json({
                error: 'Bad Request',
                message: '请求体不能为空'
            })
        }

        if (!req.body.username) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'username字段必填'
            })
        }

        if (!req.body.password) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'password字段必填'
            })
        }

        const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [
            req.body.username
        ])

        if (existing.length > 0) {
            return res.status(409).json({
                error: 'Conflict',
                message: '用户名已存在'
            })
        }

        const [result] = await pool.query('INSERT INTO users SET ?', {
            username: req.body.username,
            password: req.body.password
        })

        res.json({
            success: true,
            id: result.insertId
        })
    } catch (error) {
        console.error('数据库错误:', error)
        res.status(500).json({
            error: 'Database Error',
            message: error.message,
            sqlState: error.sqlState
        })
    }
})

// app.get('/api/data', async (req, res) => {
//     try {
//         const [rows] = await pool.query('SELECT id, username FROM users') // 不返回密码
//         res.json({
//             data: rows,
//             count: rows.length
//         })
//     } catch (error) {
//         console.error('数据库查询错误:', error)
//         res.status(500).json({
//             error: 'Internal Server Error',
//             message: error.message
//         })
//     }
// })

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '用户名和密码不能为空'
            })
        }

        // 查询数据库
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [
            username,
            password
        ])

        if (rows.length > 0) {
            res.json({
                success: true,
                user: {
                    id: rows[0].id,
                    username: rows[0].username
                }
            })
        } else {
            res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            })
        }
    } catch (error) {
        console.error('登录验证错误:', error)
        res.status(500).json({
            success: false,
            message: '服务器错误'
        })
    }
}) /
    // 错误处理中间件

    // 404处理
    app.use((req, res) => {
        res.status(404).json({
            code: 404,
            message: '接口不存在',
            data: null
        })
    })

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('Error:', err.stack)
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong!'
    })
})

// 启动服务器

const PORT = process.env.PORT || 3000
console.log('DB_HOST:', process.env.DB_HOST)

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
})
