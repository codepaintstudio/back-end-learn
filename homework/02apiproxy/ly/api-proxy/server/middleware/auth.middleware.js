const jwt = require("jsonwebtoken");
const config = require("../config/jwt.config");

function requireAuth() {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            // 严格校验 Authorization 头格式
            if (!authHeader || !/^Bearer\s/.test(authHeader)) {
                return res.status(401).json({
                    code: 401,
                    message: "未提供有效的认证令牌（格式应为 Bearer <token>）"
                });
            }

            // 提取令牌
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    code: 401,
                    message: "未提供认证令牌"
                });
            }

            // 验证令牌
            const decoded = jwt.verify(token, config.secretKey);
            req.user = decoded;
            next();
        } catch (error) {
            // 服务端记录详细错误
            console.error('JWT验证失败:', error.name, error.message);

            // 客户端提示（区分过期和其他错误）
            let message = "无效的认证令牌";
            if (error.name === 'TokenExpiredError') {
                message = "令牌已过期，请重新登录";
            }

            return res.status(401).json({ code: 401, message });
        }
    };
}

module.exports = requireAuth;