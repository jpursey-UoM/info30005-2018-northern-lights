const ingredients = require("./ingredients");
const numIngredients = ingredients.length;
const types=["Japanese","Korean","Chinese","French","Thai","American","German"];
const meals = [];
for(var i = 0; i < 100; i++){
    var components = [];
    for(var j = 0; j < 3; j++){
        // pick 3 random ingredients
        var index =  Math.floor(Math.random() * numIngredients);
        components.push(ingredients[index]);
    }
    var name = (components[0]).name + ", " + components[1].name + " and " + components[2].name;
    var image = "https://source.unsplash.com/collection/1345750/200x200";
    var id = i;
    index = Math.floor(Math.random() * types.length);
    var type = types[index];
    meals.push({id, name, components, image,type});
}

module.exports = meals;