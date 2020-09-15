const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {

    let message;
    if (err.errmsg) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

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

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expered. Please log in agait.', 401);

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        // API
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // RENDERED WEBSITE
    console.error('🔥 error %o', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        // API
        if (err.isOperational) {
            // Operational, trusted errors, can be sent to the client
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // Weird programming and third party software errors, do not send to the client
        // 1) log the error
        console.error('🔥 error %o', err);

        // 2) send the generic error to the client
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
    // RENDERED WEBSITE
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
    // Weird programming and third party software errors, do not send to the client
    // 1) log the error
    console.error('🔥 error %o', err);

    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please, try again later.'
    });
}

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
}