const express = require("express")
const User = require("../models/user")
const router = express.Router()
const security = require("../middleware/security")
const { createUserJwt } = require("../utils/tokens")

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body)
    console.log(user)
    return res.status(200).json({ user,status:true })
  } catch (err) {
    next(err)
  }
})

// router.post("/register", async (req, res, next) => {
//   try {
//     console.log(req.session)
//     // const user = await User.register({ ...req.body })
//     let respond;
//     if(req.session.otp==req.body.otp){
//       // console.log(req.body.otp);
//       console.log(req.session.contact)
//       respond = await User.register(req.session)
//     // console.log(user.id)
//     // return res.status(201).json({ user })
//     // const token=createUserJwt(user)
//     return res.status(201).json({respond})
//     }
//     else {
//       respond="false"
//       return res.status(200).json({respond})
//     }
//   } catch (err) {
//     next(err)
//   }
// })

router.post("/register", async (req, res, next) => {
  try {
    
   
    respond = await User.register(req.body)
    console.log(respond)
   
    return res.status(201).json({respond})
   
  } catch (err) {
    next(err)
  }
})

router.post("/sendOtp",async(req,res,next)=>{
  try{
    const respond = await User.sendOtp(req.body)
    // console.log(respond);
    if(respond){
      req.session.username=req.body.username
      req.session.contact=req.body.contact
      req.session.password=req.body.password
      req.session.type=req.body.type
      req.session.otp=respond
      console.log(req.session)
    }
    
    return res.status(200).json({respond})
  }catch (err) {
    next(err)
  }
})

module.exports = router