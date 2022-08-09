const express = require("express")
const Driver = require("../models/driver")
// const User =require("../models/user")
const router = express.Router()
const { createUserJwt } = require("../utils/tokens")
const security = require("../middleware/security")
const { fetchUserByUserName } = require("../models/driver")

router.post("/verify", async (req, res, next) => {
  try {
    const driverId = await Driver.verify(req.body)
    return res.status(200).json({ driverId })

  } catch (err) {
    next(err)
  }
})

router.post("/sendOtp",async(req,res,next)=>{
  try{
    const respond = await Driver.sendOtp(req.body)
    if(respond!="taken"){
      req.session.userId=req.body.id
      req.session.userName=req.body.userName
      req.session.otp=respond
      console.log(req.session.userId)
      console.log(req.session.userName)
      console.log(req.session.otp)
    }
    
    return res.status(200).json({respond})
  }catch (err) {
    next(err)
  }
})

router.get("/resendOtp",async(req,res,next)=>{
  try{
    const respond = await Driver.resendOtp(req.session.userId)
    req.session.otp=respond
    console.log(req.session.userId)
    console.log(req.session.userName)
    console.log(req.session.otp)
    
    return res.status(200).json({respond})
  }catch (err) {
    next(err)
  }
})
router.post("/submitCredentials",async(req,res,next)=>{
  try{
    if(req.session.otp==req.body.otp){
      const respond = await Driver.submitCredentials(req.body)
      console.log(respond)
    }else{
      const respond="false"
    }
    return res.status(200).json({respond})
  }catch(err){
    next(err)
  }
})

// s
// router.get("/me", security.requireAuthorizedUser, async (req, res, next) => {
//   try {
//     // const {username}=res.locals.user
//     // const driver=await Driver.fetchUserByUserName(username)
//     // const publicUser=Driver.makeDriver(driver)
//     // return res.status(200).json({ publicUser })
//   } catch (err) {
//     next(err)
//   }
// })

module.exports = router