const express = require("express")
const router = express.Router()
const Parent = require("../models/parent")
const security = require("../middleware/security")

//Route to get the children and the details
  router.get("/children", security.requireAuthorizedUser, async (req, res) => {
    try {
      const username=res.locals.user.data
      console.log(username)
      const children=Parent.getChildren(username);
      children.then(function(result) {
        // console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  //Route to add a child
  router.post("/addChild",security.requireAuthorizedUser, async(req, res, next)=>{
    try{
      console.log("addChild")
      const username = res.locals.user.data;
      const respond = Parent.addChild(username,req.body)
      respond.then(function(result){
        console.log("add child")
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  });

  //Route to get details of the van of a particular child
  router.post("/childvandetails", security.requireAuthorizedUser, async (req, res) => {
    try {
      const childvan=Parent.getChildVehicle(req.body);
      childvan.then(function(result) {
        // console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  //Route to get the names of the children who can make a request to a particular van
  router.post("/requestschoolchildren",security.requireAuthorizedUser, async(req, res, next)=>{
    try{
      const username = res.locals.user.data;
      const respond = Parent.getChildrenRequest(username,req.body)
      respond.then(function(result){
        console.log(result)
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  });

  //Route to send a request to a particular van
  router.post("/sendrequest", security.requireAuthorizedUser, async (req, res) => {
    try {
      const request=Parent.sendRequest(req.body);
      request.then(function(result) {
        console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  //Route to leave from a van
  router.post("/leavevan", security.requireAuthorizedUser, async (req, res) => {
    try {
      const request=Parent.leaveVan(req.body);
      request.then(function(result) {
        console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });


   //Route to mark absent
   router.post("/markabsent", security.requireAuthorizedUser, async (req, res) => {
    try {
      const request=Parent.markAbsent(req.body);
      request.then(function(result) {
        console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  
  module.exports = router