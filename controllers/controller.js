// This controller is getting verrrrry big! Should we split it
// into 2 maybe? One for loading pages, one for API requests? - Jason

const ingredients = require("../models/ingredients");
const meals = require("../models/meals");
var basket = require("../models/basket");
var mongoose = require('mongoose');
var ingdb = mongoose.model('ingredients');
var mealdb = mongoose.model('meals');
var plan = mongoose.model('plan');
// var basketdb = mongoose.model('basket');
// var shoppinglist = mongoose.model('shoppinglist');
var ownedIngredient = mongoose.model('ownedIngredient');
var User = mongoose.model('user');


var sess;
module.exports.loadSignup = function(req, res){
    res.render('signup');
};

module.exports.loadLogin = function(req, res){
    if(!sess) {
        // only show login page if not already logged in
        res.render('login');
    }else{
        // otherwise, redirect to home
        res.redirect('/home');
    }
};

module.exports.loadHome = function(req, res){
    // var query = User.find();
    // User.findOne({email: "admin"},function(err,basket){
    //     if(!err){
    //         console.log(basket)
    //         res.render('home', {meals: meals,
    //             ingredients: ingredients,
    //             basket: basket});
    //     }else{
    //         res.sendStatus(404);
    //     }
    // });
    // res.render('home', {meals: meals,
    //                     ingredients: ingredients,
    //                     basket: basket});
    if (sess) {
        console.log("user: " + sess.email);
        res.render('home', {
            meals: meals,
            ingredients: ingredients,
            basket: basket
        });
    }else{
        res.redirect('/');
    }
};

module.exports.loadList = function(req, res){
    res.render('shoppinglist', {basket: basket});
};

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
    var query = getMeal();
    query.exec(function(err,meals){
        if(!err){
            res.render('meals',{meals: meals});
        }else{
            res.sendStatus(404);
        }
    });
    //res.render('meals',{meals: meals});
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
    var types = [];
    for(var i=0; i<req.query.category.length; i++){
        var type = {};
        type['type'] = req.query.category[i];
        types.push(type);
    }
    mealdb.find({ $or: types },function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
};

module.exports.loadIngredients = function(req,res){
    var query = getIngredient()
    query.exec(function(err,ingredients){
        if(!err){
            res.render('ingredients',{ingredients: ingredients});
        }else{
            res.sendStatus(404);
        }
    });
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
    var types = [];
    for(var i=0; i<req.query.category.length; i++){
        var type = {};
        type['type'] = req.query.category[i];
        types.push(type);
    }
    ingdb.find({ $or: types },function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
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

function getIngredient(){
    var query = ingdb.find();
    return query;
}
function getMeal(){
    var query = mealdb.find();
    return query;
}

function getExpiryDate(shelfLife){
    var CurrentDate = new Date();
    CurrentDate.setDate(CurrentDate.getDate() + parseInt(shelfLife));
    return CurrentDate;
}

module.exports.addItemFromList = function(req,res){
    var query=req.body.item;
    //check if add from meal list or ingredient list
    if(req.body.item.components){
        console.log(createIngredientItem(query,true));
    }else {
        console.log(createIngredientItem(query,false));
    }
};

function createIngredientItem(item,includeMeal){
    if(includeMeal){
        for(var i=0;i<item.components.length;i++) {
            var Ingredient = new ownedIngredient({
                "ingredient": item.components[i].component,
                "quantity": item.components[i].quantity,
                "expiryDate": getExpiryDate(item.components[i].component.shelfLife),
                "meal":item
            });
            User.findOneAndUpdate(
                { email: "admin" },
                { $push: { shoppinglist: Ingredient} },
                function (err, newItem) {
                    if(!err){
                        console.log("success")
                    }else{
                        console.log(err);
                    }
                });
            //
            // Ingredient.save(function(err,newItem){
            //     if(!err){
            //         console.log("success")
            //     }else{
            //         console.log(err);
            //     }
            // });
        }
    }else {
        var Ingredient = new ownedIngredient({
            "ingredient": item,
            "quantity": 1,
            "expiryDate": getExpiryDate(item.shelfLife)
        });
        User.findOneAndUpdate(
            { email: "admin" },
            { $push: { shoppinglist: Ingredient} },
            function (err, newItem) {
                if(!err){
                    console.log("success")
                }else{
                    console.log(err);
                }
            });
        // Ingredient.save(function(err,newItem){
        //     if(!err){
        //         console.log("success")
        //     }else{
        //         console.log(err);
        //     }
        // });
    }
}

module.exports.clearlist = function(req, res){
    basketdb.remove(function (err, doc){
        if(!err){
            console.log("sucess")
        }else{
            //console.log("fail")
            res.sendStatus(404);
        }
    });
    ownedIngredient.remove(function (err, doc){
        if(!err){
            console.log("sucess")
        }else{
           // console.log("fail")

            res.sendStatus(404);
        }
    });
    res.send(true)
    //basket = [];
   // module.exports.loadHome(req, res);
}


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


module.exports.addUser = function(req, res){
    // add a new user to the database
    // body: email, password
    var user = new User({
        "email":req.body.email,
        "password":req.body.password
    });
    user.save(function(err, user){
        if(!err){
            res.send(user)
        }else{
            res.sendStatus(400);
        }
    })


};

module.exports.userLogin = function(req, res){
    // verify that provided user details match an entry in the db
    // add email to session if valid, otherwise return false
    // body: email, password
<<<<<<< HEAD
    console.log("userLogin not implemented yet!");
    const valid = true; // CHANGE THIS

    if (valid) {
        sess = req.session;
        sess.email = req.body.email;
        console.log("Logged in: " + sess.email);

        // how to redirect to home now?
        // res.redirect('/home') not working!!
    }else{
        res.send(false);
    }
};

module.exports.thing = function (req, res) {
    res.redirect('/home');
};
    User.findOne({"email":req.body.email},function(err,user){
        if(err){
            return(400);
        }else{
            if (user != null){
                if (user.password === req.body.password){
                    // not sure if this works for multiple users...
                    // need to test when online
                    sess = req.session;
                    sess.email = req.body.email;
                    console.log("Logged in: " + sess.email);
                    res.send(true);
                }else{
                    res.send(false);
                }
            }else{
                res.send(false);
            }
        }
    });
};
