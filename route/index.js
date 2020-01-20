const express = require("express");
const router = express.Router();
const imageFolder="../static/img/uploads/";
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;

const { ensureAuthenticated } = require("../config/auth");
// const { ensureAuthenticated } = require('connect-ensure-authenticated');

// Welcome page
router.get("/", (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  // var date = new Date();
  // var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  // var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  // var m = month[date.getMonth()];
  // var d = day[date.getDay()];
  // var y = date.getFullYear();
  
  res.render("dashboard", {
    name: req.user.name,
    email: req.user.email,
    contact: req.user.contact,
    date: new Date().toLocaleString(),
    profileimage:imageFolder + req.user.profileimage
  });
});


module.exports = router;
