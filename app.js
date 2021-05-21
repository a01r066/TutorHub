const express = require('express');
require('dotenv/config');
const path = require('path');
const fileupload = require('express-fileupload');

const coursesRoutes = require('./routes/courses');
const errorHandler = require('./middleware/error');

const app = express();

const api = process.env.API_PATH;
const port = process.env.PORT || 5000;

const dbConnect = require('./config/db');

// JSON body parser
app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname, '_data')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileupload(''));

app.use(api+'/courses', coursesRoutes);
app.use(errorHandler);

dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })
}).catch(err => {
    console.log(`Error: ${err.message}`);
})


