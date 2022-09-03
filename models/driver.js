const { BCRYPT_WORK_FACTOR } = require("../config");
const bcrypt = require("bcrypt");
const { createOtp } = require("../utils/gateway");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { query } = require("express");

class Driver {
  static makeDriver(driver) {
    return {
      fullname: driver.fullname,
      licenceno: driver.licenceno,
      contact: driver.contact,
      nic: driver.nic,
    };
  }

  static async verify(credentials) {
    const requiredFields = ["nic", "otp"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `Select driver.id,driver.fullname from driver inner join driver_verify on driver.id=
        driver_verify.id where driver.nic=$1 and driver_verify.otp=$2`;

    const result = await db.query(query, [credentials.nic, credentials.otp]);
    //add rest of the code
    const driver = result.rows[0];

    if (!driver) {
      return "no driver";
    } else {
      return driver;
    }
  }

  static async sendOtp(credentials) {
    const requiredFields = ["id", "userName"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query1 = "Select id from driver_auth where username=$1";
    const result1 = await db.query(query1, [credentials.userName]);
    console.log(result1.rows);

    if (result1.rows[0] == undefined) {
      console.log(result1.rows[0]);
      const query2 = `Select contact from driver where id=$1`;
      const result2 = await db.query(query2, [credentials.id]);

      const contactNo = result2.rows[0];

      // console.log(contactNo.contact)
      let otp = createOtp(contactNo.contact);
      // console.log(otp)
      return otp;
    } else {
      return "taken";
    }
  }
  static async resendOtp(id) {
    const query = `Select contact from driver where id=$1`;
    const result = await db.query(query, [id]);

    const contactNo = result.rows[0];

    console.log(contactNo.contact);
    let otp = createOtp(contactNo.contact);
    console.log(otp);
    return otp;
  }

  static async submitCredentials(credentials) {
    const requiredFields = ["id", "userName", "password"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    //get the hash value of the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(credentials.password, salt);
    // console.log(password)
    const query = `insert into driver_auth (id,username,passwordhash) values ($1,$2,$3) RETURNING username`;
    // const query = `Begin transaction;
    //                 insert into driver_auth (id,username,passwordhash) values ($1,$2,$3) RETURNING username;
    //                 delete from driver_verify where id=2;
    //                 end transaction;`
    const result = await db.query(query, [
      credentials.id,
      credentials.userName,
      password,
    ]);

    if (result.rows[0] != undefined) {
      return credentials.userName;
    } else {
      return "failed";
    }
  }
  static async login(credentials) {
    const requiredFields = ["userName", "password"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    // console.log(credentials.userName)
    const query = `select passwordhash from driver_auth where username=$1`;
    const result = await db.query(query, [credentials.userName]);
    if (result.rows[0] != undefined) {
      const password = result.rows[0];
      console.log(password);
      const validPassword = await bcrypt.compare(
        credentials.password,
        password.passwordhash
      );
      if (validPassword) {
        // console.log("valid password")
        return credentials.userName;
      } else {
        // console.log("invalid password")
        return "invalid";
      }
    } else {
      // console.log("invalid username")
      return "invalid";
    }
  }

  static async getDriver(userName) {
    console.log(userName);
    const query = `Select driver.fullname,driver.licenceno,driver.contact,driver.nic,driver.image from driver inner join driver_auth on driver.id=driver_auth.id where driver_auth.username=$1`;
    const result = await db.query(query, [userName]);
    // console.log(result.rows[0])
    return result.rows[0];
  }
  static async changeProfilePicture(username, credentials) {
    const requiredFields = ["profilePic"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query1 = `Select id from driver_auth where username=$1`;
    const result1 = await db.query(query1, [username]);
    const query2 = "update driver set image=$1 where id=$2";
    const result2 = await db.query(query2, [
      credentials.profilePic,
      result1.rows[0].id,
    ]);
    return "done";
  }
  static async checkCurrentPassword(username, credentials) {
    const requiredFields = ["currentPassword"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select passwordhash from driver_auth where username=$1`;
    const result = await db.query(query, [username]);
    if (result.rows[0] != undefined) {
      const password = result.rows[0];
      const validPassword = await bcrypt.compare(
        credentials.currentPassword,
        password.passwordhash
      );
      if (validPassword) {
        // console.log("valid password")
        return "valid";
      } else {
        // console.log("invalid password")
        return "invalid";
      }
    } else {
      // console.log("invalid username")
      return "invalid";
    }
  }
  static async setNewPassword(credentials) {
    const requiredFields = ["newPassword"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(credentials.newPassword, salt);
    const query = `update driver_auth set passwordhash=$1 where username=$2`;

    const result = await db.query(query, [password, username]);
    return "done";
  }
  static async getOtp(credentials) {
    const requiredFields = ["mobileNo"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    let otp = createOtp(credentials.mobileNo);
    return otp;
  }
  static async changeContact(username, credentials) {
    const requiredFields = ["mobileNo"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    let query = `select id from driver_auth where username=$1`;
    const result = await db.query(query, [username]);
    query = `update driver set contact=$1 where id=$2`;
    await db.query(query, [credentials.mobileNo, result.rows[0].id]);
    return "done";
  }
}

module.exports = Driver;
