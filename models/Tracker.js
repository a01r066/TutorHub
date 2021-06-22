const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackerSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    courses: [
        {
            course: {
                type: mongoose.Schema.ObjectId,
                ref: 'Course'
            },
            data: {
                lecture: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Lecture'
                },
                chapter: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Chapter'
                },
                lectureIndex: {
                    type: Number,
                    default: 0
                },
                chapterIndex: {
                    type: Number,
                    default: 0
                }
            }
        }
    ]
})

module.exports = mongoose.model('Tracker', trackerSchema);