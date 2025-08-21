const { registerUser, loginUser } = require('../services/userService')

exports.register = async (req, res, next) => {
    try {
        const { username, password } = req.body

        // 验证输入
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '用户名和密码不能为空'
            })
        }

        // 调用service层处理注册逻辑
        const result = await registerUser(username, password)

        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '用户名和密码不能为空'
            })
        }

        // 调用service层处理登录逻辑
        const result = await loginUser(username, password)

        res.json(result)
    } catch (error) {
        next(error)
    }
}
