const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schema');
const Review = require('../models/review');

// middleware for validation data create/edit
const validateCampgound = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }


}


//==========================================
// Main menu campgrounds
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})
//==========================================
// Create route
router.get('/new', async (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampgound, async (req, res, next) => {

    //using req.body.campground because we group it in the html
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();

    req.flash('success', 'Successfully create new campground');

    res.redirect('/campgrounds');


})

//==========================================
// Show route
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');

    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
})

//==========================================
// edit route
router.get('/:id/edit', async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
})

router.put('/:id', validateCampgound, async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    else {
        req.flash('success', 'Successfully updated campground');
    }

    res.redirect('/campgrounds');
})

//==========================================
// delete route
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
})



module.exports = router;