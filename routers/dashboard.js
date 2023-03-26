const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../auth/auth");

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const { Errors, Sites, Performance, User } =
  require("../db_Config/models").default;

router.get("/:siteId?", ensureAuthenticated, async function (req, res) {
  var mySites = await Sites.find({
    user_id: req.user.id,
  });

  var users = await User.findOne({
    _id: req.user.id,
  });

  if (req.params.siteId) {
    var exist = await Sites.findOne({
      _id: req.params.siteId,
      user_id: req.user.id,
    });
    if (exist) {
      var data = await Errors.find({
        sites: exist._id,
        is_visible: true,
      })
        .sort({ created_at: "desc" })
        .exec();

      var avgCount = [];
      var avg = 0;
      var result;

      var pData = await Performance.find({
        sites: exist._id,
      });
      for (let site of pData) {
        avgCount.push(site.timing.loadEventEnd - site.timing.navigationStart);
      }

      for (let loadTime of avgCount) {
        avg = avg + loadTime;
      }

      result = avg / avgCount.length;
      var result = Math.round(result) / 1000;
      try {
        var maximumFileSize = await Performance.findOne({ sites: exist._id })
          .sort("-fileSize.totalLoadTime")
          .exec();

        var totalFileSize = formatBytes(maximumFileSize.fileSize.totalLoadTime);
        var totalRequests = maximumFileSize.fileSize.totalRequest;
      } catch (error) {}
      
    }

    if (data) {
      return res.render("dashboard", {
        array: data.map((error) => error.toJSON()),
        sites: mySites.map((site) => site.toJSON()),
        users: users.toJSON(),
        totalFileSize,
        totalRequests,
        loadTime: result.toFixed(2),
      });
    }
  } else {
    return res.render("dashboard", {
      message: "Please choose site first",
      sites: mySites.map((site) => site.toJSON()),
    });
  }
});

router.get("/unsolved/:siteId", ensureAuthenticated, async function (req, res) {
  var mySites = await Sites.find({
    user_id: req.user.id,
  });

  var users = await User.findOne({
    _id: req.user.id,
  });

  if (req.params.siteId) {
    var exist = await Sites.findOne({
      _id: req.params.siteId,
      user_id: req.user.id,
    });
    if (exist) {
      var data = await Errors.find({
        sites: exist._id,
        is_visible: true,
        is_fixed: false,
      });

      var avgCount = [];
      var avg = 0;
      var result;

      var pData = await Performance.find({
        sites: exist._id,
      });
      for (let site of pData) {
        avgCount.push(site.timing.loadEventEnd - site.timing.navigationStart);
      }

      for (let loadTime of avgCount) {
        avg = avg + loadTime;
      }

      result = avg / avgCount.length;
      var result = Math.round(result) / 1000;

      try {
        var maximumFileSize = await Performance.findOne({ sites: exist._id })
          .sort("-fileSize.totalLoadTime")
          .exec();

        var totalFileSize = formatBytes(maximumFileSize.fileSize.totalLoadTime);
        var totalRequests = maximumFileSize.fileSize.totalRequest;
      } catch (error) {}
    }

    if (data) {
      return res.render("dashboard", {
        array: data.map((error) => error.toJSON()),
        sites: mySites.map((site) => site.toJSON()),
        users: users.toJSON(),
        totalFileSize,
        totalRequests,
        loadTime: result.toFixed(2),
      });
    }
  } else {
    return res.render("dashboard", {
      message: "Please choose site first",
      sites: mySites.map((site) => site.toJSON()),
    });
  }
});

