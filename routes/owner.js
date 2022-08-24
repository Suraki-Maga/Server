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
  
  router.post("/registerDriver", async(req, res, next)=>{
    try{
      console.log(req.body)
      const respond = Owner.registerDriver(req.body)
      return res.status(200).json({respond})
    } catch(err){
      next(err)
    }
  })

  router.post("/EditOwnerProfile",async(req, res, next)=>{
    try{
      console.log(req.body)
      const respond = Owner.EditOwnerProfile(req.body)
      return res.status(200).json({respond})
    } catch(err){
      next(err)
    }
  })

  router.get("/getdriverdetails",async(req, res, next)=>{
    try{
      const driver = Owner.getdriverdetails(req.body)
      driver.then(function(result) {
        console.log(result)
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/EditOwnerDriverProfile",async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.EditDriverProfile(req.body)
      return res.status(200).json({respond})
    } catch(err){
      next(err)
    }
  })

module.exports = router