const { BCRYPT_WORK_FACTOR } = require("../config")
const bcrypt = require("bcrypt");
const {createOtp} =require("../utils/gateway")
const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

class Driver{
    static makeDriver(driver) {
        return {
          id: driver.id,
          username: driver.username,
          contact: driver.contact,
        }
    }
    
    static async verify(credentials){
        const requiredFields = ["nic","otp"]
        requiredFields.forEach((property) => {
            if (!credentials.hasOwnProperty(property)) {
              throw new BadRequestError(`Missing ${property} in request body.`)
            }
          })
        const query = `Select driver.id,driver.fullname from driver inner join driver_verify on driver.id=
        driver_verify.id where driver.nic=$1 and driver_verify.otp=$2`
    
        const result = await db.query(query,[credentials.nic,credentials.otp])
        //add rest of the code
        const driver = result.rows[0]

        if(!driver){
          return "no driver"
        }else{
          return driver
        }

        
    }

    static async sendOtp(credentials){
      const requiredFields = ["id","userName"]
      requiredFields.forEach((property) => {
        if (!credentials.hasOwnProperty(property)) {
          throw new BadRequestError(`Missing ${property} in request body.`)
        }
      })
      const query1='Select id from driver_auth where username=$1'
      const result1=await db.query(query1,[credentials.username])
      console.log(result1.rows)

      if(result1.rows[0]==undefined){
        const query2 = `Select contact from driver where id=$1`
        const result2 = await db.query(query2,[credentials.id])
  
        const contactNo = result2.rows[0]
  
        // console.log(contactNo.contact)
        let otp=createOtp(contactNo.contact)
        // console.log(otp)
        return otp
      }else{
        return "taken"
      }

    }
    static async resendOtp(id){

      const query = `Select contact from driver where id=$1`
      const result = await db.query(query,[id])
      
      const contactNo = result.rows[0]
  
      console.log(contactNo.contact)
      let otp=createOtp(contactNo.contact)
      console.log(otp)
      return otp
    }

    static async submitCredentials(credentials){
      const requiredFields = ["id","userName","password"]
      requiredFields.forEach((property) => {
        if (!credentials.hasOwnProperty(property)) {
          throw new BadRequestError(`Missing ${property} in request body.`)
        }
      })
      //get the hash value of the password
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(credentials.password, salt);
      // console.log(password)
      const query = `insert into driver_auth (id,username,passwordhash) values ($1,$2,$3) RETURNING username`
      const result = await db.query(query,[credentials.id,credentials.userName,password])

      if (result.rows[0]!=undefined){
        return "success"
      }else{
        return "failed"
      }
    }
    // static async login(credentials){
    //   const validPassword = await bcrypt.compare(credentials.password, password);
    //   if (validPassword) {
    //     console.log("valid password")
    //   } else {
    //     console.log("invalid password")
    //   }
    // }

}

module.exports = Driver