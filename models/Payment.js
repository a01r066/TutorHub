
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: 'User'
    },
    courses: [
        {
            type: mongoose.Schema.ObjectId,
            require: true,
            ref: 'Course'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    totalPrice: Number,
    paymentType: {
        type: String
    },
    receipt: {
        type: mongoose.Schema.ObjectId
    },
    invoice: {
        type: mongoose.Schema.ObjectId
    }
})
module.exports = mongoose.model('Payment', paymentSchema);
