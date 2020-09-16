const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(`UNCAUGHT EXCEPTION! APPLICATION IS SHUTTING DOWN`);
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const dbConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};

if (process.env.DATABASE_CONNECTION === 'local') {
    mongoose.connect(process.env.DATABASE_LOCAL, dbConnectionOptions)
    .then(() => console.log('DB connection to local DB successfully established'));
} else {
    const DB = process.env.DATABASE_ATLAS.replace(
        '<PASSWORD>',
        process.env.DATABASE_ATLAS_PASSWORD
    );

    mongoose.connect(DB, dbConnectionOptions)
    .then(() => console.log('DB connection to Atlas service successfully established'));
}

const port = process.env.PORT || 5050;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(`UNHANDLED REJECTION! APPLICATION IS SHUTTING DOWN`);
    console.log(err);
    // graceful exit:
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated.');
    });
});