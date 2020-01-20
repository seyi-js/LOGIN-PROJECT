const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcryptjs");

//Load User Model

const User = require("../models/User");

const global=require('../global');

global.info['name']='passport.js';

module.exports = passport =>{
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: "Incorrect Email or  Password"
            });
          }
          // Match password

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Incorrect Email or  Password"
              });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );
 
  var user_cache = {};
  passport.serializeUser((user, next) => {
    let id = user._id;
    user_cache[id] = user;
    global.info['login_session']= user;
    global.info.empty=false;
    
    next(null, id);
  });

  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user_cache[id]);
         });
  });
};
