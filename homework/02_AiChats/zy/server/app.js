const express = require('express')
const cors = require('cors')
const path = require('path')
const { CORS_ORIGIN } = require('./config/config.js')
const apiRoutes = require('./routers/apiRoutes.js')
const { notFoundHandler, errorHandler } = require('./middle/error.js')

const app = express()

// 中间件
app.use(
    cors({
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../client/dist')))

// API路由
app.use('/api', apiRoutes)

// 错误处理
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
