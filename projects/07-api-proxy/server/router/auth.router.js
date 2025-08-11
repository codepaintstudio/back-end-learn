const express = require('express')
const userService = require('../service/user.service')

const router = express.Router()

// Register route
router.post('/register', async (req, res) => {
    try {
        const userData = req.body
        const user = await userService.registerUser(userData)
        // Remove password from user object before sending to client
        const { password: _, ...userWithoutPassword } = user

        res.status(201).json({
            code: 201,
            message: '注册成功',
            data: {
                user: userWithoutPassword,
                token: user.token
            }
        })
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: '注册失败',
            data: null
        })
    }
})

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await userService.validateUser(username, password)

        if (!user) {
            return res.status(401).json({
                code: 401,
                message: '用户名或密码错误',
                data: null
            })
        }

        // Remove password from user object before sending to client
        const { password: _, ...userWithoutPassword } = user

        res.json({
            code: 200,
            message: '登录成功',
            data: {
                user: userWithoutPassword,
                token: user.token
            }
        })
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: '登录失败',
            data: null
        })
    }
})

module.exports = router
