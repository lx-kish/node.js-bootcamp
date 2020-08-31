const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Username is required!'
        ]
    },
    email: {
        type: String,
        required: [
            true,
            'Email is required!'
        ],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [
            true,
            'Please provide a password'
        ],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [
            true,
            'Please provide a password'
        ],
        validate: {
            // This validator works on CREATE or SAVE only!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password confirm should be the same as a password'
        }
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;