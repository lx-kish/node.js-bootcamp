const mongoose = require('mongoose');
const Tour = require('./tourModel');
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

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

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

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);

    await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: stats.length > 0 ? stats[0].nRating : 4.5,
        ratingsQuantity: stats.length > 0 ? stats[0].avgRating : 0
    });
};

reviewSchema.post('save', function() {
    // this points to current review document
    // this.constructor points to document model
    this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    // console.log('this.findOne returns ===> ', this.r);
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne() does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;