const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
    title: {
        type: String,
        require: true,
        trim: true,
        maxLength: [64, 'Please enter title!']
    },
    // chapters: {
    //     type: [mongoose.Schema.ObjectId],
    //     ref: 'Chapter',
    //     require: true
    // },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        require: true
    },
    index: {
        type: Number
    }
})

module.exports = mongoose.model('Lecture', lectureSchema);
