const bcrypt = require('bcryptjs');
const config = require('../config/jwt.config');
const jwt = require('jsonwebtoken');
const userStage = require("../stage/user.stage");
const { v4: uuidv4 } = require('uuid');

// 注册用户 接收信息 → 加密密码 → 检查用户名唯一性 → 保存数据 → 生成令牌
async function registerUser(userData) {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 8);
        const user = {
            ...userData,
            id: uuidv4(),
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        }
        const users = await userStage.readFileJSON(userStage.userFilePath);
        // 检测用户名是否已存在
        let isExist = users.find(user => user.username === userData.username);
        if (!isExist)
            users.push(user);


        // console.log(users)
        await userStage.writeFileJSON(userStage.userFilePath, users);

        const token = jwt.sign(
            { username: user.username, id: user.id }, config.secretKey, {
            expiresIn: config.expiresIn,
        });

        return {
            token,
            user,
            isExist
        };
    } catch (err) {
        throw new Error(err.message);
    }
}
// 登录验证 读取数据 → 查找用户 → 验证密码 → 生成令牌 → 返回结果
async function validateUser(username, password) {
    try {
        const users = await userStage.readFileJSON(userStage.userFilePath);
        //   console.log(users)
        const user = users.find(user => user.username === username) || null;
        //  console.log(user,'1111')
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { username: user.username, id: user.id }, config.secretKey, {
                expiresIn: config.expiresIn,
            });
            return {
                token,
                user: user,
            };
        }
        // return null;
    } catch (err) {
        throw new Error(err.message);
    }
}
module.exports = {
    registerUser,
    validateUser,
}