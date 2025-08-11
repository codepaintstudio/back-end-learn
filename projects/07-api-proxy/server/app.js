const express = require('express')
const corsMiddleware = require('./middleware/cors.middleware')
const loggerMiddleware = require('./middleware/logger.middleware')
const authMiddleware = require('./middleware/auth.middleware')
const userRouter = require('./router/auth.router')
const chatRouter = require('./router/chat.router')

const app = express()

// Middleware setup
app.use(express.json())
app.use(corsMiddleware)
app.use(loggerMiddleware())

// Routes setup
app.use('/api/auth', userRouter)
app.use('/api/chat', chatRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        code: 500,
        message: 'Internal Server Error',
        data: null
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: '接口不存在',
        data: null
    })
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = app
