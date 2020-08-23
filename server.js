const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successfully established'));

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'A tour must have a name'
        ],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [
            true,
            'A tour must have a price'
        ]
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Park Camper',
    price: 997
});

testTour
.save()
.then(doc => {
    console.log(doc);
})
.catch(err => {
    console.log('ERROR: ', err);
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});