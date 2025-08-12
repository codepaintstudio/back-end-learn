const { Ollama } = require('ollama');

// 获取模型列表
const getModels = async () => {
    try {
        const ollama = new Ollama();
        const models = await ollama.list();
        console.log("获取模型成功", models);

        return models;

    } catch (err) {
        console.error("获取模型失败：", err);
    }
}

// 对话
const chat = async (req, res) => {
    try {
        // 设置 SSE 响应头
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const ollama = new Ollama();
        const { model, messages } = req.body;

        //看传入的数据对不对
        console.log("使用模型：", model);
        console.log("输入消息：", messages);

        // 开启流式模式
        const stream = await ollama.chat({
            model,
            messages,
            stream: true // 确保开启流式
        });

        // // 标记是否收到过有效内容
        // let hasContent = false;

        // 遍历异步迭代器，获取内容块
        for await (const chunk of stream.itr) {
            // 日志：打印原始 chunk，确认结构
            console.log("收到 chunk：", chunk);

            // 根据 chunk 实际结构提取内容（关键！需根据日志调整）
            // 常见可能：chunk.content / chunk.message.content / chunk.response
            const content = chunk?.message?.content || chunk?.content || "";

            if (content) {
                hasContent = true;
                // 发送内容给前端
                res.write(JSON.stringify({
                    code: 200,
                    data: { content },
                    done: false
                }) + '\n\n');
            }
        }
        res.write(JSON.stringify({
            code: 201,
            message: "对话完成",
            done: true
        }) + '\n\n');
        // // 日志：确认是否有有效内容
        // if (!hasContent) {
        //     console.warn("未收到任何有效内容，可能模型未生成回复");
        //     res.write(JSON.stringify({
        //         code: 200,
        //         data: { content: "模型未返回内容" },
        //         done: true
        //     }) + '\n\n');
        // } else {
        // res.write(JSON.stringify({
        //     code: 201,
        //     message: "对话完成",
        //     done: true
        // }) + '\n\n');
        // }

        res.end();

    } catch (err) {

        console.error("对话出错：", err);
        res.write(JSON.stringify({
            code: 500,
            error: err.message || "生成内容失败"
        }) + '\n\n');
        res.end();
    }
};
module.exports = {
    getModels,
    chat
}

