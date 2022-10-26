const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")
const User = require("./user")


class Owner extends User{
    
    static async getOwner(userName) {
        // console.log("dil")
       // console.log(userName)
        const query = `Select owner.id,owner.name, owner.contact,owner.email,owner.bank_acc,owner.scl_service_regno,owner.nic,owner.experience,owner.image from owner inner join users on owner.id=users.id where users.username=$1`
        const result=await db.query(query,[userName])
        // console.log(result.rows[0])
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
        return result.rows[0]
    }

    static async getdriverdetails(credentials){
      const requiredFields = ["id"];
        requiredFields.forEach((property) => {
          if (!credentials.hasOwnProperty(property)) {
            throw new BadRequestError(`Missing ${property} in request body.`);
          }
        });
        const tbl = "driver"
        const query = `select id,fullname,licenceno,contact,nic,image,avail from driver where ownerid=$1 ORDER BY id ASC`
        const result=await db.query(query,[credentials.id])
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
      const query = `select schoolvan.id,schoolvan.vehicleno,schoolvan.vehicletype,schoolvan.seats,schoolvan.charge,schoolvan.startlocation,schoolvan.ownerid,schoolvan.frontimage,schoolvan.driverid,schoolvan.ad,driver.fullname from schoolvan INNER JOIN driver ON schoolvan.driverid=driver.id WHERE (schoolvan.approved=$1 AND schoolvan.ownerid=$2) ORDER BY id ASC`
      const result = await db.query(query,[1,ownerid])
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
      return result.rows
    }

    static async updatesclvanDetails(credentials){
      const requiredFields = ["id","seats","charge","startlocation","driverid"];
      requiredFields.forEach((property) => {
        if (!credentials.hasOwnProperty(property)) {
          throw new BadRequestError(`Missing ${property} in request body.`);
        }
      });
      const query = `UPDATE schoolvan
                      SET (seats,charge,startlocation,driverid) = ($1,$2,$3,$4)
                      WHERE id=$5`
      
      const result = db.query(query,[credentials.seats,credentials.charge,credentials.startlocation,credentials.driverid,credentials.id])
      return result.rows
  }

