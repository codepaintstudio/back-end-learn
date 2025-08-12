const express = require('express')
const authRouter = require('./router/auth.router')
const chatRouter = require('./router/chat.router')
const config = require('./config/jwt.config');
const { expressjwt: expressJWT } = require("express-jwt");

const app = express()
const cors = require('cors')

// 中间件
app.use(cors())
app.use(express.json())
app.use(expressJWT({
    secret: config.secretKey,
    algorithms: ["HS256"],
}).unless({ path: [/^\/api\//] }));
// 路由
app.use('/api', authRouter)
app.use('/chat', chatRouter)

// 错误处理中间件
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.log('JWT验证失败:', err.message);
        return res.status(401).json({
            code: 401,
            message: 'Token验证失败',
            error: err.message
        });
    }
    console.log(err)
    res.status(500).json({
        code: 500,
        message: 'Internal server error',
        data: null
    })
    // res.send({
    //     code: 500,
    //     message: 'Internal server error',
    //     data: null
    // })
    // next()
})
app.listen(3000, () => {
    console.log('Server is running on port: http://localhost:3000')
})
