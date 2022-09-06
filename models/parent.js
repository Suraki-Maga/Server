const express = require("express")
const User = require("../models/user")
const router = express.Router()
const db = require("../db")
const security = require("../middleware/security")
const { createUserJwt } = require("../utils/tokens")

class Parent {
    //Function to get children names
    static async getChildren(userName) {
    
        const query = `Select student.id,student.fullname,student.school,AGE(CURRENT_DATE, student.birthday) from student inner join users on student.parentid=users.id where users.username=$1`
        const children=await db.query(query,[userName])
        
        if(children.rows){
        return children.rows
        }
        else {
            return "false";
        }
    }
}

module.exports = Parent