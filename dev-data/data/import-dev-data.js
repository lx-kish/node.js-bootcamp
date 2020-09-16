const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

// mongoose.connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: true,
//     useUnifiedTopology: true
// }).then(() => console.log('DB connection successfully established'));
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

//read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//import data into DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data has been loaded successfully');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

//delete data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data has been deleted successfully');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if(process.argv[2] === '--import') {
    importData();
}
if(process.argv[2] === '--delete') {
    deleteData();
}