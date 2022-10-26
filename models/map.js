const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { query } = require("express");

class Map {
  static async loadStudentLocations(username) {
    //select the van id from the userName
    //let query = `select schoolvan.id from schoolvan inner join driver_auth on driver_auth.id=schoolvan.driverid where driver_auth.username=$1`;
    let query = `select id from driver_auth where username=$1`;
    let result = await db.query(query, [username]);
    console.log(result.rows);
    query = "select id from schoolvan where driverid=$1";
    result = await db.query(query, [result.rows[0].id]);
    //DON'T LOAD ABSENT STUDENTS
    if (result.rows[0] != undefined) {
      let vanId = result.rows[0].id;
      query = `select * from student_location inner join student on student.id=student_location.id where student.vanid=$1`;
      result = await db.query(query, [vanId]);
      console.log(result.rows);
      return result.rows;
    } else {
      return "failed";
    }
  }

  static async loadStudentDetails(credentials) {
    const requiredFields = ["studentId"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select student.id,student.fullname,student.image,school.name from student inner join school on school.id=student.school where student.id=$1`;
    const result = await db.query(query, [credentials.studentId]);
    return result.rows[0];
  }
  static async loadSchoolLocations(username) {
    let query = `select id from driver_auth where username=$1`;
    let result = await db.query(query, [username]);
    console.log(result.rows);
    query = "select id from schoolvan where driverid=$1";
    result = await db.query(query, [result.rows[0].id]);
    if (result.rows[0] != undefined) {
      let vanId = result.rows[0].id;
      query = `select school.id,school.name,school.latitude,school.longtitude from ((school inner join schoolvanschools on schoolvanschools.sclid=school.id )
      inner join schoolvan on schoolvan.id=schoolvanschools.sclvanid) where sclvanid=$1`;
      result = await db.query(query, [vanId]);
      console.log(result.rows);
      return result.rows;
    } else {
      return "failed";
    }
  }
}

module.exports = Map;
