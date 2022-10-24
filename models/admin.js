const express = require("express")
const User = require("../models/user")
const router = express.Router()
const db = require("../db")
const security = require("../middleware/security")
const { createUserJwt } = require("../utils/tokens")


class Admin {

    //Function to get dashboard counts
    static async getDashboardCount() {

        const query = `SELECT (SELECT count(id) FROM schoolvan) AS schoolvan,(SELECT count(id) FROM users WHERE users.type='Parent') AS Parent
        ,(SELECT count(id) FROM users WHERE users.type='Owner') AS Owner`

        const dashboardcount = await db.query(query)
        
        return dashboardcount.rows[0]
    }


    
    //Function to get pedning count
    static async getPendingRequest() {

        const query = `SELECT schoolvan.id, schoolvan.vehicleno, schoolvan.vehicletype, schoolvan.seats,schoolvan.charge,
        schoolvan.startlocation,schoolvan.frontimage,schoolvan.backimage,
        schoolvan.licensefront,schoolvan.licenseback, owner.name, owner.contact ,s.tag_array FROM schoolvan INNER JOIN
        owner ON owner.id=schoolvan.ownerid,LATERAL ( SELECT ARRAY (SELECT s.name FROM   schoolvanschools sv JOIN   school       s  ON s.id = sv.sclid
        WHERE  sv.sclvanid = schoolvan.id) AS tag_array)s  WHERE schoolvan.approved=1`

        const pendingrequest = await db.query(query)
        
        return pendingrequest.rows
    }


    //Function to accept schoolvan request
    static async acceptRequest(credentials) {
        console.log(credentials.vanid)

        const query = `UPDATE schoolvan SET approved = 2  WHERE id=$1 RETURNING id`

        const result = await db.query(query,[credentials.vanid])
        console.log(result.rows[0])
        
        if(result.rows[0]!=null)
        {
            return true
        }
        else {
            return false
        }
    }

    //Function to get owners details
    static async getOwnersDetails() {

        const query = `SELECT (SELECT count(id) FROM schoolvan) AS schoolvan,(SELECT count(id) FROM users WHERE users.type='Parent') AS Parent
        ,(SELECT count(id) FROM users WHERE users.type='Owner') AS Owner`

        const owners = await db.query(query)
        
        return owners.rows
    }
    

}

module.exports = Admin