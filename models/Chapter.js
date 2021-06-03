const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    title: {
        type: String,
        require: true,
        maxLength: [64, 'Title must be less than 64 characters!']
    },
    format: {
        type: String,
        require: true,
        enum: ['video', 'html', 'quiz'],
        default: 'video'
    },
    file: String,
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
