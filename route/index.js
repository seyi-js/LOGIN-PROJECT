const express = require("express");
const router = express.Router();
const imageFolder="../static/img/uploads/";
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// User model
const User = require("../models/User");
const { ensureAuthenticated } = require("../config/auth");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/gfg", { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
// const { ensureAuthenticated } = require('connect-ensure-authenticated');

// Welcome page
router.get("/", (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
 res.render("dashboard", {
    name: req.user.name,
    email: req.user.email,
    contact: req.user.contact,
    post: req.user.Post,
    date: new Date().toLocaleString(),
    profileimage:imageFolder + req.user.profileimage
  });
})
router.post("/dashboard", ensureAuthenticated, (req,res) => {
    const global = require("../global");
  const id = global.info["login_session"]["_id"];
  // let notes= null
  // let titles=null
  const note = req.body.note;
   const title = req.body.title
  // titles.push(title);
  var post = [title, note]
  console.log(post)
 
  // notes.push(note);
 var myquery = { _id: id };
              var newvalues = {
                $set: { Post: post },
                $currentDate: { lastModified: true }
              };

 db.collection("details").updateOne(myquery, newvalues, function(
                err,
                res
              ) {
                if (err) throw err;
                console.log("1 document updated");
              });

  res.redirect('/dashboard')
});

//Getting user profile
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
