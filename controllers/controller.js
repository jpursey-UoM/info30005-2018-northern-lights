const member = require("../models/contact");
const ingredients = require("../models/ingredients");
const meals = require("../models/meals");
var basket = require("../models/basket");
const users = require("../models/users");


module.exports.loadSignup = function(req, res){
    res.render('signup');
};

module.exports.loadLogin = function(req, res){
    res.render('login');
};

module.exports.loadHome = function(req, res){
    res.render('home', {meals: meals,
                        ingredients: ingredients,
                        basket: basket});
};

module.exports.loadList = function(req, res){
    res.render('shoppinglist', {basket: basket});
}

module.exports.loadPlan = function(req, res){
    res.render('plan', {basket: basket});
};

module.exports.loadBasket = function(req, res) {
    res.render('basket', {ingredients: ingredients});
};

module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

module.exports.loadMeals = function(req,res){
    res.render('meals',{meals: meals});
};

module.exports.loadIngredients = function(req,res){
    res.render('ingredients',{ingredients: ingredients});
};

module.exports.loadProfile = function(req, res){
    res.render('profile', {users: users});

}

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


function addItem(item){
    basket.push(item);
};

module.exports.clearlist = function(req, res){
    basket = [];
    module.exports.loadHome(req, res);
};

