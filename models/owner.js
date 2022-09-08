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
        const requiredFields = ["name","licenseno","mobile","nic","url"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        const query = `INSERT INTO driver(fullname,licenceno,contact,nic,image,avail)
                        VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`

        const result = await db.query(query,[credentials.name,credentials.licenseno,credentials.mobile,credentials.nic,credentials.url,1])
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
        const query = `select id,fullname,licenceno,contact,nic,image,avail from driver`
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
        const requiredFields = ["data"];
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
        const requiredFields = ["vehicleno","vehicletype","seats","charge","startlocation","driverid","frontimg","backimg","licensefront","licenseback"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        
        console.log(ownerid)
        const query = `INSERT INTO schoolvan(vehicleno,vehicletype,seats,charge,startlocation,frontimage,backimage,licensefront,licenseback,driverid,ownerid)
                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`

        const result = await db.query(query,[credentials.vehicleno,credentials.vehicletype,credentials.seats,credentials.charge,credentials.startlocation,credentials.frontimg,credentials.backimg,credentials.licensefront,credentials.licenseback,credentials.driverid,ownerid])
        const query1 = `UPDATE driver SET avail=$1 WHERE id=$2`
        const result1 = await db.query(query1,[0,credentials.driverid])
        const schoolvanid = result.rows[0]
        console.log(schoolvanid)
        return schoolvanid
    }

    static async isuniquevehicleno(credentials){
      const requiredFields = ["vehicleno"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        const query = `select id from schoolvan where vehicleno=$1`
        const vehicleno = await db.query(query,[credentials.vehicleno])
        console.log(vehicleno.rows[0])
        if(vehicleno.rows[0]===undefined){
          return true;
        } else {
          return false
        }
    }

    static async getschoolvandetails(ownerid){
      const query = `select schoolvan.id,schoolvan.vehicleno,schoolvan.vehicletype,schoolvan.seats,schoolvan.charge,schoolvan.startlocation,schoolvan.ownerid,schoolvan.frontimage,driver.fullname from schoolvan INNER JOIN driver ON schoolvan.driverid=driver.id WHERE (schoolvan.approved=$1 AND schoolvan.ownerid=$2)`
      const result = await db.query(query,[1,ownerid])
      console.log(result)
      return result.rows
    }

    static async addSchoolstoSchoolvan(credentials){
      const requiredFields = ["school","schoolvanid"];
      requiredFields.forEach((property) => {
        if (!credentials.hasOwnProperty(property)) {
          throw new BadRequestError(`Missing ${property} in request body.`);
        }
      });
      const query = `INSERT INTO schoolvanschools(sclid,sclvanid) VALUES($1,$2)`
      const result = await db.query(query,[credentials.school,credentials.schoolvanid])
      return result.rows
    }

    static async getschoolsSchoolvan(){
      const query = `select * from schoolvanschools`
      const result = await db.query(query)
      console.log(result)
      return result.rows
    }
}

module.exports = Owner