const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

// GLOBAL MIDDLEWARES

/**
 * Implementing CORS - Cross Origin Resource Sharring
 * CORS limiting cross-origin requests. Only browsers (front-end)
 * requests are limited, server requests not limited by CORS.
 * 
 * It's all about request's headers
 * 
 * In common case it's just adding common header:
 * Access-Control-Allow-Origin *
 * by adding middleware:
 * app.use(cors());
 * Which is allow any requests from any origins (web-browsers)
 * 
 * It's possible to limit applying CORS to specific routes just including
 * cors() as a middleware to the route
 * 
 * It's possible to limit allowing of requests by some specific resources:
 * app.use(cors({
 *  origin: '<front-end host, like https://www.example.com>'
 * }))
 * 
 * If request is not simple (GET or POST), browser, before sending a request
 * sends a 'preflight' to the server, and sends the request only after server
 * responds on the 'preflight'. It calls the 'preflight phase'.
 * Preflight phase is just a request with specific OPTIONS http method:
 * 
 * app.options(<routes>, cors()),
 * 
 * where <routes> might be '*' for all routes, or '/specific/:route/'
 * 
 */
app.use(cors());
app.options('*', cors());


// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//SEt security HTTP headers
// app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limits requests from the same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from the req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevents parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log('req.cookies from test middleware ===> ', req.cookies);
    next();
});

//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;