const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground');
//const { campgroundSchema } = require('../schema');
const Review = require('../models/review');
const { isLoggedIn, isAuthor, validateCampgound } = require('../middleware');
const campground = require('../models/campground');
const multer = require('multer')

const { storage } = require('../cloudinary');
// it is kinda like telling multer to use cloudinary storage
const upload = multer({ storage })




//==========================================
// Main menu campgrounds

// A more fancy way of group thing
router.route('/')
    // Main menu campgrounds
    .get(campgrounds.index)
    // validatecampground need to run after upload.array image 
    // because it add image into the req.body and validate campground 
    // require to validate it
    .post(isLoggedIn, upload.array('image'), validateCampgound, campgrounds.createCampground)


//==========================================
// Create route
router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm)


//==========================================
// Show route
router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, upload.array('image'), validateCampgound, isAuthor, campgrounds.editCampground)
    //==========================================
    // delete route
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)


//==========================================
// edit route
router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm)






module.exports = router;