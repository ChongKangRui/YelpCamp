const mongoose = require('mongoose');
// like a shortcut
const Schema = mongoose.Schema;
const Review = require('./review');
const { string } = require('joi');
const { cloudinary } = require('../cloudinary');

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const CampgroundScehema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    //Author and reviews will be used for populate
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts)

// Middleware to clean the review from comment
CampgroundScehema.post('findOneAndDelete', async function (doc) {
    //console.log(doc);
    if (doc) {

        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })

        for (let { filename } of doc.images) {
            await cloudinary.uploader.destroy(filename);
        }
    }
})

CampgroundScehema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

module.exports = mongoose.model('Campground', CampgroundScehema);