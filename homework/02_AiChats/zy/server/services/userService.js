const User = require('../entity/user')
const { AppDataSource } = require('../config/config')
const { hashPassword, comparePassword, generateToken } = require('../utils/userUtils')

// 获取用户仓库
const getUserRepository = () => {
    return AppDataSource.getRepository(User)
}

// 注册用户服务
const registerUser = async (username, password) => {
    // 检查用户是否存在
    const userRepository = getUserRepository()
    const existingUser = await userRepository.findOne({
        where: { username }
    })

    if (existingUser) {
        throw new Error('用户名已存在')
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

    return {
        success: true,
        userId: savedUser.id,
        username: savedUser.username,
        token
    }
}

// 登录用户服务
const loginUser = async (username, password) => {
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
        throw new Error('用户名或密码错误')
    }

    // 生成JWT
    const token = generateToken(user.id)

    return {
        success: true,
        user: {
            id: user.id,
            username: user.username
        },
        token
    }
}

// 导出所有服务函数
module.exports = {
    registerUser,
    loginUser
}
