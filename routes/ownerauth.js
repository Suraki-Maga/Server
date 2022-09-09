const express = require("express")
const router = express.Router()
const Owner = require("../models/owner")
const security = require("../middleware/security")

router.get("/getownerdetails",security.requireAuthorizedUser, async (req, res, next) => {

    try {
      // console.log("Dilshi")
      const username = res.locals.user.data;
      const owner=Owner.getOwner(username)
      owner.then(function(result) {
        console.log(result)
        return res.status(200).json({ result })
      })
  
    } catch (err) {
      next(err)
    }
  })
  
  router.post("/registerDriver",security.requireAuthorizedUser, async(req, res, next)=>{
    try{
      console.log(req.body)
      const respond = Owner.registerDriver(req.body)
      respond.then(function(result){
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/EditOwnerProfile",security.requireAuthorizedUser,async(req, res, next)=>{
    try{
      console.log(req.body)
      const respond = Owner.EditOwnerProfile(req.body)
      respond.then(function(result){
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

  router.get("/getdriverdetails",security.requireAuthorizedUser,async(req, res, next)=>{
    try{
      const respond = Owner.getdriverdetails(req.body)
      respond.then(function(result) {
        console.log(result)
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/EditOwnerDriverProfile",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.EditDriverProfile(req.body)
      respond.then(function(result){
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/loadDriverDetails",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body.data)
      const respond = Owner.loadDriverDetails(req.body)
      respond.then(function(result){
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/removeDriver",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.removeDriver(req.body)
      respond.then(function(result){
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/registersclvan",security.requireAuthorizedUser, async(req, res, next)=>{
    try{
      console.log(req.body)
      const username = res.locals.user.data;
      console.log(username)
      const ownerid = await Owner.getOwnerid(username)
      console.log(ownerid.id)
      const respond = Owner.registersclvan(req.body,ownerid.id)
      respond.then(function(result){
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/isuniquevehicleno",security.requireAuthorizedUser, async(req, res, next)=>{
    try{
      console.log(req.body)
      const respond = Owner.isuniquevehicleno(req.body)
      respond.then(function(result){
        console.log(result)
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

  router.get("/getschoolvandetails",security.requireAuthorizedUser,async(req, res, next)=>{
    try{
      const username = res.locals.user.data;
      console.log(username)
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getschoolvandetails(ownerid.id)
      respond.then(function(result) {
        console.log(result)
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/addSchoolstoSchoolvan",security.requireAuthorizedUser,async(req, res, next)=>{
    try{
      const respond = Owner.addSchoolstoSchoolvan(req.body)
      respond.then(function(result) {
        console.log(result)
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

  router.get("/getschoolsSchoolvan",security.requireAuthorizedUser,async(req, res, next)=>{
    try{
      const respond = Owner.getschoolsSchoolvan()
      respond.then(function(result) {
        console.log(result)
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

module.exports = router