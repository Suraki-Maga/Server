const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config")
const db = require("../db")
const {createOtp} =require("../utils/gateway")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")
const Driver = require("./driver")

class User extends Driver{
  static makePublicUser(user) {
    return {
      id: user.id,
      contact: user.contact,
      username: user.username,
      type: user.type
    }
  }

  //Function to login the user
  static async login(credentials) {
    const requiredFields = ["username", "password"]
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`)
      }
    })

    const user = await User.fetchUserByUsername(credentials.username)
    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password)
      if (isValid) {
        return credentials.username;
      }
      else{
        return "invalid";
      }
    }

    else{
      return "invalid";
    }
  }

  //Function to register
  static async register(credentials) {
    // console.log(credentials)
    const requiredFields = ["contact", "password", "username", "type"]
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`)
      }
    })

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(credentials.password, salt);


    const userResult = await db.query(
      `INSERT INTO users (contact, username, type)
       VALUES ($1, $2, $3)
       RETURNING id;
      `,
      [credentials.contact, credentials.username, credentials.type]
    )
    const user = userResult.rows[0]

    const userResult1 = await db.query(
      `INSERT INTO user_auth (id,password)
       VALUES ($1,$2)
      `,
      [user.id,hashedPassword]
    )

    return user
  }


  //Function to check whether another user has the same contact
  static async fetchUserByContact(contact) {
    if (!contact) {
      throw new BadRequestError("No contact provided")
    }

    const query = `SELECT * FROM users WHERE contact = $1`

    const result = await db.query(query, [contact])

    const user = result.rows[0]

    return user
  }

  //Function to check whether another user has the same username
  static async fetchUserByUsername(username) {
    if (!username) {
      throw new BadRequestError("No username provided")
    }

    const query = `SELECT * FROM users INNER JOIN user_auth ON users.id=user_auth.id WHERE users.username = $1`

    const result = await db.query(query, [username])

    const user = result.rows[0]

    return user
  }

  //Function to sendOtp
  static async sendOtp(credentials){
    const requiredFields = ["username","contact"]
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`)
      }
    })

    const existingUser = await User.fetchUserByContact(credentials.contact)
    if (existingUser) {
      throw new BadRequestError(`A user already exists with same contact number: ${credentials.contact}`)
    }

    const existingUserWithUsername = await User.fetchUserByUsername(credentials.username)
    if (existingUserWithUsername) {
      throw new BadRequestError(`A user already exists with username: ${credentials.username}`)
    }


    // console.log(contactNo.contact)
      let otp=createOtp(credentials.contact)
    if(otp){
      return otp
    }
    else {
      throw new BadRequestError(`Cannot send an OTP. Try again in few minutes`)
    }
    
  }


  //Function to retrive usertype
  static async fetchUsertype(username) {
    if (!username) {
      throw new BadRequestError("No username provided")
    }

    const query = `SELECT username, contact, type FROM users WHERE username = $1`

    const result = await db.query(query, [username])

    const user = result.rows[0]
    console.log(user)

    return user.type
  }

  //Function to retrieve all schools
  static async getSchools() {
   

   const query = `SELECT name, id from school`

  const school = await db.query(query)


    return school.rows
  }
}

module.exports = User