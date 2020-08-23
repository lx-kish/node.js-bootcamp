const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'A tour must have a name'
        ],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [
            true,
            'A tour must have a duration'
        ]
    },
    maxGroupSize: {
        type: Number,
        required: [
            true,
            'A tour must have a maximum group size'
        ]
    },
    difficulty: {
        type: String,
        required: [
            true,
            'A tour must have a difficulty description'
        ]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [
            true,
            'A tour must have a price'
        ]
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [
            true,
            'A tour must have a description'
        ]
    },
    imageCover: {
        type: String,
        required: [
            true,
            'A tour must have a cover image'
        ]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
});

module.exports = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//     name: 'The Park Camper',
//     price: 997
// });

// testTour
// .save()
// .then(doc => {
//     console.log(doc);
// })
// .catch(err => {
//     console.log('ERROR: ', err);
// });