  static async removeSchoolstoSchoolvan(credentials){
    const requiredFields = ["sclvanid"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `DELETE FROM schoolvanschools WHERE sclvanid=$1`
    
    const result = db.query(query,[credentials.sclvanid])
    return true
  }
  static async assignnewdriver(credentials){
    const requiredFields = ["sclvanid","crrdriver","newdriver"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE schoolvan SET driverid = $1 WHERE id=$2`
    const result = db.query(query,[credentials.newdriver,credentials.sclvanid])
    const query1 = `UPDATE driver SET avail = $1 WHERE id=$2`
    const result1 = db.query(query1,[1,credentials.crrdriver])
    const result2 = db.query(query1,[0,credentials.newdriver])
    return true
  }

  static async removeVehicle(credentials){
    const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `DELETE FROM schoolvan WHERE id=$1`
    db.query(query,[credentials.id])
}

static async getOwnersAdDetails(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select schoolvan.id,schoolvan.vehicleno,schoolvan.vehicletype,schoolvan.seats,schoolvan.charge,schoolvan.startlocation,schoolvan.description,schoolvan.title,schoolvan.ac,schoolvan.frontimage,count(student.vanid) as avail from schoolvan left join student on student.vanid=schoolvan.id where schoolvan.ownerid=$1 and schoolvan.approved=$2 and schoolvan.ad=$3 group by schoolvan.id`
    const result = await db.query(query,[credentials.id,1,true])
    return result.rows
}
static async getAllAdDetails(){
    const query = `select schoolvan.id,schoolvan.vehicleno,schoolvan.vehicletype,schoolvan.seats,schoolvan.charge,schoolvan.startlocation,schoolvan.description,schoolvan.title,schoolvan.ac,schoolvan.frontimage,count(student.vanid) as avail from schoolvan left join student on student.vanid=schoolvan.id where schoolvan.approved=$1 and schoolvan.ad=$2 group by schoolvan.id order by schoolvan.id DESC`
    const result = await db.query(query,[1,true])
    return result.rows
}


static async getAdDetailsSchools(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select school.name from school inner join schoolvanschools on school.id=schoolvanschools.sclid where schoolvanschools.sclvanid=$1`
    const result = await db.query(query,[credentials.id])
    return result.rows
}

static async getAdDetailsImages(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select image from schoolvanimages where schoolvanimages.sclvanid=$1`
    const result = await db.query(query,[credentials.id])
    return result.rows
}

static async InsertAdImage(credentials){
  const requiredFields = ["id","image"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `insert into schoolvanimages(image,sclvanid) VALUES($1,$2)`
    const result = await db.query(query,[credentials.image,credentials.id])
    return result.rows[0]
}

static async InsertAdDetails(credentials){
  const requiredFields = ["id","title","description"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE schoolvan SET (title,description,ad) = ($1,$2,$3) WHERE id=$4`
    const result = await db.query(query,[credentials.title,credentials.description,true,credentials.id])
    return result.rows[0]
}

static async getCount(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
  const query = `select schoolvan.id,schoolvan.vehicleno,schoolvan.seats,count(student.vanid) as avail from schoolvan left join student on student.vanid=schoolvan.id where ownerid=$1 group by schoolvan.id`
  const result = await db.query(query,[credentials.id])
  return result.rows
}

static async removeAd(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE schoolvan SET ad = $1 WHERE id=$2`
    const result = await db.query(query,[false,credentials.id])
    return result.rows[0]
}

static async getRequestDetails(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
  const query = `select request.id,request.student_id,request.van_id,schoolvan.vehicleno,request.monthlycharge,student.fullname as studentname,student.school,parent.name as parentname,parent.contact,student_location.longitude,student_location.latitude from request inner join student on student.id=request.student_id inner join schoolvan on schoolvan.id=request.van_id inner join parent on parent.id=student.parentid inner join student_location on student_location.id=student.id where (schoolvan.ownerid=$1 AND request.status=$2) ORDER BY request.id ASC`
  const result = await db.query(query,[credentials.id,true])
  return result.rows
} 

static async EditMonthlyCharge(credentials){
  const requiredFields = ["id","charge"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE request SET monthlycharge = $1 WHERE id=$2`
    const result = await db.query(query,[credentials.charge,credentials.id])
    return result.rows[0]
}

static async AcceptRequest(credentials){
  const requiredFields = ["student_id","id","van_id","charge","date"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE request SET req_status = $1 WHERE id=$2`
    const result = await db.query(query,["accepted",credentials.id])
    const query2 = `UPDATE request SET status = $1 WHERE student_id=$2`
    const result2 = await db.query(query2,[false,credentials.student_id])
    const query1 = `UPDATE student SET (vanid,monthly_charge,payment_date,sclvan_status) = ($1,$2,$3,$4) WHERE id=$5`
    const result1 = await db.query(query1,[credentials.van_id,credentials.charge,credentials.date,null,credentials.student_id])
    return result1.rows[0]
}

static async RejectRequest(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE request SET (status,req_status) = ($1,$2) WHERE id=$3`
    const result = await db.query(query,[false,"rejected",credentials.id])
    return result.rows[0]
}

static async getTotalIncome(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select sum(student.monthly_charge) as total from student inner join schoolvan on student.vanid=schoolvan.id where (EXTRACT (MONTH FROM payment_date) = EXTRACT (MONTH FROM current_date) and schoolvan.ownerid=$1)`
    const result = await db.query(query,[credentials.id])
    return result.rows[0]
}

static async getCurrentIncome(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select sum(student.monthly_charge) as current from student inner join schoolvan on student.vanid=schoolvan.id where (EXTRACT (MONTH FROM payment_date) = EXTRACT (MONTH FROM current_date) and schoolvan.ownerid=$1 and student.payment_status=$2)`
    const result = await db.query(query,[credentials.id,true])
    return result.rows[0]
}
static async getYetToPayList(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select student.fullname,student.monthly_charge,student.payment_date from student inner join schoolvan on student.vanid=schoolvan.id where (EXTRACT (MONTH FROM payment_date) = EXTRACT (MONTH FROM current_date) and schoolvan.ownerid=$1 and student.payment_status=$2 and payment_date>=current_date)`
    const result = await db.query(query,[credentials.id,false])
    return result.rows
}
static async getUnpaidList(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select student.id,student.fullname,student.monthly_charge,student.sclvan_status,student.payment_date,current_date-student.payment_date as due,schoolvan.vehicleno,parent.contact from student 
    inner join schoolvan on student.vanid=schoolvan.id
    inner join parent on student.parentid=parent.id
    where (schoolvan.ownerid=$1 and student.payment_status=$2 and payment_date < current_date)`
    const result = await db.query(query,[credentials.id,false])
    return result.rows
}
static async BanAStudent(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE student SET sclvan_status = $1 WHERE id=$2`
    const result = await db.query(query,["banned",credentials.id])
    return result.rows[0]
}
static async UnbanAStudent(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE student SET sclvan_status = $1 WHERE id=$2`
    const result = await db.query(query,[null,credentials.id])
    return result.rows[0]
}
static async RemoveAStudent(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `UPDATE student SET (sclvan_status,vanid,monthly_charge,payment_status,payment_date) = ($1,$2,$3,$4,$5) WHERE id=$6`
    const result = await db.query(query,["removed",null,null,null,null,credentials.id])
    return result.rows[0]
}
static async getcomplaints(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select complaints.id,complaints.date,complaints.complaint,complaints.status,schoolvan.vehicleno,parent.name,parent.contact from complaints
    inner join schoolvan on complaints.vanid=schoolvan.id
    inner join parent on complaints.parentid=parent.id
    where schoolvan.ownerid=$1`
    const result = await db.query(query,[credentials.id])
    const query1 = `select count(complaints.status) from complaints inner join schoolvan on complaints.vanid=schoolvan.id where status=$1 and schoolvan.ownerid=$2`
    const result1 = await db.query(query1,['pending',credentials.id])
    const query2 = `select count(complaints.status) from complaints inner join schoolvan on complaints.vanid=schoolvan.id where status=$1 and schoolvan.ownerid=$2`
    const result2 = await db.query(query2,['urgent',credentials.id])
    const query3 = `select count(complaints.status) from complaints inner join schoolvan on complaints.vanid=schoolvan.id where status=$1 and schoolvan.ownerid=$2`
    const result3 = await db.query(query3,['closed',credentials.id])
    return {complaints:result.rows,pending:result1.rows[0],urgent:result2.rows[0],closed:result3.rows[0]}
}
static async getReviews(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select reviews.date,reviews.review,reviews.feedback,schoolvan.vehicleno,student.fullname from reviews
    inner join schoolvan on reviews.vanid=schoolvan.id
    inner join student on reviews.studentid=student.id
    where schoolvan.ownerid=$1`
    const result = await db.query(query,[credentials.id])
    const query1 = `select count(reviews.review) from reviews inner join schoolvan on reviews.vanid=schoolvan.id where review=$1 and schoolvan.ownerid=$2`
    const result1 = await db.query(query1,[1,credentials.id])
    const query2 = `select count(reviews.review) from reviews inner join schoolvan on reviews.vanid=schoolvan.id where review=$1 and schoolvan.ownerid=$2`
    const result2 = await db.query(query2,[2,credentials.id])
    const query3 = `select count(reviews.review) from reviews inner join schoolvan on reviews.vanid=schoolvan.id where review=$1 and schoolvan.ownerid=$2`
    const result3 = await db.query(query3,[3,credentials.id])
    const query4 = `select count(reviews.review) from reviews inner join schoolvan on reviews.vanid=schoolvan.id where review=$1 and schoolvan.ownerid=$2`
    const result4 = await db.query(query4,[4,credentials.id])
    const query5 = `select count(reviews.review) from reviews inner join schoolvan on reviews.vanid=schoolvan.id where review=$1 and schoolvan.ownerid=$2`
    const result5 = await db.query(query5,[5,credentials.id])
    const query6 = `select count(reviews.review) from reviews inner join schoolvan on reviews.vanid=schoolvan.id where schoolvan.ownerid=$1`
    const result6 = await db.query(query6,[credentials.id])
    return {
      reviews:result.rows,
      r5:result5.rows[0],
      r4:result4.rows[0],
      r3:result3.rows[0],
      r2:result2.rows[0],
      r1:result1.rows[0],
      rt:result6.rows[0]
    }
}
static async getStudentDetails(credentials){
  const requiredFields = ["id"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });
    const query = `select student.id,student.fullname,student.sclvan_status,student.monthly_charge,student.image,(EXTRACT(YEAR FROM age(student.birthday))),student.school,parent.name as parentName,parent.contact from student 
    inner join schoolvan on student.vanid=schoolvan.id 
    inner join parent on student.parentid=parent.id
    where schoolvan.id=$1`
    const result = await db.query(query,[credentials.id])
    console.log(result.rows)
    return result.rows
}
}

module.exports = Owner