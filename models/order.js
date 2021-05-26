
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    courses: [{
        course: {
            type: Object,
            require: true
        },
        quantity: {
            type: Number,
            require: true
        }
    }],
    user: {
        userId: {
            type: mongoose.Schema.ObjectId,
            require: true,
            ref: 'User'
        },
        email: {
            type: String,
            require: true
        }
    }
})
module.exports = mongoose.model('Order', orderSchema);
