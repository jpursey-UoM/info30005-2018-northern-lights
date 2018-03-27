const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use("/styles", express.static(__dirname + '/styles'));
app.use(express.static("public"));

const router = require("./routes/routes");

const PORT = process.env.PORT || 3000;
app.use('/', router);


app.listen(PORT, function(){
    console.log("Server started");
});