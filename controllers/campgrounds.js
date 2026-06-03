
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

// if we are running in development, we can access .env anywhere
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ quiet: true });
}

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req, res) => {

    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {

    // Campground data
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // console.log(geoData);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/campgrounds/new');
    }

    //using req.body.campground because we group it in the html
    const newCamp = new Campground(req.body.campground);

    // geometry and location
    newCamp.geometry = geoData.features[0].geometry;
    newCamp.location = geoData.features[0].place_name;

    newCamp.author = req.user._id;
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newCamp.save();
    //console.log(newCamp);
    req.flash('success', 'Successfully create new campground');

    res.redirect('/campgrounds');


}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground, });
}

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }



    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;


    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });

    // basically try to access a property that may not exist with question mark here
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/campgrounds/${id}/edit`);
    }

    // console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });


    camp.geometry = geoData.features[0].geometry;
    camp.location = geoData.features[0].place_name;


    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));

    camp.images.push(...imgs);

    await camp.save();

    if (req.body.deleteImages) {

        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log('update success');
    }

    if (!camp) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    else {
        req.flash('success', 'Successfully updated campground');
    }



    res.redirect('/campgrounds');
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);


    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}