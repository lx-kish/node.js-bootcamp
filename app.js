const fs = require('fs');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//     res
//     .status(200)
//     .json({
//         message: 'Hello from get endpoint!',
//         app: 'Natours'
//     });
// });

// app.post('/', (req, res) => {
//     res
//     .status(200)
//     .json({
//         message: 'Hello from post endpoint!',
//         app: 'Natours'
//     });
// }

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tours
        }
    })
})

const port = 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})