// Functions to load each page

var mongoose = require('mongoose');
var Ingredient = mongoose.model('ingredients');
var Meal = mongoose.model('meals');
var ownedIngredient = mongoose.model('ownedIngredient');
var User = mongoose.model('user');
var moment = require('moment');
// var passport = require('passport');
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');

var foodController = require('../controllers/foodController');
var userController = require('../controllers/userController');



module.exports.loadSignup = function(req, res){
    res.render('signup');
};

module.exports.loadLogin = function(req, res){
    if(!req.session.email) {
        // only show login page if not already logged in
        res.render('login');
    }else{
        // otherwise, redirect to home
        res.redirect('/home');
    }
};

module.exports.loadHome = function(req, res){
    console.log("loadHome: req.session.email: " + req.session.email);
    if (req.session.email) {
    // if (sess) {
        console.log("user: " + req.session.email);
        User.findOne({email: req.session.email},function(err,result){
            if(!err){
                var query = foodController.getIngredient();
                query.exec(function(err,ingredients){
                    if(!err){
                        var query = foodController.getMeal();
                        query.exec(function(err,meals){
                            if(!err){
                                res.render('home', {meals: meals,
                                    ingredients: ingredients,
                                    basket: result.shoppinglist});
                            }else{
                                res.sendStatus(404);
                            }
                        });
                    }else{
                        res.sendStatus(404);
                    }
                });
            }else{
                res.sendStatus(404);
            }
        });
    }else{
        console.log("controller loadHome, req.session.email not found");
        res.redirect('/login');
    }
};

module.exports.loadList = function(req, res){
    if (req.session.email) {
        User.findOne({email: req.session.email},function(err,result){
            if(!err){
                res.render('shoppinglist', {list:result.shoppinglist});
            }else{
                res.sendStatus(404);
            }
        });
    }else{
        res.redirect('/login');
    }
};

module.exports.loadPlan = function(req, res){
    if(req.session.email) {
        User.findOne({"email": req.session.email}, function (err, result) {
            if (!err) {
                res.render('plan', {user: result});
            } else {
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect('/login');
    }
};

module.exports.loadBasket = function(req, res) {
    // get user
    if (req.session.email) {
        User.findOne({email: req.session.email}, function(err, user) {
            if (!err) {
                var query = foodController.getIngredient();
                query.exec(function(err, ingredients) {
                    if (!err) {
                        var today = new Date();
                        res.render('basket', {
                            ingredients: ingredients,
                            basket: user.basket
                        });
                    } else {
                        console.log("error loading ingredients");
                        res.sendStatus(404);
                    }
                });
            } else {
                console.log("error finding user..");
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect('/login');
    }
};

module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

module.exports.loadMeals = function(req,res){
    if (req.session.email) {
        User.findOne({email: req.session.email},function(err,result){
            if(!err){
                var query = foodController.getMeal();
                query.exec(function(err,meals){
                    if(!err){
                        res.render('meals', {meals: meals,
                            basket: result.shoppinglist});
                    }else{
                        res.sendStatus(404);
                    }
                    });
            }else{
                res.sendStatus(404);
            }
        });
    } else {
      res.redirect('/login');
    }
};

module.exports.loadIngredients = function(req,res){
    if (req.session.email) {
        User.findOne({email: req.session.email},function(err,result){
            if(!err){
                var query = foodController.getIngredient();
                query.exec(function(err,ingredients){
                    if(!err){
                        res.render('ingredients', {ingredients:ingredients,
                            basket: result.shoppinglist});
                    }else{
                        res.sendStatus(404);
                    }
                });
            }else{
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect('/');
    }
};



