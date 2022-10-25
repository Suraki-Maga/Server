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


  router.get("/pendingrequest", security.requireAuthorizedUser, async (req, res) => {
    try {
      const pendingrequest=Admin.getPendingRequest();
      pendingrequest.then(function(result) {
        // console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  router.get("/cancelledrequest", security.requireAuthorizedUser, async (req, res) => {
    try {
      const pendingrequest=Admin.getCancelledRequest();
      pendingrequest.then(function(result) {
        // console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  router.post("/acceptrequest", security.requireAuthorizedUser, async (req, res) => {
    try {
      const acceptrequest=Admin.acceptRequest(req.body);
      acceptrequest.then(function(result) {
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  router.get("/ownersdetails", security.requireAuthorizedUser, async (req, res) => {
    try {
      const owners=Admin.getOwnersDetails();
      owners.then(function(result) {
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

    router.post("/adminownersvandetails", security.requireAuthorizedUser, async (req, res) => {
    try {
      const owners=Admin.getSchoolVanDetails(req.body);
      owners.then(function(result) {
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  
module.exports = router