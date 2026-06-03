const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelper');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(async () => {
        console.log("MongoDB Connection open");
        await seedDB();
        mongoose.connection.close();

    })
    .catch((e) => {
        console.log(e);
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const city = sample(cities);

        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '6a193618397be05a35a287f9',
            location: `${city.city} - ${city.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    city.longitude,
                    city.latitude,
                ]
            },
            images: [
                {
                    url: "https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg",
                    filename: "Yelpcamp/rj5aowgszjjgwln56aes"
                },
                {
                    url: "https://img.magnific.com/free-photo/closeup-shot-beautiful-butterfly-with-interesting-textures-orange-petaled-flower_181624-7640.jpg?semt=ais_hybrid&w=740&q=80",
                    filename: "Yelpcamp/rj5aowgszjjgwln56aes"
                }
            ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione necessitatibus facilis recusandae neque pariatur, aliquid cum dolorem quibusdam, placeat, atque debitis officia. A alias fuga qui animi itaque voluptates similique?',
            price: price
        })

        await camp.save();
    }

}

