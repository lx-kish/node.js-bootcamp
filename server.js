const app = require('./app');

const port = 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});