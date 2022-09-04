const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

class Owner {
    
    static async getOwner(userName) {
        // console.log("dil")
       // console.log(userName)
        const query = `Select owner.id,owner.name, owner.contact,owner.email,owner.bank_acc,owner.scl_service_regno,owner.nic,owner.experience,owner.image from owner inner join users on owner.id=users.id where users.username=$1`
        const result=await db.query(query,[userName])
        console.log(result.rows[0])
        return result.rows[0]
    }

    static async registerDriver(credentials){
        const query = `INSERT INTO driver(fullname,licenceno,contact,nic,image)
                        VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`

        const result = await db.query(query,[credentials.name,credentials.licenseno,credentials.mobile,credentials.nic,credentials.url])
    }

    static async EditOwnerProfile(credentials){
        const query = `UPDATE owner
                        SET (name,contact,email,bank_acc,scl_service_regno,nic,experience,image) = ($1,$2,$3,$4,$5,$6,$7,$8)
                        WHERE id=$9`

        const result = await db.query(query,[credentials.name,credentials.contact,credentials.email,credentials.bank_acc,credentials.scl_service_regno,credentials.nic,credentials.experience,credentials.image,credentials.id])
        console.log(result.rows[0])
    }

    static async getdriverdetails(){
        const query = `select id,fullname,licenceno,contact,nic,image from driver`
        const result=await db.query(query)
        return result.rows
    }

    static async EditDriverProfile(credentials){
        const query = `UPDATE driver
                        SET (fullname,licenceno,contact,nic,image) = ($1,$2,$3,$4,$5)
                        WHERE id=$6`
        
        db.query(query,[credentials.fullname,credentials.licenceno,credentials.contact,credentials.nic,credentials.image,credentials.id])
    }

    static async removeDriver(credentials){
        const query = `DELETE FROM driver WHERE id=$1`
        db.query(query,[credentials.id])
    }
    
    static async loadDriverDetails(credentials){
        const query = `select id,fullname,licenceno,contact,nic,image from driver where driver.id=$1`
        const result=await db.query(query,[credentials.id])
        console.log(result.rows[0])
        return result.rows[0]
    }
}

module.exports = Owner