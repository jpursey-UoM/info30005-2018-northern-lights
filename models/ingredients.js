const faker = require('faker');

const ingredients = [];
console.log("Generating ingredients...");
for(var i = 0; i<100; i++){
    var id = i;
    var name = faker.fake("{{commerce.product}}");
    var image = "https://source.unsplash.com/collection/1146294/100x100";
    ingredients.push({id, name, image})
}

module.exports = ingredients;