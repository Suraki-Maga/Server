const createOtp=(mobileNo)=>{
    let otp=Math.floor((Math.random() * 999999) + 100000)
    return otp
}

module.exports={
    createOtp
}