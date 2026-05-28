const express = require('express');
const app = express();
const path = require('path');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/expressError');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');

const campgroundRouters = require('./routes/campground');
const reviewRouters = require('./routes/review');

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
app.use(express.static(path.join(__dirname, 'public')));

// for now memory store for development purpose
const sessionOption = {
    secret: 'thisISNotAGoodSecret',
    resave: false,
    saveUninitialized: true,
    // for cookie to sent back to server
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
};

app.use(expressSession(sessionOption));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundRouters);
app.use('/campgrounds/:id/reviews', reviewRouters);


app.get('/', async (req, res) => {

    res.render('home');
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