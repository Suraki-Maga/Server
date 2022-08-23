const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config")
const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

class Owner {
    
    static async getOwner(userName) {
        // console.log("dil")
        // console.log(userName)
        const query = `Select owner.name, owner.contact,owner.email,owner.bank_acc,owner.scl_service_regno,owner.nic,owner.experience from owner inner join owner_auth on owner.id=owner_auth.id where owner_auth.username=$1`
        const result=await db.query(query,[userName])
        console.log(result.rows[0])
        return result.rows[0]
    }
}

module.exports = Owner