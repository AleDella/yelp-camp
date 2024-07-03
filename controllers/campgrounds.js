// File containing the logic of the campgrounds
const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary");
// Mapping
const mapToken = process.env.MAPTILER_TOKEN;
const maptiler = require('@maptiler/client');
// Set-up the key
maptiler.config.apiKey = mapToken;



module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await maptiler.geocoding.forward(req.body.campground.location, {limit: 1});
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Sucessfully created a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.showCampground = async (req,res) => {
    // With this notation we populate both the review's author and the campground's one
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path:'author'
        }
    }).populate('author');
    if (!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages){
        // Delete from the cloud
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Sucessfully updated the campground!')
    res.redirect(`/campgrounds/${camp._id}`)
};

module.exports.deleteCampground = async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted the campground!')
    res.redirect('/campgrounds');
};