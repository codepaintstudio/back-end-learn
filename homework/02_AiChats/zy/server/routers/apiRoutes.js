const express = require('express')
const router = express.Router()
const { verifyToken } = require('../utils/userUtils.js')
const { chat } = require('../control/chat.js')
const { register, login } = require('../control/user.js')

// 公开路由
router.post('/register', register)
router.post('/login', login)

// 需要认证的路由
router.post('/chat', verifyToken, chat)

module.exports = router
