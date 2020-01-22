const express = require("express");
const multer = require('multer');
const upload = multer({dest: "./static/img/uploads"});
const path=require('path')
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/gfg", { useNewUrlParser: true });
var db = mongoose.connection;

//From Global
const global = require("../global");

const css = "../static/css";


// User model
const User = require("../models/User");

//Getting all users in the DB and render on the webpage in json format
router.get('/userdata', (req,res) => {
User.find({

    },
    (err, result) => {
        if (err) throw err;
        else {
            
            res.json(result)
            
        }
    })
  
})
//Login Page
router.get("/login", function(req, res) {
  res.render("login");
});

//Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register",upload.single("ProfileImage"), (req, res) => {

  if(req.file){
    console.log('File uploaded!');
    var profileimage = req.file.filename;
    // profileimage+='.jpg';
    console.log(profileimage);    
  //   console.log(profileimage);
} else {
    console.log('No file uploaded!!!!!');
    // var profileimage = 'noimage.jpg';
}
  const { name, email, contact, password, password2 } = req.body;
  let errors = [];

  //Check required field
  if (!name || !email || !contact || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //check password match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  //check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      contact,
      password,
      password2
    });
  } else {
    //Validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        //User Exists
        errors.push({ msg: "Email already Exist" });
        res.render("register", {
          errors,
          name,
          email,
          contact,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          contact,
          profileimage,
          password
        });
        //Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // save user
            db.collection("details").insertOne(newUser, (err, collection) => {
              if (err) throw err;
            });
            req.flash(
              "success_msg",
              "Registration Successful. You can now Log In"
            );
            res.redirect("/users/login");
          })
        );
      }
    });
  }
});

//Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
    session: true
  })(req, res, next);
});

//Logout Handle

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are now logged Out");
  global.info = {};
  global.empty=true;
  res.redirect("/users/login");
});

//Forgot Password Page
router.get("/f_password", (req, res) => res.render("forgotpassword"));

//Forgot Password Handle

router.post("/f_password", (req, res) => {
  const { email, password, password2 } = req.body;
  let errors = [];

  //CHECK IF USER EXIST
  User.findOne({ email: email }).then(user => {
    if (!user) {
      errors.push({ msg: "Email  not found" });
      res.render("forgotpassword", {
        errors,
        email,
        password,
        password2
      });
    }
    //check pass length

    //check password match
    if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
      res.render("forgotpassword", {
        errors
      });
    }
    //Password Length
    if (password.length < 6) {
      errors.push({ msg: "Password should be atleast 6 characters" });
    }
    if (errors.length > 0) {
      res.render("forgotpassword", {
        errors,

        password,
        password2
      });
    } else {
      var newUser = { password };

      //Hash Password
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // Set password to hashed
          newUser.password = hash;

          // save user
          var myquery = { email: email };
          var newvalues = {
            $set: { password: newUser.password },
            $currentDate: { lastModified: true }
          };
          db.collection("details").updateOne(myquery, newvalues, function(
            err,
            res
          ) {
            if (err) throw err;
            console.log("1 document updated");
          });
          //Success Msg
          req.flash(
            "success_msg",
            "Password Changed Successfully. You can now Log In"
          );
          res.redirect("/users/login");
        })
      );
    }
  });
});

const { ensureAuthenticated } = require("../config/auth");
//Change Password Page
router.get("/changepass",ensureAuthenticated, (req, res) => {
    res.render("changepassword");
});
//Change Password Handle
router.post("/changepass", ensureAuthenticated,(req, res) => {
  const global = require("../global");
  const id = global.info["login_session"]["_id"];
  const password = req.body.password;
  const password2 = req.body.password2;
  const password3 = req.body.password3;
  let errors = [];
  
  
  User.findOne({ _id: id })
    .then(user => {
      if (!user) {
        errors.push({ msg: "User not found" });
        res.render("changepassword", {
          errors,
          password2,
          password3
        });
      }
      // Match password User password with DB password

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          errors.push({ msg: "Old Passwords do not match" });
          
        }
        //Check required field
  if (!password || !password2 || !password3) {
    errors.push({ msg: "Please fill in all fields" });
  }
        //If Password Match
        if (password2 !== password3) {
          errors.push({ msg: "New Passwords do not match" });
          
        }
        //Password Length
        if (password2.length < 6) {
          errors.push({ msg: "New Password should be atleast 6 characters" });
        }
        // Error Msg
        if (errors.length > 0) {
          res.render("changepassword", {
            errors,
            // password,
            // password2
          });
        } else {
          var newUser = { password2 };

          //Hash Password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password2, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password2 = hash;

              // save user
              var myquery = { _id: id };
              var newvalues = {
                $set: { password: newUser.password2 },
                $currentDate: { lastModified: true }
              };
              db.collection("details").updateOne(myquery, newvalues, function(
                err,
                res
              ) {
                if (err) throw err;
                console.log("1 document updated");
              });
              //Success Msg
              req.flash("success_msg", "Password Changed Successfully.");
              res.redirect("/dashboard");
            })
          );
        }
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
