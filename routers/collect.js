const express = require("express");
const router = express.Router();
const { siteRegistered, ensureAuthenticated } = require("../auth/auth");
const mailer = require("../tools/nodemailer");
const { Sites, Errors, Performance } = require("../db_Config/models").default;

router.post("/:appId", siteRegistered, async function (req, res) {
  try {
    const {
      origin,
      cookieEnabled,
      deviceMemory,
      language,
      languages,
      online,
      userAgent,
      vendor,
      platform,
      plugins,
      appName,
      appVersion,
      appCodeName,
    } = req.body.navigator;

    const { error } = req.body;

    // var finded = await Errors.findOne({
    //   error: error,
    // });
    // if (finded) {
    //   await Errors.updateOne({ _id: finded._id }, { $inc: { count: 1 } });
    // }
    // if (!finded) {
    //   var result = await Errors.create({
    //     error,
    //     cookieEnabled,
    //     deviceMemory,
    //     language,
    //     languages,
    //     online,
    //     userAgent,
    //     vendor,
    //     platform,
    //     plugins,
    //     appName,
    //     appVersion,
    //     appCodeName,
    //     is_fixed,
    //     sites: req.params.appId,
    //   });
    // }
    var appOS;
    var pName = appVersion || platform;
    if(pName?.includes("Windows")){
      appOS = "Windows"
    } else if(pName?.includes("Mac")){
      appOS = "MacOS"
    } else {
      appOS = appVersion;
    }
    var result = await Errors.create({
      appOS,
      origin,
      error,
      cookieEnabled,
      deviceMemory,
      language,
      languages,
      online,
      userAgent,
      vendor,
      platform,
      plugins,
      appName,
      appVersion,
      appCodeName,
      sites: req.params.appId,
    });

    let site = await Sites.findOne({
      _id: req.params.appId,
    }).populate("user_id");


    //  mailer(
    //    "Error Happened",
    //    site.user_id.email,
    //    "gurbanli97@mail.ru",
    //    site.user_id.firstname,
    //    "https://errgle.elshadaghazade.com/dashboard" + req.params.appId
    // );

    res.end();
  } catch (err) {
    console.log(err);
  }
});

router.post("/p/:appId", siteRegistered, async function (req, res) {

  try {
    const {
      timing,
      navigation,
    } = req.body.performanceJSON;


    const {
      origin,
      navigationStart,
      loadEnd
    } = req.body.navigator;

    const {
      totalLoadTime,
      files,
      totalRequest
    } = req.body.fileSize
    
    var pResult = await Performance.create({
      timing,
      navigation,
      origin: origin,
      navigationStart: navigationStart,
      loadEnd: loadEnd,
      fileSize: {
        totalLoadTime: totalLoadTime,
        files: files,
        totalRequest: totalRequest
      },
      sites: req.params.appId,
    });
    
    res.end();
  } catch (err) {
    console.log(err);
  }
});



router.post("/update/u", ensureAuthenticated, async (req, res) => {

  await Errors.updateOne({
    _id: req.body.id
  }, 
    [{ $set: { is_fixed: { $eq: [false, "$is_fixed"]}}}]
  )

  return res.send(req.body.id)

});

router.post("/delete/d", ensureAuthenticated, async (req, res) => {

  await Errors.updateOne({
    _id: req.body.id
  }, 
    [{ $set: { is_visible: { $eq: [false, "$is_visible"]}}}]
  )
  
  return res.send(req.body.id)

});

module.exports = router;
