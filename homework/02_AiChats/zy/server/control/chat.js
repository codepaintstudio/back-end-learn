const { generateResponse } = require('../services/ollama')

exports.chat = async (req, res, next) => {
    try {
        if (!req.body?.message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            })
        }

        const response = await generateResponse(req.body.message)
        res.json({
            success: true,
            response: response.trim()
        })
    } catch (error) {
        next(error)
    }
}
