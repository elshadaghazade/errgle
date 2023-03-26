const { Sites } = require("../db_Config/models").default;

module.exports = {
  // superior : function(req, res, next){
  //   if(req.isAuthenticated() && req.user.role === "admin"){
  //     return next();
  //   }
  //   req.flash('error_msg', 'Please log in as admin to view that resource');
  //   return res.redirect('/dashboard');
  // },
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    return res.redirect("/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/main");
  },
  siteRegistered: async function (req, res, next) {
    let site = await Sites.findOne({
      _id: req.params.appId,
    });

    if (site) {
      if (site.site_url == req.body.navigator.origin) {
        return next();
      }
    }
    res.send("Please use your own credentials");
  },
};
