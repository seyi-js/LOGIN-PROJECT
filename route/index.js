const express = require("express");
const router = express.Router();
const imageFolder="../static/img/uploads/";
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// User model
const User = require("../models/User");
const { ensureAuthenticated } = require("../config/auth");
// const { ensureAuthenticated } = require('connect-ensure-authenticated');

// Welcome page
router.get("/", (req, res) => res.render("welcome"));

// Dashboard
router.route("/dashboard").get( ensureAuthenticated, (req, res) => {
  let notes= [];
  if(req.method == 'POST') {
    const note = req.body.note
    notes.push(note)
  } else

  res.render("dashboard", {
    name: req.user.name,
    email: req.user.email,
    contact: req.user.contact,
    notes: notes,
    date: new Date().toLocaleString(),
    profileimage:imageFolder + req.user.profileimage
  });
}).post(ensureAuthenticated, (req,res) => {
   const note = req.body.note;
  let notes = [];
 
  notes.push(note);

  res.render('dashboard',  {
    name: req.user.name,
    email: req.user.email,
    contact: req.user.contact,
    notes: notes,
    date: new Date().toLocaleString(),
    profileimage:imageFolder + req.user.profileimage
  })
});


router.get('/dashboard/:name', (req, res) => {
  let errors =[];
  User.findOne({ name: req.params.name}).then(user => {
    if (!user) {
      errors.push({ msg: "User  not found. Login or cross-check the url" });
    }
    if(errors.length > 0) {
      res.render("login", {
        errors
      });
    }else {
      res.render('profile', {
    name: user.name,
    email: user.email,
    contact: user.contact,
    date: new Date().toLocaleString(),
    profileimage:imageFolder + user.profileimage
  })
    }
  })
})





module.exports = router;
