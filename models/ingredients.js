const faker = require('faker');
const ingredients = [];

const words=["tofu", "bacon", "sausage", "beans", "lettuce", "tomato", "kidney beans", "ham", "beef", "pasta", "potato",
    "spinach", "rice", "soy sauce", "banana", "blackberry", "avocado", "brown rice",
    "cod", "cream", "corn", "chili", "cheddar", "caviar", "cashew", "dill", "egg", "eggplant",
    "fish", "ginger", "grape", "granola", "guava"];
const types=["Vegetable","Meat","Seafood","Cereal"];
console.log("Generating ingredients...");
var i = 0;
for(item of words){
    var id = i;
    var name = item.charAt(0).toUpperCase() + item.substring(1);
    var image = "https://source.unsplash.com/collection/1146294/200x200";
    var index = Math.floor(Math.random() * types.length);
    var type = types[index];
    var shelfLife = Math.floor(Math.random() * (7 - 0 + 1));
    ingredients.push({id, name, image,type,shelfLife});
    i++;
}
module.exports = ingredients;