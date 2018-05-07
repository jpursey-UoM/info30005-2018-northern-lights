const ingredients = require("./ingredients");
const numIngredients = ingredients.length;
const types=["Japanese","Korean","Chinese","French","Thai","American","German"];
const meals = [];
for(var i = 0; i < 100; i++){
    var components = [];
    for(var j = 0; j < 3; j++){
        // pick 3 random ingredients
        var index =  Math.floor(Math.random() * numIngredients);
        var comp={};
     //   components.push(ingredients[index]);
        comp['component']=ingredients[index];
        comp['quantity']=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        components.push(comp);
        //console.log(comp);
    }
    var name = components[0].component.name + ", " + components[1].component.name + " and " + components[2].component.name;
    var image = "https://source.unsplash.com/collection/1345750/200x200";
    var id = i;
    index = Math.floor(Math.random() * types.length);
    var type = types[index];
    meals.push({id, name, components, image,type});
    //console.log(name)
}


module.exports = meals;