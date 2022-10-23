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

}

module.exports = Admin