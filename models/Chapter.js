const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    title: {
        type: String,
        require: true,
        maxLength: [128, 'Title must be less than 64 characters!']
    },
    format: {
        type: String,
        // require: true,
        enum: ['video', 'html', 'htm', 'pdf', 'quiz', 'zip']
    },
    file: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        default: 0
    },
    lecture: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lecture',
        require: true
    },
    isFree: {
        type: Boolean,
        default: false
    },
    index: Number
})

module.exports = mongoose.model('Chapter', chapterSchema);
