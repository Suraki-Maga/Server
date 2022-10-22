const express = require("express")
const User = require("../models/user")
const router = express.Router()
const security = require("../middleware/security")
const { createUserJwt } = require("../utils/tokens")

router.get("/school", security.requireAuthorizedUser, async (req, res) => {
  try {
    const schools=User.getSchools();
    schools.then(function(result) {
      // console.log(result)
      return res.status(200).json( {result} )
    })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/schoolvanadvertisement", security.requireAuthorizedUser, async (req, res) => {
  try {
    const schools=User.getSchoolAdvertisement();
    schools.then(function(result) {
      // console.log(result)
      return res.status(200).json( {result} )
    })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/destinationschools", security.requireAuthorizedUser, async (req, res) => {
  try {
    const destinationschools=User.getDestinationSchools(req.body);
    destinationschools.then(function(result) {
      return res.status(200).json( {result} )
    })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});



module.exports = router