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
      const username = res.locals.user.data;
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getdriverdetails(ownerid)
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
  router.get("/getRequestDetails",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const username = res.locals.user.data;
      console.log(username)
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getRequestDetails(ownerid)
      respond.then(function(result) {
        console.log("schoolvan requests fetched")
        return res.status(200).json({ result })
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/EditMonthlyCharge",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.EditMonthlyCharge(req.body)
      respond.then(function(result){
        console.log("monthly charge updated")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/AcceptRequest",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.AcceptRequest(req.body)
      respond.then(function(result){
        console.log("request accepted")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/RejectRequest",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.RejectRequest(req.body)
      respond.then(function(result){
        console.log("request rejected")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.get("/getTotalIncome",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const username = res.locals.user.data;
      console.log(username)
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getTotalIncome(ownerid)
      respond.then(function(result){
        console.log("Total income")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.get("/getCurrentIncome",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const username = res.locals.user.data;
      console.log(username)
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getCurrentIncome(ownerid)
      respond.then(function(result){
        console.log("current income")
        console.log(result)
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.get("/getYetToPayList",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const username = res.locals.user.data;
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getYetToPayList(ownerid)
      respond.then(function(result){
        console.log("yet to pay list")
        console.log(result)
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.get("/getUnpaidList",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const username = res.locals.user.data;
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getUnpaidList(ownerid)
      respond.then(function(result){
        console.log("unpaid pay list")
        console.log(result)
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/BanAStudent",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.BanAStudent(req.body)
      respond.then(function(result){
        console.log("banned")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/UnbanAStudent",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.UnbanAStudent(req.body)
      respond.then(function(result){
        console.log("unbanned")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/RemoveAStudent",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.RemoveAStudent(req.body)
      respond.then(function(result){
        console.log("removed")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.get("/getcomplaints",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const username = res.locals.user.data;
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getcomplaints(ownerid)
      respond.then(function(result){
        console.log("complaints list")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.get("/getReviews",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      const username = res.locals.user.data;
      const ownerid = await Owner.getOwnerid(username)
      const respond = Owner.getReviews(ownerid)
      respond.then(function(result){
        console.log("reviews list")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })
  router.post("/getStudentDetails",security.requireAuthorizedUser,async(req,res,next)=>{
    try{
      console.log(req.body)
      const respond = Owner.getStudentDetails(req.body)
      respond.then(function(result){
        console.log("student list")
        console.log(result)
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  })

module.exports = router