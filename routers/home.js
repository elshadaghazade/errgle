const express = require("express"); 
const router = express.Router(); 
const { forwardAuthenticated } = require("../auth/auth");


router.get("/" , forwardAuthenticated, function(req , res) {
    res.render("home"); 

}); 



module.exports = router ; 