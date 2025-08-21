const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config')

// 密码加密 加盐10轮
exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

// 密码验证
exports.comparePassword = async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword)
}

// 生成JWT令牌
exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

// JWT验证中间件
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: '访问拒绝，未提供认证令牌'
        })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: '无效的令牌'
            })
        }
        req.userId = decoded.id
        next()
    })
}
