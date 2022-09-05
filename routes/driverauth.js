const express = require("express");
const Driver = require("../models/driver");
const Map = require("../models/map");
const SchoolVan = require("../models/schoolvan");
// const User =require("../models/user")
const router = express.Router();
const { createUserJwt } = require("../utils/tokens");
const security = require("../middleware/security");

router.post("/verify", async (req, res, next) => {
  try {
    const driverId = await Driver.verify(req.body);
    return res.status(200).json({ driverId });
  } catch (err) {
    next(err);
  }
});

router.post("/sendOtp", async (req, res, next) => {
  try {
    const respond = await Driver.sendOtp(req.body);
    if (respond != "taken") {
      req.session.userId = req.body.id;
      req.session.userName = req.body.userName;
      req.session.otp = respond;
      console.log(req.session.userId);
      console.log(req.session.userName);
      console.log(req.session.otp);
    }

    return res.status(200).json({ respond });
  } catch (err) {
    next(err);
  }
});

router.get("/resendOtp", async (req, res, next) => {
  try {
    const respond = await Driver.resendOtp(req.session.userId);
    req.session.otp = respond;
    console.log(req.session.userId);
    console.log(req.session.userName);
    console.log(req.session.otp);

    return res.status(200).json({ respond });
  } catch (err) {
    next(err);
  }
});
router.post("/submitCredentials", async (req, res, next) => {
  try {
    let respond;
    if (req.session.otp == req.body.otp) {
      respond = await Driver.submitCredentials(req.body);
      //close the session
      req.session.destroy();
      //create a jwt token
      const token = createUserJwt(respond);
      console.log(respond);
      return res.status(200).json({ respond, token });
      //plz handle failed condition. if else ekak athule danna.
    } else {
      respond = "false";
      return res.status(200).json({ respond });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // console.log(req.body)
    console.log("arrived");
    const respond = await Driver.login(req.body);
    console.log(respond);
    if (respond != "invalid") {
      const token = createUserJwt(respond);
      return res.status(200).json({ respond, token });
    } else {
      return res.status(200).json({ respond });
    }
  } catch (err) {
    next(err);
  }
});

router.get(
  "/details",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      const driver = Driver.getDriver(username);
      driver.then(function (result) {
        console.log(result);
        return res.status(200).json({ result });
      });
    } catch (err) {
      next(err);
    }
  }
);
router.get(
  "/studentLocations",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      console.log(username);
      const respond = Map.loadStudentLocations(username);

      respond.then(function (result) {
        return res.status(200).json({ result });
      });
    } catch (err) {
      next(err);
    }
  }
);
router.post(
  "/studentDetails",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      console.log(username);
      console.log(req.body);
      const respond = Map.loadStudentDetails(req.body);

      respond.then(function (result) {
        return res.status(200).json({ result });
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/changeProfilePicture",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      console.log(username);
      console.log(req.body);
      const respond = Driver.changeProfilePicture(username, req.body);

      respond.then(function (result) {
        return res.status(200).json({ result });
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/checkCurrentPassword",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      console.log(username);
      console.log(req.body);
      const respond = Driver.checkCurrentPassword(username, req.body);
      respond.then(function (result) {
        return res.status(200).json({ result });
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/setNewPassword",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      console.log(username);
      console.log(req.body);
      const respond = Driver.setNewPassword(username, req.body);
      respond.then(function (result) {
        console.log(result);
        return res.status(200).json({ result });
      });
      // respond
      //   .then((data) => data)
      //   .then((value) => {
      //     console.log(value);
      //     return res.status(200).json({ value });
      //   });
    } catch (err) {
      next(err);
    }
  }
);
router.post(
  "/getOtpForNewNo",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      // console.log(username);
      // console.log(req.body);
      const respond = Driver.getOtp(req.body);
      respond.then(function (result) {
        req.session.userName = username;
        req.session.otp = result;
        console.log(req.session.userName);
        console.log(req.session.otp);
        return res.status(200).json({ result: "OTP sent" });
      });
    } catch (err) {
      next(err);
    }
  }
);
router.post(
  "/submitContact",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      console.log(username);
      console.log(req.body);
      console.log(req.session);
      if (req.session.userName == username) {
        if (req.session.otp == req.body.otp) {
          const respond = Driver.changeContact(username, req.body);
          req.session.destroy();

          respond.then(function (result) {
            console.log(result);
            return res.status(200).json({ result });
          });
        } else {
          return res.status(200).json({ result: "failed" });
        }
      }
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/loadVehicleInformation",
  security.requireAuthorizedUser,
  async (req, res, next) => {
    try {
      const username = res.locals.user.data;
      const respond = SchoolVan.loadDetails(username);
      respond.then(function (result) {
        console.log(result);
        return res.status(200).json({ result });
      });
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;
