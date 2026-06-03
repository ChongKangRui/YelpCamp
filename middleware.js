
const Campground = require('./models/campground');
const { campgroundSchema } = require('./schema');
const ExpressError = require('./utils/expressError');
const { reviewSchema } = require('./schema');
const Review = require('./models/review');


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }


}

// isAuthenticated came from passport
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You mush be siged in first');
        return res.redirect('/login');

    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampgound = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(req.body);
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }


}

// authorization
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permitted to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// authorization
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permitted to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}