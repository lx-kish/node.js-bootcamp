const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {

    let message;
    if (err.errmsg) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
        console.log(value);

        message = `Duplicate field value: ${value}. Please use another value!`;
    } else {
        message = `Duplicate field error. Please use another value!`;
    }
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el = el.message);

    const message = `invalid input data. ${errors.join(', ')}`;
    return new AppError(message, 400);
}

const handleJWTError = err => new AppError('Invalid token. Please log in again', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Operational, trusted errors, can be sent to the client
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Weird programming and third party software errors, do not send to the client
        // 1) log the error
        console.error('🔥 error %o', err);

        // 2) send the generic error to the client
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log('inside errorController process.env.NODE_ENV = ', process.env.NODE_ENV);

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

        sendErrorProd(error, res);
    }
}