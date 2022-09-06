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

    static async getOwnerid(userName) {
        console.log("getownerid")
        const query = `Select owner.id from owner inner join users on owner.id=users.id where users.username=$1`
        const result=await db.query(query,[userName])
        return result.rows[0]
    }

    static async registerDriver(credentials){
        const requiredFields = ["fullname","licenceno","contact","nic","image"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        const query = `INSERT INTO driver(fullname,licenceno,contact,nic,image)
                        VALUES ($1,$2,$3,$4,$5) RETURNING id`

        const result = await db.query(query,[credentials.name,credentials.licenseno,credentials.mobile,credentials.nic,credentials.url])
        return result.rows[0]
    }

    static async EditOwnerProfile(credentials){
        const requiredFields = ["name","contact","email","bank_acc","scl_service_regno","nic","experience","image"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        const query = `UPDATE owner
                        SET (name,contact,email,bank_acc,scl_service_regno,nic,experience,image) = ($1,$2,$3,$4,$5,$6,$7,$8)
                        WHERE id=$9`

        const result = await db.query(query,[credentials.name,credentials.contact,credentials.email,credentials.bank_acc,credentials.scl_service_regno,credentials.nic,credentials.experience,credentials.image,credentials.id])
        console.log(result.rows[0])
    }

    static async getdriverdetails(){
        const tbl = "driver"
        const query = `select id,fullname,licenceno,contact,nic,image from driver`
        const result=await db.query(query)
        return result.rows
    }

    static async EditDriverProfile(credentials){
        const requiredFields = ["id","fullname","licenceno","contact","nic","image"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        const query = `UPDATE driver
                        SET (fullname,licenceno,contact,nic,image) = ($1,$2,$3,$4,$5)
                        WHERE id=$6`
        
        db.query(query,[credentials.fullname,credentials.licenceno,credentials.contact,credentials.nic,credentials.image,credentials.id])
    }

    static async removeDriver(credentials){
        const requiredFields = ["id"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        const query = `DELETE FROM driver WHERE id=$1`
        db.query(query,[credentials.id])
    }
    
    static async loadDriverDetails(credentials){
        const requiredFields = ["id","fullname","licenceno","contact","nic","image"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        const query = `select id,fullname,licenceno,contact,nic,image from driver where id=$1`
        const result=await db.query(query,[credentials.data])
        console.log(result.rows[0])
        return result.rows[0]
    }

    static async registersclvan(credentials,ownerid){
        const requiredFields = ["vehicleno","vehicletype","seats","charge","startlocation","driverid","frontimage","backimage","licensefront","licenseback"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        console.log(ownerid)
        const query = `INSERT INTO schoolvan(vehicleno,vehicletype,seats,charge,startlocation,frontimage,backimage,licensefront,licenseback,driverid,ownerid)
                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`

        const result = await db.query(query,[credentials.vehicleno,credentials.vehicletype,credentials.seats,credentials.charge,credentials.startlocation,credentials.frontimg,credentials.backimg,credentials.licensefront,credentials.licenseback,credentials.driverid,ownerid])
        const schoolvanid = result.rows[0]
        console.log(schoolvanid)
        return schoolvanid
    }
}

module.exports = Owner