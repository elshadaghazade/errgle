const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { User } = require("../db_Config/models").default;

module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: "This email is not registered",
          });
        }
        bcrypt.compare(password, user.encryptedPassword, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Username or password is incorrect",
            });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id,
    }).then((user) => {
      done(null, user);
    });
  });
};
