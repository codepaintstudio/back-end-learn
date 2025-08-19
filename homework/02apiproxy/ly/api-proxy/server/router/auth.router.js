const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');
// 注册
router.post('/register', async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        if (user.postExist) {

            return res.status(400).json({
                code: 400,
                message: '用户名已存在',
                data: null,
            });
        }
        res.status(201).json({
            code: 201,
            message: '注册成功',
            data: {
                token: 'Bearer ' + user.token,

                // user: user.user,
            },
        });
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: '注册失败',
            data: null,
        });
    }
});

// 登录
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.validateUser(username, password);
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: '用户名或密码错误',
                data: null,
            });
        }
        if (user) {
            res.status(201).json({
                code: 201,
                message: '登录成功',
                data: {
                    // token: user.token.split('.')[0],
                    token: 'Bearer ' + user.token,

                    // user: {
                    //     username: user.user.username,
                    //     id: user.user.id,
                    //     createdAt: user.user.createdAt,
                    // },
                },
            });
        }

    } catch (err) {
        res.status(500).json({
            code: 500,
            message: '登录失败',
            data: null,
        });
    }
});

module.exports = router;