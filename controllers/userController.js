const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});


exports.createUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};

exports.getUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};

exports.updateUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};

exports.deleteUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};