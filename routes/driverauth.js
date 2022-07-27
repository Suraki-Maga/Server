const express = require("express")
const Driver = require("../models/driver")
const router = express.Router()

router.post("/verify", async (req, res, next) => {
    try {
      const driver = await Driver.verify(req.body)
      return res.status(200).json({ driver })
    } catch (err) {
      next(err)
    }
  }) 

  module.exports = router