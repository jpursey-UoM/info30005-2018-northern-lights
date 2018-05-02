//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var BoughtItemSchema = new Schema({
    id: Number,
    name: String,
    image: String,
    type: String
    // purchaseDate: Date,
    // expireDate: Date
});

var BasketSchema = new Schema({
    // id: Number,
    basket : [BoughtItemSchema]
})

// Compile model from schema
module.exports = mongoose.model('Basket', BasketSchema, 'Basket');