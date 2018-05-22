const express = require('express');
const app = express();

const session = require("express-session");
const bodyParser = require("body-parser");

const passport = require('passport');
var expressValidator = require('express-validator');

require('./models/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// initialise session stuff
app.use(session({secret:"secreeeet"}));

// initialise passport
app.use(passport.initialize());
app.use(passport.session());


// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/public", express.static(__dirname + '/public'));

const router = require("./routes/routes");

const PORT = process.env.PORT || 3000;
app.use('/',router);

app.listen(PORT, function(){
    console.log("Server started");
});