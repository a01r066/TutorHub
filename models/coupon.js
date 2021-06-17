const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    code: {
        type: String,
        unique: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    discount: {
        type: Number,
        require: true,
        default: 0
    },
    expire: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7),
        require: true
    }
})

module.exports = mongoose.model('Coupon', couponSchema);