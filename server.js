const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(`UNCAUGHT EXCEPTION! APPLICATION IS SHUTTING DOWN`);
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successfully established'));

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