router.get("/solved/:siteId", ensureAuthenticated, async function (req, res) {
  var mySites = await Sites.find({
    user_id: req.user.id,
  });

  var users = await User.findOne({
    _id: req.user.id,
  });

  if (req.params.siteId) {
    var exist = await Sites.findOne({
      _id: req.params.siteId,
      user_id: req.user.id,
    });
    if (exist) {
      var data = await Errors.find({
        sites: exist._id,
        is_visible: true,
        is_fixed: true,
      });

      var avgCount = [];
      var avg = 0;
      var result;

      var pData = await Performance.find({
        sites: exist._id,
      });
      for (let site of pData) {
        avgCount.push(site.timing.loadEventEnd - site.timing.navigationStart);
      }

      for (let loadTime of avgCount) {
        avg = avg + loadTime;
      }
      if (avgCount.length > 1) {
        result = avg / avgCount.length;
      } else {
        result = avg;
      }
      var result = Math.round(result) / 1000;

      try {
        var maximumFileSize = await Performance.findOne({ sites: exist._id })
          .sort("-fileSize.totalLoadTime")
          .exec();

        var totalFileSize = formatBytes(maximumFileSize.fileSize.totalLoadTime);
        var totalRequests = maximumFileSize.fileSize.totalRequest;
      } catch (error) {}
    }

    if (data) {
      return res.render("dashboard", {
        array: data.map((error) => error.toJSON()),
        sites: mySites.map((site) => site.toJSON()),
        users: users.toJSON(),
        totalFileSize,
        totalRequests,
        loadTime: result.toFixed(2),
      });
    }
  } else {
    return res.render("dashboard", {
      message: "Please choose site first",
      sites: mySites.map((site) => site.toJSON()),
    });
  }
});

router.post("/chart", ensureAuthenticated, async function (req, res) {
  if (req.body.siteID) {
    var exist = await Sites.findOne({
      _id: req.body.siteID,
      user_id: req.user.id,
    });
    if (exist) {
      var data = await Errors.find({
        sites: exist._id,
      })
        .sort({ created_at: "asc" })
        .exec();
    }

    if (data) {
      var dates = [];
      var sameCount = 1;

      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          dates.push({
            date: data[i].created_at,
            count: 1,
          });
        } else {
          if (
            data[i].created_at.toString().split(" ")[2] ===
            dates[dates.length - 1].date.toString().split(" ")[2]
          ) {
            dates[dates.length - 1] = {
              date: data[i].created_at,
              count: ++sameCount,
            };
          } else {
            sameCount = 1;
            dates.push({
              date: data[i].created_at,
              count: 1,
            });
          }
        }
      }
      return res.json(dates);
    }
  }
  res.json({ msg: "site is not found" });
});

router.post("/chart/pie", ensureAuthenticated, async function (req, res) {
  if (req.body.siteID) {
    var exist = await Sites.findOne({
      _id: req.body.siteID,
      user_id: req.user.id,
    });

    var forChart = {
      css: 0,
      cssTotal: 0,
      cssArray: [],
      script: 0,
      scriptTotal: 0,
      scriptArray: [],
      images: 0,
      imgTotal: 0,
      imgArray: [],
      xmlrequest: 0,
      xmlTotal: 0,
      xmlArray: [],
      other: 0,
      otherTotal: 0,
      otherArray: [],
    };

    if (exist) {
      var fileWithSize = await Performance.findOne({ sites: exist._id })
        .sort("-fileSize.totalLoadTime")
        .exec();
      fileWithSize?.fileSize?.files?.forEach((element) => {
        if (
          element.initiatorType === "link" ||
          element.initiatorType === "css"
        ) {
          ++forChart.css;
          forChart.cssTotal += element.size;
          forChart.cssArray.push({ type: element.name, percent: element.size });
        } else if (element.initiatorType === "script") {
          ++forChart.script;
          forChart.scriptTotal = forChart.scriptTotal + element.size;
          forChart.scriptArray.push({
            type: element.name,
            percent: element.size,
          });
        } else if (element.initiatorType === "img") {
          ++forChart.images;
          forChart.imgTotal += element.size;
          forChart.imgArray.push({ type: element.name, percent: element.size });
        } else if (element.initiatorType === "xmlhttprequest") {
          ++forChart.xmlrequest;
          forChart.xmlTotal += element.size;
          forChart.xmlArray.push({ type: element.name, percent: element.size });
        } else if (element.initiatorType === "other") {
          ++forChart.other;
          forChart.otherTotal += element.size;
          forChart.otherArray.push({
            type: element.name,
            percent: element.size,
          });
        }
      });

      return res.json(forChart);
    }
  }
  res.json({ msg: "site is not found" });
});

module.exports = router;
