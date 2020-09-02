const mongoose = require('mongoose');
// const { model } = require('./tourModel');
// review / rating / createdAt / reference to tour / reference to user

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        trim: true,
        required: [
            true,
            'Please comment your score'
        ]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [
            true,
            'Please set a rating of the tour'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [
            true,
            'Review must belong to a tour.'
        ]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [
            true,
            'Review must belong to a user.'
        ]
    }
},
{
    // this is for showing up virtual properties which are not stored at the DB, but instead calculated with model    
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });

    this.populate({
        path: 'user',
        select: 'name photo'
    });
    
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;