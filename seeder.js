const fs = require('fs');
const path = require('path');
require('colors');

const Course = require('./models/Course');
const User = require('./models/User');

const dbConnect = require('./config/db');
dbConnect();

const importData = async () => {
    // User
    await User.create(JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'users.json'), 'utf-8')));

    // Course
    await Course.create(JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'courses.json'), 'utf-8')));

    console.log('Data imported!'.yellow.bold.italic);

    // Finish process
    process.exit();
}

const deleteData = async () => {
    // User
    await User.deleteMany();
    await Course.deleteMany();

    console.log('Data destroyed...!'.red.bold.italic);

    // Finish process
    process.exit();
}

if(process.argv[2] === '-i') {
    importData().then();
} else if(process.argv[2] === '-d'){
    deleteData().then();
}
