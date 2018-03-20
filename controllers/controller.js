const data = require("../models/db");

module.exports.loadHome = function(req, res){
    res.render('home');
};

module.exports.loadUserList = function(req, res){
    res.render('users', {data: data});
};


module.exports.loadProfile = function(req, res){
    const userID = req.params.id;
    res.render("user", {user: data[userID]});
};