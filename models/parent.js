const express = require("express")
const User = require("../models/user")
const router = express.Router()
const db = require("../db")
const security = require("../middleware/security")
const { createUserJwt } = require("../utils/tokens")

class Parent {

    //Function to retrieve id
    static async fetchUserid(username) {
       
        const query = `SELECT id FROM users WHERE username = $1`
    
        const userid = await db.query(query, [username])
    
        return userid.rows[0]
      }

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

    //Function to add a child
    static async addChild(username,credentials) {

        const userid = await Parent.fetchUserid(username);
    
        const query = `INSERT INTO student(fullname,parentid,school,image,birthday)
        VALUES ($1,$2,$3,$4,$5) RETURNING id`

        const result = await db.query(query,[credentials.fullname,userid.id,credentials.school,credentials.image,credentials.birthday])

        const query1 = `INSERT INTO studentlocation(id,latitude,longitude)
        VALUES ($1,$2,$3) RETURNING id`
        
        const result1 = await db.query(query1,[result.rows[0].id,credentials.latitude,credentials.longitude])

        if(result1)
        {
            return true
        }
        else {
            return false
        }
    }
}

module.exports = Parent