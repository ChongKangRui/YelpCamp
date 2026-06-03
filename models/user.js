const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    }


})
// it adding password and username field
userSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model('User', userSchema);