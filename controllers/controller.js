const member = require("../models/contact");
const ingredients = require("../models/ingredients");
const meals = require("../models/meals");
var basket = require("../models/basket");

module.exports.loadHome = function(req, res){
    res.render('home', {meals: meals,
                        ingredients: ingredients,
                        basket: basket});
};

module.exports.loadPlan = function(req, res){
    res.render('plan', {basket: basket});
};

module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

module.exports.addMeal = function(req, res){
    const i = req.params.id;
    addItem(meals[i]);
    module.exports.loadHome(req, res);
};

module.exports.addIngredient = function(req, res){
    const i = req.params.id;
    addItem(ingredients[i]);
    module.exports.loadHome(req, res);
};


////////////// Wendy's ////////////////////////////////////////////
module.exports.loadIngredients = function(req, res) {
    // res.send("hi");
    res.render('basket', {ingredients: ingredients});
};
//////////////////////////////////////////////////////////////////
function addItem(item){
    basket.push(item);
};

module.exports.clearlist = function(req, res){
    console.log("Emptying basket...");
    basket = [];
    module.exports.loadHome(req, res);
};

