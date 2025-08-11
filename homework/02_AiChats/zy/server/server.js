const express = require('express')
const http = require('http')
const { exec } = require('child_process')
const app = express()
const server = http.createServer(app)
const axios = require('axios')
// Middleware
// 添加CORS配置
const cors = require('cors')
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    })
)
app.options('*', cors())
app.use(express.json()) // 启用JSON解析中间件
app.use(express.static(__dirname + '/../client/dist'))

// REST API routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' })
})

// 聊天接口
app.post('/api/chat', async (req, res) => {
    try {
        if (!req.body?.message) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Message is required'
            })
        }
        //ollama API调用
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'gemma3:4b',
            prompt: req.body.message,
            system: '请用中文回答用户的问题。',
            stream: false
        })

        res.json({
            response: response.data.response.trim()
        })
    } catch (error) {
        console.error('API Error:', error)
        res.status(500).json({
            error: 'AI服务暂时不可用',
            details: error.message
        })
    }
})

// 404处理
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: '接口不存在',
        data: null
    })
})

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err.stack)
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong!'
    })
})

// 使用3000端口避免与前端开发服务器冲突

// 修改端口配置
const PORT = process.env.PORT || 3000

// 添加Socket.io配置（如需）
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    },
    path: '/socket.io', // 明确指定路径
    transports: ['websocket', 'polling'] // 指定传输方式
})
// 在server.listen之前添加
io.on('connection', (socket) => {
    console.log('New client connected')

    socket.on('chat message', async (msg) => {
        try {
            console.log('收到用户消息:', msg)
            const aiResponse = await runOllama(msg)
            console.log('AI回复:', aiResponse)
            socket.emit('chat message', {
                user: msg,
                ai: aiResponse
            })
        } catch (error) {
            console.error('处理消息错误:', error)
            socket.emit('chat message', {
                user: msg,
                ai: 'AI服务暂时不可用'
            })
        }
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
})

/**
 * 安全地执行Ollama命令
 * @param {string} prompt - 用户输入的提示词
 * @returns {Promise<string>} - Ollama的输出结果
 */
async function runOllama(prompt) {
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'gemma3:4b',
            prompt: prompt,
            system: '你是一个乐于助人的AI助手。请用中文回答用户的问题。',
            stream: false
        })
        return response.data.response.trim()
    } catch (error) {
        console.error('Ollama API Error:', error)
        throw new Error('AI服务暂时不可用')
    }
}
