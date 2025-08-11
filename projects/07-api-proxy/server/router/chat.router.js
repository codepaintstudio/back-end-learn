const express = require('express')
const chatService = require('../service/chat.service')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

// Chat root endpoint
router.get('/', (req, res) => {
    res.json({
        code: 200,
        message: 'Chat API 服务正常运行',
        data: {
            version: '1.0.0',
            description: 'Ollama Chat API'
        }
    })
})

// 获取模型列表接口
router.get('/models', authMiddleware(), async (req, res) => {
    try {
        // 获取模型列表
        const models = await chatService.listModels()

        res.json({
            code: 200,
            message: '获取模型列表成功',
            data: models
        })
    } catch (error) {
        console.error('获取模型列表失败:', error)
        res.status(500).json({
            code: 500,
            message: '获取模型列表失败: ' + (error.message || '未知错误'),
            data: null
        })
    }
})

// Chat endpoint with authentication
router.post('/', authMiddleware(), async (req, res) => {
    try {
        await chatService.streamChat(req, res)
    } catch (error) {
        console.error('Chat service error:', error)
        res.status(500).json({
            code: 500,
            message: '聊天服务异常: ' + (error.message || '未知错误'),
            data: null
        })
    }
})

module.exports = router
