const member = require("../models/contact");
const ingredients = require("../models/ingredients");
const meals = require("../models/meals");
const users = require("../models/users");
const Basket = require("../models/basket");

module.exports.loadSignup = function(req, res){
    res.render('signup');
};

module.exports.loadLogin = function(req, res){
    res.render('login');
};

module.exports.loadHome = function(req, res){
    Basket.findOne({}, function(err, basket){
        res.render('home', {meals: meals,
            ingredients: ingredients,
            basket: basket.basket});
    });
};

// module.exports.loadHome = function(req, res){
//     res.render('home', {meals: meals,
//         ingredients: ingredients,
//         basket: basket});
// };

module.exports.loadList = function(req, res){
    Basket.findOne({}, function(err, basket){
        res.render('shoppinglist', {basket: basket.basket});
    });
};

module.exports.loadPlan = function(req, res){
    Basket.findOne({}, function(err, basket){
        res.render('plan', {basket: basket.basket});
    });
};

module.exports.loadBasket = function(req, res) {
    Basket.findOne({}, function(err, basket){
        res.render('basket', {ingredients: ingredients});
    });
};

module.exports.getBasket =  function(req, res) {
    Basket.findOne({}, function(err, basket){
        res.json(basket.basket);
    });
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
        name = meals[i].name;
        if(name.search(req.query.search) != -1){
            foundmeals.push(meals[i]);
        }
    }
    res.json(foundmeals);
};

module.exports.FilterMeal = function(req,res){
    const foundmeals = [];
    var type
    for(var propName in req.query) {
        for (var i = 0; i < meals.length; i++) {
            type = meals[i].type;
            if (type == propName) {
                foundmeals.push(meals[i]);
            }
        }
    }
    res.render('meals',{meals: foundmeals});
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
        name = ingredients[i].name;
        if(name.search(req.query.search) != -1){
            foundingredients.push(ingredients[i]);
        }
    }
    res.json(foundingredients);
};


module.exports.FilterIngredient = function(req,res){
    const foundingredients = [];
    var type
    for(var propName in req.query) {
        for (var i = 0; i < ingredients.length; i++) {
            type = ingredients[i].type;
            if (type == propName) {
                foundingredients.push(ingredients[i]);
            }
        }
    }
    res.render('ingredients',{ingredients: foundingredients});
};

module.exports.addMeal = function(req, res){
    const i = req.params.id;
    addItem(meals[i]);
    module.exports.loadHome(req, res);
};

module.exports.addIngredient = function(req, res){
    const i = req.params.id;
    addItem(ingredients[i]);
    res.redirect('/home');
};

module.exports.addToBasket = function(req, res){
    const toAdd = req.body.ingredient;
    addItem(toAdd);
    res.json(toAdd);
};

module.exports.deleteFromBasket = function(req, res) {
    const deleteId = req.params.id;
    Basket.findOne({}, function(err, basket) {
        // get basket array
        var basketArray = basket.basket;

        // find the item with deleteId
        for (var i = 0; i < basketArray.length; i++) {
            if (basketArray[i].id == deleteId) {
                basketArray.splice(i, 1);
                break;
            }
        }

        // save
        basket.save(function (err) {
            if (err) {
                console.log("error deleting item from basket.");
            }
        });
        res.json(deleteId);
    });

};


function addItem(item){
    Basket.findOne({}, function(err, basket){
        basket.basket.push(item);
        basket.save(function(err) {
          if (err){
              console.log("error adding item to basket");
          }
        });
    });
};


module.exports.clearlist = function(req, res){
    // basket = [];
    Basket.findOne({}, function(err, basket){
        basket.basket = [];
        basket.save(function(err) {
            if (err){
                console.log("error clearing list");

            }
        });
    });
    res.redirect('/home');
};
