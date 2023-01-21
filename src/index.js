const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const route = require('./routes/route.js')
const app = express();

app.use(express.json());

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB, {
    useNewUrlParser: true
}).then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log(`ip ${req.ip}`);
    next();
});

app.use('/', route)

app.use((req, res) => {
    res.status(400).send({ status: false, message: 'Invalid URL' })
})

app.listen(3000, () => console.log('Express app is running on port 3000'));