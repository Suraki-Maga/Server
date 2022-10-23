const express = require("express")
const router = express.Router()
const Admin = require("../models/admin")
const security = require("../middleware/security")

router.get("/dashboardcount", security.requireAuthorizedUser, async (req, res) => {
    try {
      const dashboardcount=Admin.getDashboardCount();
      dashboardcount.then(function(result) {
        // console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  
module.exports = router