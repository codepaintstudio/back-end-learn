const axios = require('axios')

exports.generateResponse = async (prompt) => {
    const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'gemma3:4b',
        prompt,
        system: '请用中文回答用户的问题。',
        stream: false
    })
    return response.data.response
}
