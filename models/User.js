const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const userSchema = new Schema({
    displayName: {
        type: String,
        required: [true, 'Please add a fullname'],
        maxLength: [64, 'Fullname must be less than 64 characters!']
    },
    fName: {
        type: String
        // required: [true, 'Please add a firstname'],
        // maxLength: [32, 'Firstname must be less than 16 characters!']
    },
    lName: {
        type: String
        // required: [true, 'Please add a fullname'],
        // maxLength: [32, 'Lastname must be less than 16 characters!']
    },
    headLine: {
        type: String
    },
    biography: String,
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    photoURL: {
        type: String,
        default: ''
    },
    isSocial: {
        type: Boolean,
        default: false
    },
    accessToken: String,
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    purchased_courses: [{
        courseId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course'
        }
    }],
    cart: [{
        courseId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course'
        }
    }]
})

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);
