const User = require('../entity/user')
const { AppDataSource } = require('../config/env')
const { hashPassword, comparePassword, generateToken } = require('../utils/userUtils')

// 获取用户仓库
const getUserRepository = () => {
    return AppDataSource.getRepository(User)
}

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

        // // 初始化数据源连接（如果尚未连接）
        // if (!AppDataSource.isInitialized) {
        //     await AppDataSource.initialize()
        // }

        // 检查用户是否存在
        const userRepository = getUserRepository()
        const existingUser = await userRepository.findOne({
            where: { username }
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: '用户名已存在'
            })
        }

        // 创建新用户
        const hashedPassword = await hashPassword(password)
        const newUser = userRepository.create({
            username,
            password: hashedPassword
        })

        const savedUser = await userRepository.save(newUser)

        // 生成JWT
        const token = generateToken(savedUser.id)

        res.status(201).json({
            success: true,
            userId: savedUser.id,
            username: savedUser.username,
            token
        })
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

        // 初始化数据源连接（如果尚未连接）
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize()
        }

        // 查询用户
        const userRepository = getUserRepository()
        const user = await userRepository.findOne({
            where: { username }
        })

        // 验证用户
        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            })
        }

        // 生成JWT
        const token = generateToken(user.id)

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username
            },
            token
        })
    } catch (error) {
        next(error)
    }
}
