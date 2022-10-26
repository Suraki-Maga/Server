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

    console.log(user);

    const userResult1 = await db.query(
      `INSERT INTO user_auth (id,password)
       VALUES ($1,$2)
      `,
      [user.id,hashedPassword]
    )

    if(credentials.type =="Parent")
    {
      const userResult2 = await db.query(
        `INSERT INTO parent (id,name,contact)
         VALUES ($1,$3,$2)
        `,
        [user.id,credentials.contact, credentials.username]
      )
    }
    else if(credentials.type =="Owner")
    {
      const userResult2 = await db.query(
        `INSERT INTO owner (id,name,contact)
         VALUES ($1,$3,$2)
        `,
        [user.id,credentials.contact, credentials.username]
      )
    }

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


//Function to retrieve all advertisment of schools
static async getSchoolAdvertisement() {
   

const query = `SELECT schoolvan.id, schoolvan.vehicleno, schoolvan.vehicletype, schoolvan.seats, schoolvan.charge,
schoolvan.startlocation, schoolvan.description, schoolvan.title, schoolvan.ac, schoolvan.driverid,schoolvan.ownerid,schoolvan.frontimage,schoolvan.backimage,owner.name as ownername,owner.contact as ownercontact,driver.fullname as drivername,driver.contact as drivercontact,(schoolvan.seats-count(student.vanid)) as avail, ((schoolvan.seats)/10) as rating from schoolvan INNER JOIN owner on owner.id=schoolvan.ownerid INNER join driver on driver.id=schoolvan.driverid LEFT JOIN student on student.vanid=schoolvan.id GROUP BY schoolvan.id,owner.name,owner.contact,driver.fullname,driver.contact`

const school = await db.query(query)
// console.log(school.rows)

return school.rows
}

//Function to retreive destination schools of vans
static async getDestinationSchools(credentials) {
  
  credentials.vanid = BigInt(credentials.vanid)
  const query = `select school.name,school.latitude,school.longtitude from ((school inner join schoolvanschools on schoolvanschools.sclid=school.id)
  inner join schoolvan on schoolvan.id=schoolvanschools.sclvanid) where schoolvan.id=$1`;

  const result = await db.query(query, [credentials.vanid]);
  if (result.rows[0] !== undefined) {
    return result.rows;
  } else {
    return "empty";
  }
}
}

module.exports = User