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
    return res.status(200).json({respond})
  }catch (err) {
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