const data = require("../models/db");
const member = require("../models/contact");

module.exports.loadHome = function(req, res){
    res.render('home');
};

module.exports.loadContact = function(req, res){
    res.render('contact',{member: member});
};

module.exports.loadItem = function(req, res){
    const itemID = req.params.id;
    res.render("item", {item: data[itemID]});
};

module.exports.loadItemList = function(req, res){
    res.render('items', {data: data});
};

