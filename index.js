const express = require('express');
const app = express();
const path = require('path');
const ejsmate = require('ejs-mate');

const ExpressError = require('./utils/expressError');

const methodOverride = require('method-override');

const mongoose = require('mongoose');
const Campground = require('./models/campground');

const { campgroundSchema, reviewSchema } = require('./schema');

const Review = require('./models/review');

const campgroundRouters = require('./routes/campground');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("MongoDB Connection open");
    })
    .catch((e) => {
        console.log(e);
    })


app.engine('ejs', ejsmate);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }


}

//app.use('/campgrounds', campgroundRouters);

app.get('/', async (req, res) => {

    res.render('home');
})
//==========================================
// Main menu campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})
//==========================================
// Create route
app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampgound, async (req, res, next) => {

    //using req.body.campground because we group it in the html
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();

    res.redirect('/campgrounds');


})

//==========================================
// Show route
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');

    res.render('campgrounds/show', { campground });
})

//==========================================
// edit route
app.get('/campgrounds/:id/edit', async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', validateCampgound, async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });

    res.redirect('/campgrounds');
})

//==========================================
// delete route
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
})

//==========================================
// review route
app.post('/campgrounds/:id/reviews', validateReview, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id/reviews/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log('delete reviwe???');
    res.redirect(`/campgrounds/${id}`);
})
//==========================================
// error handling

// for this all, order is important here because it will only run when nothing matched
app.all('/{*path}', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = 'Something went wrong';
    }

    res.status(status).render('error', { err });
})



//==========================================
// Server listen
app.listen(3000, () => {
    console.log("Listening on port 3000");
});