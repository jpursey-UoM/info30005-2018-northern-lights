// This controller is getting verrrrry big! Should we split it
// into 2 maybe? One for loading pages, one for API requests? - Jason
// Maybe we can have ingredientsController, basketController etc. - Wendy
var mongoose = require('mongoose');
var Ingredient = mongoose.model('ingredients');
var Meal = mongoose.model('meals');
var ownedIngredient = mongoose.model('ownedIngredient');
var User = mongoose.model('user');
var moment = require('moment');
// var passport = require('passport');
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');



// suggestions for how to split controller?...
// var sess;
// sess = {email:'admin@gmail.com'};

module.exports.loadSignup = function(req, res){
    res.render('signup');
};

module.exports.loadLogin = function(req, res){
    // if (req.session.email){
        // res.redi
    // }
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
                var query = getIngredient();
                query.exec(function(err,ingredients){
                    if(!err){
                        var query = getMeal();
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
        res.redirect('/');
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
        res.redirect('/');
    }
};

// page: shopping list page, action: when "finish" is clicked
module.exports.finishShopping = function(req, res) {
    if (req.session.email) {
        User.findOne({email: req.session.email}, function (err, result) {
            if (!err) {
                var selected = Object.keys(req.body);
                var id;
                var selectedId;

                for (var i=result.shoppinglist.length-1; i>=0; i--){
                    // if in selected
                    id = parseInt(result.shoppinglist[i].ingredient.id);
                    for (var j=selected.length; j>=0; j--){
                        selectedId = parseInt(selected[j]);
                        if (id === selectedId){
                            // delete from list
                            var selectedItem = result.shoppinglist[i];
                            result.shoppinglist.splice(i, 1);

                            // add to basket
                            result.basket.push(selectedItem);
                        }
                    }
                }

                result.save(function (err) {
                    if (err) {
                        res.sendStatus(404);
                        return;
                    }
                });
                res.redirect('/plan');
                return;
            } else {
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect('/');
    }
};

// page: plan
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

// page: basket
module.exports.loadBasket = function(req, res) {
    // get user
    if (req.session.email) {
        User.findOne({email: req.session.email}, function(err, user) {
            if (!err) {
                var query = getIngredient();
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

// page: basket, action: respond to ajax's GET request for the basket
module.exports.getBasket =  function(req, res) {
    if (req.session.email) {
        User.findOne({email: req.session.email}, function(err, user) {
            if (!err){
                // console.log(user.basket[0].expiryDate.getDate());
                res.json(user.basket);
            } else {
                console.log("cannot find user.");
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect('/login');
    }
};

// page: basket, action: when the "-" button beside an ingredient in the basket is clicked
module.exports.deleteFromBasket = function(req, res) {
    if (req.session.email){
        const deleteId = req.params.id;
        User.findOne({email: req.session.email}, function(err, user) {
            if (!err) {
                // delete the ingredient with deletId
                for (var i = 0; i < user.basket.length; i++) {
                    if (user.basket[i]._id.toString() == deleteId) {
                        user.basket.splice(i, 1);
                        break;
                    }
                }
                // save
                user.save(function (err) {
                    if (err) {
                        console.log("error deleting item from basket.");
                        res.sendStatus(404);
                    } else {
                        res.json(deleteId);
                    }
                });
            } else {
                console.log("error finding the user.");
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect('/login');
    }
};

// page: basket, action: when + button besides an ingredient is clicked
module.exports.addToBasket = function(req, res){
    if (req.session.email) {
        User.findOne({email: req.session.email}, function (err, user) {
            if (!err) {
                const ingredientId = req.body.ingredientId;
                Ingredient.findOne({id: ingredientId}, function (err, toAdd) {
                    if (!err) {
                        // create ownedIngredient and add to basket
                        var Ingredient = new ownedIngredient({
                            "ingredient": toAdd,
                            "quantity": 1,
                            "expiryDate": getExpiryDate(toAdd.shelfLife)
                        });

                        user.basket.push(Ingredient);

                        user.save(function (err) {
                            if (err) {
                                console.log("error adding to basket.");
                                res.sendStatus(404);
                            } else {
                                res.json(Ingredient)
                            }
                        });
                    } else {
                        console.log("error adding to basket.");
                        res.sendStatus(404);
                    }
                });
            } else {
                console.log("error finding the user.");
                res.sendStatus(404);
            }
        })
    } else {
        res.redirect('/login');
    }
};


// update the basket after adding meals to your plan
module.exports.updateBasket = function(req,res){
    const basket = req.body.basket;
    for (var i=0; i < basket.length ; i++){
        console.log("Name: " + basket[i].ingredient.name + ", planDate: " + basket[i].planDate);
    }
    if(req.session.email){
        User.findOne({email: req.session.email}, function (err, user) {
            if (!err) {
                user.basket = req.body.basket;
                console.log(user.basket);
            }
        });

    }
};

module.exports.updateExpiry = function(req, res){
    if (req.session.email) {
        User.findOne({email: req.session.email}, function (err, user) {
            if (!err) {
                var id = req.body.id;
                var action = req.body.action;

                // get the ingredient from user's basket and update the expiry date
                for (var i = 0; i < user.basket.length; i++) {
                    if (user.basket[i]._id.toString() == id) {

                        var current = user.basket[i].expiryDate;
                        console.log("before: " + current);
                        var newDate = moment(current);


                        if (action == '-1') {
                            newDate.subtract(1, 'days');
                            user.basket[i].expiryDate = newDate;

                        } else if (action == '1'){
                            newDate.add(1, 'days');
                            user.basket[i].expiryDate = newDate;
                        }
                        break;
                    }
                }

                user.save(function(err) {
                    if (!err) {

                        res.json(user.basket[i]);

                    } else {
                        // console.log("error updating expiry date.");
                        // res.sendStatus(404);
                    }
                });
            } else {
                console.log("error finding user when updating expiry date.");
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect('/');
    }
};

module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

module.exports.loadMeals = function(req,res){
    if (req.session.email) {
        User.findOne({email: req.session.email},function(err,result){
            if(!err){
                var query = getMeal();
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
      res.redirect('/');
    }
};

//reference from stackoverflow
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports.updateBasket = function(req,res){
    if (req.session.email) {
        User.findOne({email: req.session.email},function(err,result){
            if(!err){
                res.json(result.shoppinglist);
            }else{
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect('/');
    }
};

module.exports.SearchMeal = function(req,res){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Meal.find({ "name": regex},function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
};

module.exports.FilterMeal = function(req,res){
    var types = [];
    for(var i=0; i<req.query.category.length; i++){
        var type = {};
        type['type'] = req.query.category[i];
        types.push(type);
    }
    Meal.find({ $or: types },function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
};

module.exports.createMeal = function(req, res){
    console.log(req.body)
    var meal = new Meal(req.body);
    Meal.count({}, function(err, count){
        meal.id = count + 1;
        meal.save(function (err, meal) {
            if(!err){
                res.send(meal);
            }else{
                res.sendStatus(404);
            }
        })
    });
};

module.exports.createIngredient = function(req, res){

    var ingredient = new Ingredient(req.body);
    // work out what the next id should be
    Ingredient.count({}, function(err, count){
        ingredient.id = count + 1;
        ingredient.save(function (err, ingredient) {
            if(!err){
                res.send(ingredient);
            }else{
                res.sendStatus(404);
            }
        })
    });
};


module.exports.loadIngredients = function(req,res){
    if (req.session.email) {
        User.findOne({email: req.session.email},function(err,result){
            if(!err){
                var query = getIngredient();
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


module.exports.loadProfile = function(req, res){
    res.render('profile', {users: users});
};


module.exports.SearchIngredient = function(req,res){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Ingredient.find({ "name": regex},function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
};

module.exports.getIngredientById = function(req, res){
  const id = req.query.id;
  Ingredient.findOne({'id': id}, function(err, ing){
      if(!err){
          res.send(ing);
      }else{
          res.sendStatus(404);
      }
  })
};


module.exports.FilterIngredient = function(req,res){
    var types = [];
    for(var i=0; i<req.query.category.length; i++){
        var type = {};
        type['type'] = req.query.category[i];
        types.push(type);
    }
    Ingredient.find({ $or: types },function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
};

function getIngredient(){
    var query = Ingredient.find();
    return query;
}
function getMeal(){
    var query = Meal.find();
    return query;
}

function getExpiryDate(shelfLife){
    var CurrentDate = new Date();
    CurrentDate.setDate(CurrentDate.getDate() + parseInt(shelfLife));
    return CurrentDate;
}

//add an item to the shopping list
module.exports.addItemFromList = function(req,res){
    var query=req.body.item;
    //check if the item is added from meal list or ingredient list
    if(req.body.item.components){
        createIngredientItem(query,true,req.body.selected);
        res.send(true)
    }else {
        createIngredientItem(query,false,[]);
        res.send(true)
    }
};

function createIngredientItem(item,includeMeal,selected){
    if(includeMeal){
        console.log(item.components); // no error...
        for(var i=0;i<item.components.length;i++) { // cannot read property length of undefined??
            console.log(item.components[i].component.id);
            for(var j=0;j<selected.length;j++){
                if(item.components[i].component.id==selected[j]){
                    var ingredient = new ownedIngredient({
                        "ingredient": item.components[i].component,
                        "quantity": item.components[i].quantity,
                        "expiryDate": getExpiryDate(item.components[i].component.shelfLife),
                        "meal":item
                    });
                    User.findOneAndUpdate(
                        { email: req.session.email },
                        { $push: { shoppinglist: ingredient} },
                        function (err, newItem) {
                            if(!err){
                                console.log("success")
                            }else{
                                console.log(err);
                            }
                        });
                    selected.splice(j, 1);
                    break;
                }
            }
        }
    }else {
        var ingredient = new ownedIngredient({
            "ingredient": item,
            "quantity": 1,
            "expiryDate": getExpiryDate(item.shelfLife)
        });
        User.findOneAndUpdate(
            { email: req.session.email },
            { $push: { shoppinglist: ingredient} },
            function (err, newItem) {
                if(!err){
                    console.log("success")
                }else{
                    console.log(err);
                }
            });
    }
}
module.exports.deleteItem = function(req, res){
    User.findOne({email: req.session.email},function(err,result){
        if(!err){
            for(var i=0;i<result.shoppinglist.length;i++){
                if(result.shoppinglist[i].ingredient._id == req.body.id){
                    result.shoppinglist.splice(i, 1);
                    break;
                }
            }
            result.save(function (err) {
                if (err) {
                    res.sendStatus(404);
                }
            });
            res.send(true)
        }else{
            res.sendStatus(404);
        }
    });
};

//clear the shopping list
module.exports.clearlist = function(req, res){
    if(req.session.email){
      User.findOneAndUpdate(
        { email: req.session.email },
        { $set: { shoppinglist: []} },
        function (err, newItem) {
            if(!err){
                console.log("success")
            }else{
                console.log(err);
            }
        });
    // User.findOneAndUpdate(
    //     { email: req.session.email },
    //     { $set: { basket: []} },
    //     function (err, newItem) {
    //         if(!err){
    //             console.log("success")
    //         }else{
    //             console.log(err);
    //         }
    //     });
     res.send(true)
    }else{
     res.redirect('/');
     }
};

//clear the basket
module.exports.clearBasket = function(req, res){
    User.findOneAndUpdate(
        { email: req.session.email },
        { $set: { basket: []} },
        function (err, newItem) {
            if(!err){
                console.log("success")
            }else{
                console.log(err);
            }
        });
    res.send(true)
};


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

module.exports.thing = function (req, res) {
    res.redirect('/home');
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
    sess = null;
    res.redirect('/login');
};