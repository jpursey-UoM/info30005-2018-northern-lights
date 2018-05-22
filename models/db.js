var mongoose = require('mongoose');

var mongoDB = "mongodb://laibianl:Ss110110@ds163769.mlab.com:63769/mealmaster";

mongoose.connect(mongoDB,function(err){
    if(!err){
        console.log("Connected to mongo");
    }else{
        console.log("Failed to connect to mongo");
    }
});
require('./schema');
