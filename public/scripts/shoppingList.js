import defaultExport from "../../../models/ingredients"
const ingredients = require("../../../models/ingredients");
const ingredients2 = defaultExport;

var basket = [];
function add2basket(i){
    console.log("Adding " + ingredients[i].name + " to basket");
    basket.push(ingredients[i]);
}

function importTest(){
    console.log(ingredients[0]);
    console.log(ingredients2[0]);
}

importTest()