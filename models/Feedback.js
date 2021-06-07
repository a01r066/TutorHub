const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        maxLength: [512, 'Fullname must be less than 512 characters!']
    }, 
    message: {
        type: String,
        unique: true,
        required: [true, 'Please add message'],
        minLength: [12, 'message must be more than 12 characters!'],
        maxLength: [1024, 'message must be less than 1024 characters!']
    }
})

module.exports = mongoose.model('Feedback', feedbackSchema);