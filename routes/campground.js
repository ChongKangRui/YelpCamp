// const express = require('express');
// const router = express.Router();
// const ExpressError = require('./utils/expressError');


// // middleware for validation data create/edit
// const validateCampgound = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     }
//     else {
//         next();
//     }


// }



// //==========================================
// // Main menu campgrounds
// router.get('/', async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds });
// })
// //==========================================
// // Create route
// router.get('/new', async (req, res) => {
//     res.render('campgrounds/new');
// })

// router.post('/', validateCampgound, async (req, res, next) => {

//     //using req.body.campground because we group it in the html
//     const newCamp = new Campground(req.body.campground);
//     await newCamp.save();

//     res.redirect('/campgrounds');


// })

// //==========================================
// // Show route
// router.get('/:id', async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id).populate('reviews');

//     res.render('campgrounds/show', { campground });
// })

// //==========================================
// // edit route
// router.get('/:id/edit', async (req, res) => {

//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     res.render('campgrounds/edit', { campground });
// })

// router.put('/:id', validateCampgound, async (req, res) => {
//     const { id } = req.params;

//     const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });

//     res.redirect('/campgrounds');
// })

// //==========================================
// // delete route
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);

//     res.redirect('/campgrounds');
// })

// //==========================================
// // review route
// router.post('/:id/reviews', validateReview, async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();

//     res.redirect(`/campgrounds/${campground._id}`);
// })

// router.delete('/:id/reviews/:reviewId', async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     console.log('delete reviwe???');
//     res.redirect(`/campgrounds/${id}`);
// })

// module.exports = router;