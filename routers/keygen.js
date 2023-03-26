const express = require("express");
const router = express.Router();
const { Sites } = require("../db_Config/models").default;
const { ensureAuthenticated } = require("../auth/auth");

router.get("/:token", ensureAuthenticated, function (req, res) {
  Sites.findOne({
    unique: req.params.token,
  }).then((site) => {
    var code = `
  <!-- The core Errgle JS SDK is always required and must be listed
   first in the head of your HTML-->
  <script src="https://errgle.elshadaghazade.com/cdn/v1.0/monitoring.js"></script>
  <script>
      // Your web app's Errgle configuration
      var monitoring_config = { 
        appID: "${site.id}",
        appToken: "${site.unique}"
      }
      
      // Initialize Errgle
      monitoringStart(monitoring_config)
  </script>
  `;
    return res.render("uniquekey", { code, user: req.user.toJSON(), site: site.id });
  });
});

module.exports = router;
