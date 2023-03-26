const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { forwardAuthenticated } = require("../auth/auth");

const { User } = require("../db_Config/models").default;

router.get("/", forwardAuthenticated, async function (req, res) {
  res.render("register");
});
router.post("/", forwardAuthenticated, (req, res) => {
  const { firstname, lastname, password, email, password2 } = req.body;
  let errors = [];
  if (!firstname || !lastname || !password || !email || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (password2 !== password) {
    errors.push({ msg: "passwords are not same" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstname,
      lastname,
      password,
      password2,
      email,
    });
  } else {
    User.findOne({
      email: email,
    }).then((user) => {
      if (user) {
        errors.push({ msg: "Username already exists" });
        res.render("register", {
          errors,
          firstname,
          lastname,
          password,
          password2,
          email,
        });
      } else {
        User.create({
          errors,
          firstname,
          lastname,
          encryptedPassword: bcrypt.hashSync(password, 10),
          email,
        })
          .then((user) => {
            req.flash("success_msg", "You are now registered and can log in");
            res.redirect("/login");
          })
          .catch((err) => console.log(err));
      }
    });
  }
});
module.exports = router;
