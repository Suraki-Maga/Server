const express = require("express")
const router = express.Router()
const Parent = require("../models/parent")
const security = require("../middleware/security")

router.get("/children", security.requireAuthorizedUser, async (req, res) => {
    try {
      const username=res.locals.user.data
      console.log(username)
      const children=Parent.getChildren(username);
      children.then(function(result) {
        console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  
  module.exports = router