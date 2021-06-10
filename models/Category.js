const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        require: [true, 'Please enter title!'],
        maxLength: [64, 'Title must be less than 64 characters!']
    },
    photo: {
        type: String,
        // require: true
    },
    isTop: {
        type: Boolean
    },
    slug: String,
    isHidden: {
        type: Boolean,
        default: false
    }
})

categorySchema.pre('save', function(next){
    this.slug = slugify(this.title, { lower: true });
    next();
})

module.exports = mongoose.model('Category', categorySchema);
