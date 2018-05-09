// This controller is getting verrrrry big! Should we split it
// into 2 maybe? One for loading pages, one for API requests? - Jason
// Maybe we can have ingredientsController, basketController etc. - Wendy
var mongoose = require('mongoose');
var ingredient = mongoose.model('ingredients');
var meal = mongoose.model('meals');
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
    if (sess) {
        console.log("user: " + sess.email);
        User.findOne({email: sess.email},function(err,result){
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
        res.redirect('/');
    }
};

module.exports.loadList = function(req, res){
    if (sess) {
        User.findOne({email: sess.email},function(err,result){
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
    if (sess) {
        User.findOne({email: sess.email}, function (err, result) {
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
    if(sess) {
        User.findOne({"email": sess.email}, function (err, result) {
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
    if (sess) {
        User.findOne({email: sess.email}, function(err, user) {
            if (!err) {
                var query = getIngredient();
                query.exec(function(err, ingredients) {
                    if (!err) {
                        console.log("expiry: " + user.basket[0].expiryDate.getDate());
                        var today = new Date();
                        console.log(typeof user.basket[0].expiryDate)
                        // console.log("today is: "+ today.getDate());
                        //
                        // console.log("shelf life is: " + Math.floor(Math.abs(parseInt(user.basket[0].expiryDate.getDate()) - parseInt(today.getDate()))/7 * 100));
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
// without refreshing
module.exports.getBasket =  function(req, res) {
    if (sess) {
        User.findOne({email: sess.email}, function(err, user) {
            if (!err){
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
    if (sess){
        const deleteId = req.params.id;
        User.findOne({email: sess.email}, function(err, user) {
            if (!err) {
                // delete the ingredient with deletId
                for (var i = 0; i < user.basket.length; i++) {
                    if (user.basket[i].ingredient.id == deleteId) {
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
    if (sess) {
        User.findOne({email: sess.email}, function (err, user) {
            if (!err) {
                const toAdd = req.body.ingredient;

                // create ownedIngredient and add to basket
                var Ingredient = new ownedIngredient({
                    "ingredient": toAdd,
                    "quantity": 1,
                    "expiryDate": getExpiryDate(toAdd.shelfLife)
                });

                user.basket.push(Ingredient);

                user.save(function (err) {
                    if (err) {
                        console.log("Error adding to basket.");
                        res.sendStatus(404);
                    } else {
                        res.json(Ingredient)
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



module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

module.exports.loadMeals = function(req,res){
    var query = getMeal();
    if (sess) {
    query.exec(function(err,meals){
        if(!err){
            res.render('meals',{meals: meals});
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

module.exports.SearchMeal = function(req,res){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    meal.find({ "name": regex},function (err, doc){
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
    meal.find({ $or: types },function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
};


module.exports.loadIngredients = function(req,res){
    var query = getIngredient()
    if (sess) {
         query.exec(function(err,ingredients){
         if(!err){
            res.render('ingredients',{ingredients: ingredients});
        }else{
            res.sendStatus(404);
        }
    });
    }else {
        res.redirect('/');
}
};


module.exports.loadProfile = function(req, res){
    res.render('profile', {users: users});
};


module.exports.SearchIngredient = function(req,res){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    ingredient.find({ "name": regex},function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
};


module.exports.FilterIngredient = function(req,res){
    var types = [];
    for(var i=0; i<req.query.category.length; i++){
        var type = {};
        type['type'] = req.query.category[i];
        types.push(type);
    }
    ingredient.find({ $or: types },function (err, doc){
        if(!err){
            res.json(doc);
        }else{
            res.sendStatus(404);
        }
    });
};

function getIngredient(){
    var query = ingredient.find();
    return query;
}
function getMeal(){
    var query = meal.find();
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
        for(var i=0;i<item.components.length;i++) {
            console.log(item.components[i].component.id);
            for(var j=0;j<selected.length;j++){
                if(item.components[i].component.id==selected[j]){
                    var Ingredient = new ownedIngredient({
                        "ingredient": item.components[i].component,
                        "quantity": item.components[i].quantity,
                        "expiryDate": getExpiryDate(item.components[i].component.shelfLife),
                        "meal":item
                    });
                    User.findOneAndUpdate(
                        { email: sess.email },
                        { $push: { shoppinglist: Ingredient} },
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
        var Ingredient = new ownedIngredient({
            "ingredient": item,
            "quantity": 1,
            "expiryDate": getExpiryDate(item.shelfLife)
        });
        User.findOneAndUpdate(
            { email: sess.email },
            { $push: { shoppinglist: Ingredient} },
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
    User.findOne({email: sess.email},function(err,result){
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
}

//clear the shopping list
module.exports.clearlist = function(req, res){
    if(sess){
      User.findOneAndUpdate(
        { email: sess.email },
        { $set: { shoppinglist: []} },
        function (err, newItem) {
            if(!err){
                console.log("success")
            }else{
                console.log(err);
            }
        });
    // User.findOneAndUpdate(
    //     { email: sess.email },
    //     { $set: { basket: []} },
    //     function (err, newItem) {
    //         if(!err){
    //             console.log("success")
    //         }else{
    //             console.log(err);
    //         }
    //     });
    //  res.send(true)
    // }else{
    //  res.redirect('/');
     }
}

//clear the basket
module.exports.clearBasket = function(req, res){
    User.findOneAndUpdate(
        { email: sess.email },
        { $set: { basket: []} },
        function (err, newItem) {
            if(!err){
                console.log("success")
            }else{
                console.log(err);
            }
        });
    res.send(true)
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

module.exports.logout = function(req, res){
    sess = null;
    res.redirect('/login');
};