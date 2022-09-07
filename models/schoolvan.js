const { BCRYPT_WORK_FACTOR } = require("../config");
const bcrypt = require("bcrypt");
const { createOtp } = require("../utils/gateway");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { query } = require("express");

class SchoolVan {
  static async loadDetails(username) {
    let query = `select id from driver_auth where username=$1`;
    let result = await db.query(query, [username]);
    console.log(result.rows[0]);
    query = `select schoolvan.vehicleno,schoolvan.seats,owner.name from schoolvan inner join
    owner on owner.id=schoolvan.ownerid where schoolvan.driverid=$1`;
    result = await db.query(query, [result.rows[0].id]);
    if (result.rows[0] != undefined) {
      return result.rows[0];
    } else {
      return "unavailable";
    }

    // return result.rows[0];
  }
  static async loadVehicleImages(username) {
    let query = `select id from driver_auth where username=$1`;
    let result = await db.query(query, [username]);
    query = `select schoolvanimages.image from schoolvanimages inner join schoolvan on schoolvan.id=schoolvanimages.sclvanid
    where schoolvan.driverid=$1`;
    result = await db.query(query, [result.rows[0].id]);

    if (result.rows[0] != undefined) {
      return result.rows;
    } else {
      return "unavailable";
    }

    return result.rows;
  }
}
module.exports = SchoolVan;
