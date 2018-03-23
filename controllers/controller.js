const data = require("../models/db");

module.exports.loadHome = function(req, res){
    res.render('home');
};

module.exports.loadItemList = function(req, res){
    res.render('items', {data: data});
};


module.exports.loadItem = function(req, res){
    const itemID = req.params.id;
    res.render("item", {item: data[itemID]});
};