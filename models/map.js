const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { query } = require("express");

class Map{
    static async loadStudentLocations(userName){
        //select the van id from the userName

        //DON'T LOAD ABSENT STUDENTS
        const vanId=1
        const query=`select * from student_location where van_id=$1`
        const result=await db.query(query,[vanId])
        console.log(result.rows)
        return result.rows;
    }

    static async loadStudentDetails(credentials){
        const requiredFields = ["studentId"]
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`)
          }
        })
        const query=`select * from student where id=$1`
        const result=await db.query(query,[credentials.studentId])
        return result.rows[0];
    }
}

module.exports=Map;