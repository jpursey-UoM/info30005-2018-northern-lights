const faker = require('faker');

const data = [];

for(var i = 0; i<15; i++){
    var item = {
        food: faker.commerce.productName(),
        price: faker.commerce.price(),
        //cookBy: faker.date.soon(),
        image: faker.image.food()
    };
    data.push(item);
}

module.exports = data;
