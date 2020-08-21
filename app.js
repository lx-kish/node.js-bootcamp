const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

//MIDDLEWARES

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware!');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//ROUTE HANDLERS

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
};

const getTour = (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) return res.status(404).json({
        status: 'fail',
        message: `Cannot find tour with ID ${req.param.id}`
    }).send();

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
};

const createTour = (req, res) => {
    // console.log(req.body);

    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        });
};

const updateTour = (req, res) => {

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) return res.status(404).json({
        status: 'fail',
        message: `Cannot find tour with ID ${req.param.id}`
    }).send();

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
};

const deleteTour = (req, res) => {

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) return res.status(404).json({
        status: 'fail',
        message: `Cannot find tour with ID ${req.param.id}`
    }).send();

    res.status(204).json({
        status: 'success',
        data: null
    })
};

const getAllUsers = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};

const createUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};

const getUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};

const updateUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};

const deleteUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'This route has not implemented yet'
    })
};

//ROUTES

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

app
    .route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser);

app
    .route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

// SEREVR START

const port = 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})