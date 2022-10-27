const express = require("express");
const db = require("../db");
const security = require("../middleware/security");

class Parent {
  //Function to retrieve id
  static async fetchUserid(username) {
    const query = `SELECT id FROM users WHERE username = $1`;

    const userid = await db.query(query, [username]);

    return userid.rows[0];
  }

  //Function to get children names
  static async getChildren(userName) {
    const query = `Select student.id,student.fullname,school.name as school,
        AGE(CURRENT_DATE, student.birthday),student.image,student.vanid,schoolvan.frontimage,schoolvan.backimage,owner.name 
        as ownername,owner.contact as ownercontact,driver.fullname 
        as drivername,driver.contact as drivercontact,student.payment_status,
        student.monthly_charge 
        from student inner join users on student.parentid=users.id INNER JOIN 
        school ON student.school=school.id  left join schoolvan on student.vanid=
        schoolvan.id left join driver on schoolvan.driverid=driver.id 
        left join owner
        ON schoolvan.ownerid=owner.id where users.username=$1`;
    const children = await db.query(query, [userName]);

    if (children.rows) {
      return children.rows;
    } else {
      return "false";
    }
  }

  //Function to get children vehicle details
  static async getChildVehicle(request) {
    const query = `Select student.id,student.fullname,school.name as school,
        AGE(CURRENT_DATE, student.birthday),student.image,student.vanid,schoolvan.frontimage,schoolvan.backimage,schoolvan.vehicleno,owner.name 
        as ownername,owner.contact as ownercontact,driver.fullname 
        as drivername,driver.contact as drivercontact,student.payment_status,
        student.monthly_charge 
        from student inner join users on student.parentid=users.id INNER JOIN 
        school ON student.school=school.id  left join schoolvan on student.vanid=
        schoolvan.id left join driver on schoolvan.driverid=driver.id 
        left join owner
        ON schoolvan.ownerid=owner.id where users.username=$1`;
    const childvehicle = await db.query(query, [request.studentid]);

    if (childvehicle.rows) {
      return childvehicle.rows[0];
    } else {
      return "false";
    }
  }

  //Function to add a child
  static async addChild(username, credentials) {
    const userid = await Parent.fetchUserid(username);

    const query = `INSERT INTO student(fullname,parentid,school,image,birthday)
        VALUES ($1,$2,$3,$4,$5) RETURNING id`;

    const result = await db.query(query, [
      credentials.name,
      userid.id,
      credentials.school,
      credentials.url,
      credentials.dob,
    ]);

    const query1 = `INSERT INTO student_location(id,latitude,longitude)
        VALUES ($1,$2,$3) RETURNING id`;

    const result1 = await db.query(query1, [
      result.rows[0].id,
      credentials.latitude,
      credentials.longitude,
    ]);

    if (result1) {
      return true;
    } else {
      return false;
    }
  }

  //Function to get children names with the monthly charges
  static async getChildrenRequest(userName, credentials) {
    const userid = await Parent.fetchUserid(userName);
    console.log(userid);
    console.log(credentials.vanid);

    const query = `SELECT student.id,student.fullname,student.vanid,student.school,student.parentid,
        student_location.latitude,student_location.longitude,school.latitude,school.longtitude,
        schoolvan.charge,(student.distance*schoolvan.charge*25) AS monthly_charge from student INNER JOIN schoolvanschools ON student.school = schoolvanschools.sclid
        INNER JOIN student_location ON student_location.id =student.id INNER JOIN school ON school.id=student.school INNER JOIN schoolvan
        ON schoolvan.id =schoolvanschools.sclvanid WHERE student.parentid=$1 and schoolvanschools.sclvanid=$2`;

    const children = await db.query(query, [userid.id, credentials.vanid]);

    if (children.rows) {
      return children.rows;
    } else {
      return "false";
    }
  }

  //Function to send a request
  static async sendRequest(credentials) {
    const query = `INSERT INTO request(student_id,van_id,monthlycharge)
        VALUES ($1,$2,$3) RETURNING id`;

    const result = await db.query(query, [
      credentials.studentid,
      credentials.vanid,
      credentials.monthlycharge,
    ]);

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  //Function to leave from a van
  static async leaveVan(credentials) {
    const query = `UPDATE student SET vanid = NULL,  payment_status= NULL WHERE id=$1`;

    const result = await db.query(query, [credentials.studentid]);

    if (result.rows[0] != null) {
      return true;
    } else {
      return false;
    }
  }

  //Function to markabsent
  static async markAbsent(credentials) {
    const query = `UPDATE student SET morning_state = $2,  evening_state= $3 WHERE id=$1 RETURNING id`;

    const result = await db.query(query, [
      credentials.studentid,
      credentials.morning,
      credentials.evening,
    ]);

    if (result.rows[0] != null) {
      return true;
    } else {
      return false;
    }
  }

  static async getBio(username) {
    let query = `select id from users where username=$1`;
    let result = await db.query(query, [username]);
    const query2 = "select * from parent where id =$1";
    result = await db.query(query2, [result.rows[0].id]);
    return result.rows[0];
  }
}

module.exports = Parent;
