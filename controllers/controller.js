// This controller is getting verrrrry big! Should we split it
// into 2 maybe? One for loading pages, one for API requests? - Jason

const ingredients = require("../models/ingredients");
const meals = require("../models/meals");
var basket = require("../models/basket");
var mongoose = require('mongoose');


//var User = mongoose.model('users');

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
    res.render('basket', {ingredients: ingredients,
                          basket: basket});
};

module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

module.exports.loadMeals = function(req,res){
    res.render('meals',{meals: meals});
};

module.exports.SearchMeal = function(req,res){
    const foundmeals = [];
    var name
    for(var i=0; i<meals.length; i++){
        name = meals[i].name.toUpperCase();
        if(name.search(req.query.search.toUpperCase()) != -1){
            foundmeals.push(meals[i]);
        }
    }
    res.json(foundmeals);
};

module.exports.FilterMeal = function(req,res){
    const foundmeals = [];
    var type;
    for(var i=0; i<req.query.category.length; i++) {
        console.log(req.query.category.length)
        for (var j = 0; j< meals.length; j++) {
            type = meals[j].type;
            if (type == req.query.category[i]) {
                foundmeals.push(meals[j]);
            }
        }
    }
    res.json(foundmeals);
};

module.exports.loadIngredients = function(req,res){
    res.render('ingredients',{ingredients: ingredients});
};

module.exports.loadProfile = function(req, res){
    res.render('profile', {users: users});

}
module.exports.SearchIngredient = function(req,res){
    const foundingredients = [];
    var name
    for(var i=0; i<ingredients.length; i++){
        name = ingredients[i].name.toUpperCase();
        if(name.search(req.query.search.toUpperCase()) != -1){
            foundingredients.push(ingredients[i]);
        }
    }
    res.json(foundingredients);
};


module.exports.FilterIngredient = function(req,res){
    const foundingredients = [];
    var type;
    for(var i=0; i<req.query.category.length; i++) {
        for (var j = 0; j< ingredients.length; j++) {
            type = ingredients[j].type;
            if (type == req.query.category[i]) {
                foundingredients.push(ingredients[j]);
            }
        }
    }
    res.json(foundingredients);
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


function addItem(item){
    basket.push(item);
};

module.exports.addItemFromList = function(req,res){
    basket.push(req.body.item)
};

module.exports.clearlist = function(req, res){
    basket = [];
    module.exports.loadHome(req, res);
};

module.exports.checkUser = function(req, res){
    console.log("checkUser not implemented yet!");
    console.log("checking: " + req.query.email);
    res.send(false);
};
