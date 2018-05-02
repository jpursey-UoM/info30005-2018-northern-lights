const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/public", express.static(__dirname + '/views/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// create database
var mongoose = require('mongoose');
mongoose.connect('mongodb://wendy:mealmasterfang2152@ds161459.mlab.com:61459/mealmaster', function(err){
    if (!err){
        console.log('Connected to mongo');
    } else {
        console.log('Failed to connect to mongo');
    }
});

const router = require("./routes/routes");

const PORT = process.env.PORT || 3000;
app.use('/',router);

app.listen(PORT, function(){
    console.log("Server started");
});


