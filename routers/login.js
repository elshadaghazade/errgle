const express = require("express");
const router = express.Router();
const passport = require("passport");
const { forwardAuthenticated } = require("../auth/auth");

router.get("/", forwardAuthenticated, function (req, res) {
  res.render("login");
});

router.post("/", forwardAuthenticated, (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});


router.get("/forgotPassword" , function( req , res ){
  res.render("forgotPassword"); 

}) ; 


module.exports = router;
