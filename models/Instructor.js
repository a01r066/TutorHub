const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    name: String,
    profession: String,
    students: Number,
    rating: Number,
    reviews: Number,
    highlight: String,
    photoURL: String,
    courses: [{
        courseId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course'
        }
    }],
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    }
})

module.exports = mongoose.model('Instructor', instructorSchema);