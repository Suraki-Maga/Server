const express = require("express")
const router = express.Router()
const Owner = require("../models/owner")
const security = require("../middleware/security")

router.get("/getownerdetails", async (req, res, next) => {

    try {
      // console.log("Dilshi")
      // const username=res.locals.user.data
      const username = "roshan"
      const owner=Owner.getOwner(username)
      owner.then(function(result) {
        console.log(result)
        return res.status(200).json({ result })
      })
  
    } catch (err) {
      next(err)
    }
  })

module.exports = router