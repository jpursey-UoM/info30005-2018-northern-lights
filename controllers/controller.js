const member = require("../models/contact");
const ingredients = require("../models/ingredients")
const meals = require("../models/meals")

module.exports.loadHome = function(req, res){
    res.render('home', {meals: meals, ingredients: ingredients});
};

module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

