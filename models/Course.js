const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');
const User = require('./User');

const courseSchema = new Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Please add a course title']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

courseSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
})

module.exports = mongoose.model('Course', courseSchema);
