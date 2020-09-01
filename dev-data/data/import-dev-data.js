const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successfully established'));

//read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//import data into DB
const importData = async () => {
    try {
        await Tour.create(tours);
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