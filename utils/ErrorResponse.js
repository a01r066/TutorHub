const ErrorResponse = (message, statusCode, res) => {
    res.status(statusCode).json({
        success: false,
        message: `Error: ${message}`
    })
}

module.exports = ErrorResponse;
