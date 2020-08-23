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

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});