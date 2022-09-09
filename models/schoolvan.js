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
  static async getCurrentAvailability(username) {
    let query = `select id from driver_auth where username=$1`;
    let result = await db.query(query, [username]);
    query = `select avail from driver where id=$1`;
    result = await db.query(query, [result.rows[0].id]);
    console.log(result.rows[0]);
    return result.rows[0];
  }
  static async setAvailability(username, credentials) {
    const requiredFields = ["status"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    let query = `select id from driver_auth where username=$1`;
    let result = await db.query(query, [username]);

    if (credentials.status == "available") {
      query = `update driver set avail=$1 where id=$2`;
      result = await db.query(query, [1, result.rows[0].id]);
    } else {
      db.query("BEGIN")
        .then((res) => {
          db.query(`update driver set avail=$1 where id=$2`, [
            0,
            result.rows[0].id,
          ]);
        })
        .then((res) => {
          db.query(`update schoolvan set driverid = null where driverid=$1`, [
            result.rows[0].id,
          ]);
        })
        .then((res) => {
          db.query(`COMMIT`);
        })
        .then((res) => {
          console.log("Transaction completed");
        })
        .catch((err) => {
          console.error("error while querying:", err);
          return client.query("rollback");
        })
        .catch((err) => {
          console.error("error while rolling back transaction:", err);
        });
    }
  }
}
module.exports = SchoolVan;
