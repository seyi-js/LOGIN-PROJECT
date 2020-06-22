const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const multer = require('multer');
//This File path/location must be same every where posted
const upload = multer({ dest: "./static/img/uploads" });
const path = require('path');
const flash = require("connect-flash");
var session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//Connection to MongoDB
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/gfg", { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("MongoDB Connected...");
});

  
const app = express();

//Passport config
require('./config/passport')(passport);

// User model
const User = require("./models/User");

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Boddyparser
app.use(bodyParser.urlencoded({ extended: false }));

//Express Session
app.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true
    })
);
//Tp serve static files
app.use(express.static('static'));
app.use('/static', express.static('static'));
app.use(express.static(__dirname + '/static'));

// passport
app.use(passport.initialize());
app.use(passport.session());

// connect-flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Cookie Parser
app.use(cookieParser());
//Routes
app.use("/", require("./route/index"));
app.use("/users", require("./route/users"));


// User.findOne({
//   name: 'username2'
// },
// (err, result) => {
//     if(err) throw err;
//      else {
//         // console.log(result.length)
//         var n = Number(result.date)
//         var date = new Date(n)
//         console.log(date.toString())
//         // res.send(JSON.stringify({
//         //     error : 'Error'
//         // }))
//     }
// })

User.find({

    },
    (err, result) => {
        if (err) throw err;
        else {
            console.log(result.length)
            // res.send(JSON.stringify({
            //     error : 'Error'
            // }))
        }
    })






const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
