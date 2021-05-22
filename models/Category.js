const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        unique: true,
        require: true,
        maxLength: [64, 'Please enter category name!']
    },
    photo: {
        type: String,
        require: true
    },
    slug: String
})

categorySchema.pre('save', function(next){
    this.slug = slugify(this.title, { lower: true });
    next();
})

module.exports = mongoose.model('Category', categorySchema);