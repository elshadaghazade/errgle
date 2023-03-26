const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../auth/auth");
const { Sites , User } = require("../db_Config/models").default;
const axios = require("axios");
const cheerio = require("cheerio");


router.get("/", ensureAuthenticated,  async function(req, res){
   var sites =  await Sites.find({
       user_id: req.user.id,
   });
   var users = await User.findOne({
        _id : req.user.id 
   });

    res.render("main" , {
        websites: sites.map((site) => site.toJSON()),
        users: users.toJSON() ,
    });
   
}); 

router.post("/remove" ,ensureAuthenticated , async function(req,res){
    var removedItem = await Sites.deleteOne({
        _id: req.body.remove
    });

    res.redirect("/main");
}); 



module.exports = router ; 

