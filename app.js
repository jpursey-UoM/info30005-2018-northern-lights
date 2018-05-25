const express = require('express');
const app = express();

const session = require("express-session");
const bodyParser = require("body-parser");

const passport = require('passport');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

require('./models/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// initialise session stuff
app.use(session({
    secret: 'secreeeet',
    // resave: true;
    // resave: false,
    // saveUninitialized: false
    cookie: { secure: false }
}));


// initialise passport
// app.use(passport.initialize());
// app.use(passport.session());


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

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/public", express.static(__dirname + '/public'));

const router = require("./routes/routes");

const PORT = process.env.PORT || 3000;
app.use('/',router);

app.listen(PORT, function(){
    console.log("Server started");
});