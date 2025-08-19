exports.notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        code: 404,
        message: 'API endpoint not found'
    })
}

exports.errorHandler = (err, req, res, next) => {
    console.error('[Error]', err.stack)

    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        success: false,
        code: statusCode,
        message
    })
}
