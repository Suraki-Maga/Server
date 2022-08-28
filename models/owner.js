const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config")
const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

class Owner {
    
    static async getOwner(userName) {
        // console.log("dil")
       // console.log(userName)
        const query = `Select owner.id,owner.name, owner.contact,owner.email,owner.bank_acc,owner.scl_service_regno,owner.nic,owner.experience from owner inner join users on owner.id=users.id where users.username=$1`
        const result=await db.query(query,[userName])
        console.log(result.rows[0])
        return result.rows[0]
    }

    static async registerDriver(credentials){
        const query = `INSERT INTO driver(fullname,licenceno,contact,nic,image)
                        VALUES ($1,$2,$3,$4,$5) RETURNING id`

        const result = await db.query(query,[credentials.name,credentials.licenseno,credentials.mobile,credentials.nic,credentials.url])
    }

    static async EditOwnerProfile(credentials){
        const query = `UPDATE owner
                        SET (name,contact,email,bank_acc,scl_service_regno,nic,experience) = ($1,$2,$3,$4,$5,$6,$7)
                        WHERE id=$8`

        const result = await db.query(query,[credentials.name,credentials.contact,credentials.email,credentials.bank_acc,credentials.scl_service_regno,credentials.nic,credentials.experience,credentials.id])
        console.log(result.rows[0])
    }

    static async getdriverdetails(){
        const query = `select id,fullname,licenceno,contact,nic,image from driver`
        const result=await db.query(query)
        return result.rows
    }

    static async EditDriverProfile(credentials){
        const query = `UPDATE driver
                        SET (fullname,licenceno,contact,nic) = ($1,$2,$3,$4)
                        WHERE id=$5`
        
        db.query(query,[credentials.fullname,credentials.licenceno,credentials.contact,credentials.nic,credentials.id])
    }
}

module.exports = Owner