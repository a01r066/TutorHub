const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {...err };
    error.message = err.message;

    // console.log(err);
    // Mongoose bad objectId
    if(err.name === 'CastError'){
        const message = `Resource with id ${err.value} not found!`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplication key error
    if(err.code === 11000){
        const message = `Duplicate field value entered!`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server error!'
    })
}

module.exports = errorHandler;
