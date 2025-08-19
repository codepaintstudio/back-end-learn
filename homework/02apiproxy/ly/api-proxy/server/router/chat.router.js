const express = require('express');
const chatService = require('../service/chat.service');
const router = express.Router();
// const authMiddleware = require('../middleware/auth.middleware');
// 模型列表
router.get('/models',async (req, res) => {

    try {
        const models = await chatService.getModels();
        res.status(201).json({
            code: 201,
            message: "获取模型成功",
            data: models
        });
    } catch (err) {
        console.error("获取模型失败：", err);
        res.status(500).json({ message: "获取模型失败" });
    }
});
// 获取个人信息
router.get('/user', async (req, res) => {
    try {
       
        res.status(201).json({
            code: 201,
            message: "获取个人信息成功",
            data: req.auth
        });
    } catch (err) {
        console.error("获取个人信息失败：", err);
        res.status(500).json({ message: "获取个人信息失败" });
    }
})
// 对话
router.post('/chat', async (req, res) => {
    try {
        // const { model, messages } = req.body;
         await chatService.chat(req, res);
        // res.status(201).json({
        //     code: 201,
        //     message: "对话成功",
        // });
    } catch (err) {
        console.error("对话失败：", err);
        res.status(500).json({ message: "对话失败" });
    }
})
module.exports = router;
