const express = require("express");
const router = express.Router();
const path = require("path");
router.get("/v1.0/monitoring.js", function (req, res, next) {
  res.sendFile(path.join(__dirname, "cdn.js"), function (err) {
    if (err) {
      next(err);
    } else {
      console.log("cdn works");
    }
  });
});

module.exports = router;
