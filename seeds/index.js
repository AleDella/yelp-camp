// File to run on its own for seeding the database
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // My user ID
            author: "661ff87e5346618d7b5a97bc",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "lorem ipsum smth smth",
            price,
            geometry:{
                "type":"Point",
                "coordinates":[
                  cities[random1000].longitude,
                  cities[random1000].latitude
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dwuaeok6m/image/upload/v1716552313/YelpCamp/te0to95oglyu4m8n9byv.jpg',
                  filename: 'YelpCamp/te0to95oglyu4m8n9byv',
                },
                {
                  url: 'https://res.cloudinary.com/dwuaeok6m/image/upload/v1715762811/YelpCamp/padskswnwkbfuibjff24.jpg',
                  filename: 'YelpCamp/padskswnwkbfuibjff24'
                }
              ]
        })
        await camp.save()
    }
}

seedDB();