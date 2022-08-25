const express = require("express")
const User = require("../models/user")
const router = express.Router()
const security = require("../middleware/security")
const { createUserJwt } = require("../utils/tokens")

router.post("/", async (req, res) => {
    try {
      const userid = req.body.username;
      const newUser = User.fetchUsertype(userid)
      res.json(newUser.rows[0]);
      return;
    } catch (error) {
      res.status(500).send(error.message);
    }
  });



module.exports = router