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

  router.post("/addchild",security.requireAuthorizedUser, async(req, res, next)=>{
    try{
      const username = res.locals.user.data;
      const respond = Parent.addChild(username,req.body)
      respond.then(function(result){
        return res.status(200).json({result})
      })
    } catch(err){
      next(err)
    }
  });

  router.post("/childvandetails", security.requireAuthorizedUser, async (req, res) => {
    try {
      const childvan=Parent.getChildVehicle(req.body);
      childvan.then(function(result) {
        console.log(result)
        return res.status(200).json( {result} )
      })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

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
  
  module.exports = router