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
            location: `${city.city} - ${city.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione necessitatibus facilis recusandae neque pariatur, aliquid cum dolorem quibusdam, placeat, atque debitis officia. A alias fuga qui animi itaque voluptates similique?',
            price: price
        })

        await camp.save();
    }

}

