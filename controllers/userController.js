// functions related to adding users and logging in
var mongoose = require('mongoose');
var Ingredient = mongoose.model('ingredients');
var Meal = mongoose.model('meals');
var ownedIngredient = mongoose.model('ownedIngredient');
var User = mongoose.model('user');
var moment = require('moment');
// var passport = require('passport');
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');

module.exports.checkUser = function(req, res){
    // return true if a user exists in the database already, else false
    // query: email
    User.findOne({"email":req.query.email},function(err,user){
        if(err){
            return(400);
        }else{
            if (user == null){
                res.send(false);
            }else{
                res.send(true);
            }
        }
    });
};

module.exports.addUser = function(req, res) {
    // add a new user to the database
    console.log(req.body);
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password1', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);

    var errors = req.validationErrors();
    if (errors) {
        console.log("Error in adding user");
        res.render('signup', {errors: errors});

    }
    else {

        User.findOne({
            email: {
                "$regex": "^" + req.body.email + "\\b", "$options": "i"
            }
        }, function (err, mail) {
            if (mail) {
                req.flash("danger", "Email has been taken already");
                res.redirect('/signup');
            }
            else {
                var newUser = new User({
                    email: req.body.email,
                    password: req.body.password1
                });
                // hash the password
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password1, salt, function(err, hash) {
                        newUser.password = hash;
                        console.log("newUser.password: " + newUser.password);

                        newUser.save(function (err, user) {
                            if (err) {
                                console.log("signup fails, user: "+ user);
                                res.sendStatus(400);
                            } else {
                                // sess = req.session;
                                // req.session.email = req.body.email;
                                console.log("Signup success ");
                                req.flash("success", "Sign up successfully.");
                                res.redirect('/login');
                            }
                        });
                    });
                });

            }
        });
    }
};

module.exports.userLogin = function (req, res){
    // verify that provided user details match an entry in the db
    // add email to session if valid, otherwise return false
    // body: email, password
    User.findOne({"email":req.body.email},function(err,user){
        if(err){
            return(400);
        }else {
            if (!user) {
                // no such user
                res.send(false);
            } else {
                // if (user.password === req.body.password){
                // not sure if this works for multiple users...
                // need to test when online
                bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
                    if (err) {
                        res.sendStatus(404);
                    } else {
                        if (isMatch) {
                            req.session.email = req.body.email;
                            req.session.password = req.body.password;
                            console.log("Logged in: " + req.session.email);
                            res.send(true);
                        } else {
                            // invalid password
                            res.send(false);
                        }
                    }
                });
            }
        }
    });
};

module.exports.logout = function(req, res){
    req.session.email = null;
    res.redirect('/login');
};