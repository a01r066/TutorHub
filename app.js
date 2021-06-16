const express = require('express');
const https = require('https');
const fs = require('fs');
require('dotenv/config');
const path = require('path');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const catesRoutes = require('./routes/categories');
const lecturesRoutes = require('./routes/lectures');
const chaptersRoutes = require('./routes/chapters');
const publicRoutes = require('./routes/public');
const couponRoutes = require('./routes/coupons');
const paymentsRoutes = require('./routes/payments');
const feedbackRoutes = require('./routes/feedback');

const errorHandler = require('./middleware/error');

const app = express();

const api = process.env.API_PATH;
const port = process.env.PORT || 3000;

const dbConnect = require('./config/db');

// JSON body parser
app.use(express.json());

// CORS allow
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    next();
})

// Static folder
app.use(express.static(path.join(__dirname, '_data')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileupload(''));
app.use(cookieParser());


app.use(api+'/courses', coursesRoutes);
app.use(api+'/auth', authRoutes);
app.use(api+'/categories', catesRoutes);
app.use(api+'/lectures', lecturesRoutes);
app.use(api+'/chapters', chaptersRoutes);
app.use(api, publicRoutes);
app.use(api+'/coupons', couponRoutes);
app.use(api+'/payments', paymentsRoutes);
app.use(api+'/feedbacks', feedbackRoutes);

app.use(errorHandler);

dbConnect().then(() => {
    // app.listen(port, () => {
    //     console.log(`Server listening on port ${port}`);
    // })
    https.createServer({
        key: fs.readFileSync(path.join(__dirname, '_data', 'selfsigned.key')),
        cert: fs.readFileSync(path.join(__dirname, '_data', 'api.tutorhub.info.pem'))
      }, app)
      .listen(port, function () {
        console.log(`App listening on port ${port}! Go to https://localhost:${port}/`)
      })
}).catch(err => {
    console.log(`Error: ${err.message}`);
})
