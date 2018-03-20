const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const data = require("./models/db");
const router = require("./routes/routes");

const PORT = process.env.PORT || 300;
app.use('/', router);



app.listen(PORT, function(){
    console.log("Server started");
});