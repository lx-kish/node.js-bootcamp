const mongoose = require('mongoose');
const validator = require('validator');

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
    password: {
        type: String,
        required: [
            true,
            'Please provide a password'
        ],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [
            true,
            'Please provide a password'
        ]
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;