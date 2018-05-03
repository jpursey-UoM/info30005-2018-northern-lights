const express = require('express');
const app = express();
var bodyParser = require("body-parser")
require('./models/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//app.use(express.json());
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/public", express.static(__dirname + '/views/public'));

const router = require("./routes/routes");

const PORT = process.env.PORT || 3000;
app.use('/',router);

app.listen(PORT, function(){
    console.log("Server started");
});