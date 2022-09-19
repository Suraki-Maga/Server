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
        console.log("owner data fetched")
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
        console.log("new deriver registered")
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
        console.log("owner Profile edited")
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
        console.log("driver data fetched")
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
        console.log("driver profile edited")
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
        console.log("driver data fetched")
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
        console.log("driver removed")
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
        console.log("new school van registered")
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
        console.log("checked whether vehicle no unique or not")
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
        console.log("school van details fetched")
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
        console.log("add schools to school van")
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
        console.log("school list of school van fetched")
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/updatesclvanDetails",security.requireAuthorizedUser,async(req, res, next)=>{
    try{
      const respond = Owner.updatesclvanDetails(req.body)
      respond.then(function(result) {
        console.log("school van details updated")
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/removeSchoolstoSchoolvan",security.requireAuthorizedUser,async(req, res, next)=>{
    try{
      const respond = Owner.removeSchoolstoSchoolvan(req.body)
      respond.then(function(result) {
        console.log("school removed from school van")
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/assignnewdriver",security.requireAuthorizedUser,async(req, res, next)=>{
    try{
      const respond = Owner.assignnewdriver(req.body)
      respond.then(function(result) {
        console.log("new driver assigned")
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/removeVehicle",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.removeVehicle(req.body)
      respond.then(function(result){
        console.log("school van removed")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

  router.get("/getOwnersAdDetails",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const username = res.locals.user.data;
      console.log(username)
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getOwnersAdDetails(ownerid)
      respond.then(function(result) {
        console.log("owner's ad details fetched")
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })
  router.get("/getAllAdDetails",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const respond = Owner.getAllAdDetails()
      respond.then(function(result) {
        console.log("all ad details fetched")
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })

  router.post("/getAdDetailsImages",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.getAdDetailsImages(req.body)
      respond.then(function(result){
        console.log("ad images of school van fetched")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/getAdDetailsSchools",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.getAdDetailsSchools(req.body)
      respond.then(function(result){
        console.log("schools of school van fetched")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/InsertAdImage",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.InsertAdImage(req.body)
      respond.then(function(result){
        console.log("ad image inserted")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/InsertAdDetails",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.InsertAdDetails(req.body)
      respond.then(function(result){
        console.log("ad details inserted")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.get("/getCount",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const respond = Owner.getCount()
      respond.then(function(result) {
        console.log("student and seats counts fetched")
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/removeAd",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.removeAd(req.body)
      respond.then(function(result){
        console.log("ad removed")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

module.exports = router