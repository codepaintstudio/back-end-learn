const { Ollama } = require('ollama')

const ollama = new Ollama()

// 获取模型列表
const getModels = async () => {
    try {
        const models = await ollama.list()
        console.log('获取模型成功', models)
        return models
    } catch (err) {
        console.error('获取模型失败：', err)
    }
}

// 对话函数
const generateResponse = async (prompt) => {
    try {
        const response = await ollama.chat({
            model: 'gemma3:4b',
            messages: [
                {
                    role: 'system',
                    content: '请用中文回答用户的问题。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            stream: false
        })

        return response.message.content
    } catch (err) {
        console.error('生成响应出错：', err)
        throw err
    }
}

// 流式对话函数（保持你原来的 chat 函数）
const chat = async (model, messages) => {
    try {
        const response = await ollama.chat({
            model,
            messages,
            stream: true
        })
        return response
    } catch (err) {
        console.error('对话出错：', err)
        throw err
    }
}

// 导出所有函数
module.exports = {
    getModels,
    generateResponse,
    chat
}
