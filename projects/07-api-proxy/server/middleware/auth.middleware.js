const jwt = require('jsonwebtoken')
const config = require('../config/jwt.config')

function requireAuth() {
    return (req, res, next) => {
        try {
            // Get token from header
            const authHeader = req.headers.authorization
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    code: 401,
                    message: '未提供认证令牌',
                    data: null
                })
            }

            // Extract token
            const token = authHeader.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, config.secretKey)

            // Add user info to request
            req.user = decoded

            // Continue to next middleware
            next()
        } catch (error) {
            return res.status(401).json({
                code: 401,
                message: '无效的认证令牌',
                data: null
            })
        }
    }
}

module.exports = requireAuth
