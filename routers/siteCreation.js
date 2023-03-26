const express = require("express");
const router = express.Router();
const { Sites } = require("../db_Config/models").default;
const { ensureAuthenticated } = require("../auth/auth");
const uuid = require("uuid");
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", ensureAuthenticated, function (req, res) {
  res.render("addSite");
});

router.post("/", ensureAuthenticated, async function (req, res) {
  const { SiteUrl } = req.body;

  var appToken = uuid.v4();

  var link;
  try {
    axios.get(SiteUrl).then(async (response) => {
      var $ = cheerio.load(response.data);
      if ($('link[rel="icon"]')[0] !== undefined) {
        link = $('link[rel="icon"]')[0].attribs.href;
        const result = await Sites.create({
          site_icon: link,
          site_name: SiteUrl.split("/")[2],
          unique: appToken,
          site_url: SiteUrl,
          user_id: req.user.id,
        });

        if (result) {
          return res.redirect(`/keygen/${result.unique}`);
        } else {
          req.flash("error_msg", "something went wrong");
          return res.redirect(`/main`);
        }
      } else {
        const result = await Sites.create({
          site_name: SiteUrl.split("/")[2],
          unique: appToken,
          site_url: SiteUrl,
          user_id: req.user.id,
        });

        if (result) {
          return res.redirect(`/keygen/${result.unique}`);
        } else {
          req.flash("error_msg", "something went wrong");
          return res.redirect(`/main`);
        }
      }
    });
  } catch (error) {
    const result = await Sites.create({
      site_name: SiteUrl.split("/")[2],
      unique: appToken,
      site_url: SiteUrl,
      user_id: req.user.id,
    });

    if (result) {
      return res.redirect(`/keygen/${result.unique}`);
    } else {
      req.flash("error_msg", "something went wrong");
      return res.redirect(`/main`);
    }
  }
});

module.exports = router;
