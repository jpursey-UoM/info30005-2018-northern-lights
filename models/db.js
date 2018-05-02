// create database
var mongoose = require('mongoose');
mongoose.connect('mongodb://wendy:mealmasterfang2152@ds161459.mlab.com:61459/mealmaster', function(err){
    if (!err){
        console.log('Connected to mongo');
    } else {
        console.log('Failed to connect to mongo');
    }
});

module.exports = {
    'boughtItems': require('./boughtItems')
};