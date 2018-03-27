const member = require("../models/contact");

module.exports.loadHome = function(req, res){
    res.render('home');
};

module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

