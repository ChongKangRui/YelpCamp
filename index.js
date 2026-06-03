const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);
// if we are running in development, we can access .env anywhere
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ quiet: true });
}


const express = require('express');
const app = express();
const path = require('path');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/expressError');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const sanitizeV5 = require('./utils/mongoSanitizeV5');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const helmet = require('helmet');

const campgroundRouters = require('./routers/campground');
const reviewRouters = require('./routers/review');
const User = require('./models/user');
const userRouters = require('./routers/user');

const dbUrl = process.env.DB_URL;
//'mongodb://127.0.0.1:27017/yelp-camp'
//mongodb+srv://chongkangrui_db_user:<db_password>@ckrportfolio.8ragczn.mongodb.net/?appName=CKRPortfolio
mongoose.connect(dbUrl)
    .then(() => {
        console.log("MongoDB Connection open");
    })
    .catch((e) => {
        console.log(e);
    })


app.engine('ejs', ejsmate);

app.set('query parser', 'extended');

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitizeV5({ replaceWith: '_' }));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});

store.on('error', function (e) {
    console.log('Session store error', e);
})

// for now memory store for development purpose
const sessionOption = {
    store,
    name: 'Session',
    secret: 'thisShouldBeBetterSecret',
    resave: false,
    saveUninitialized: true,
    // for cookie to sent back to server
    cookie: {
        httpOnly: true,
        // when deploy, we want secure 
        // because in production, this will make login not working
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
};

// session and flash setup
app.use(session(sessionOption));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));


// Customize helmet content security policy
// Sound like a pain but this is require to do that for even a bare minimum of security
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.maptiler.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dbfvewisj/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// serialize/deserialize user into session
// making req.user available to use
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'abc@gmail.com', username: 'abc' });
    const newUser = await User.register(user, 'password');
    res.send(newUser);
})

app.use('/', userRouters);
app.use('/campgrounds', campgroundRouters);
app.use('/campgrounds/:id/reviews', reviewRouters);

app.get('/', async (req, res) => {

    res.render('home');
})

//==========================================
// error handling

// for this all, order is important here
// because it will only run when no route matched
app.all('/{*path}', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// express 5 know that this err parameter is for error handle 
// and it will automatically handle error 
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