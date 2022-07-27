const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config")
const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

//faalil modaya
class Driver{
    static makeDriver(driver) {
        return {
          id: driver.id,
          username: driver.username,
          isAdmin: driver.contact,
        }
    }


    static async fetchUserByMobile(contact) {
        if (!contact) {
          throw new BadRequestError("No mobile no provided!")
        }
    
        const query = `SELECT * FROM drivers WHERE contact = $1`
    
        const result = await db.query(query, [contact])
    
        const driver = result.rows[0]
    
        return driver
    }
    static async fetchUserByUserName(username) {
        if (!username) {
          throw new BadRequestError("No mobile no provided!")
        }
    
        const query = `SELECT * FROM drivers WHERE username = $1`
    
        const result = await db.query(query, [username])
    
        const driver = result.rows[0]
    
        return driver
    }

    
    static async verify(credentials){
        const requiredFields = ["nic","otp"]
        requiredFields.forEach((property) => {
            if (!credentials.hasOwnProperty(property)) {
              throw new BadRequestError(`Missing ${property} in request body.`)
            }
          })
        const query = `Select driver.id from driver inner join driver_verify on driver.id=
        driver_verify.id where driver.nic=$1 and driver_verify.otp=$2`
    
        const result = await db.query(query,[credentials.nic,credentials.otp])
        //add rest of the code
        const driver = result.rows[0]

        if(!driver){
          throw new BadRequestError("Username and otp mismatch")
        }

        return driver
    }

}

module.exports = Driver