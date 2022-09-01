const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const generateToken = (data) =>
  jwt.sign(data, SECRET_KEY, { expiresIn: "72h" });

<<<<<<< HEAD
const createUserJwt=(user)=>{
    const payload={
        data:user,
    }
    return generateToken(payload)
}
const validateToken=(token)=>{
    try{
        const decoded=jwt.verify(token,SECRET_KEY)
        return decoded
    }catch(err){
        return {}
    }
}
=======
const createUserJwt = (user) => {
  const payload = {
    data: user,
  };
  console.log(payload);
  return generateToken(payload);
};
const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return {};
  }
};
>>>>>>> 4ada36983b4fad2a65586f1e939122c04c5d02d0

module.exports = {
  generateToken,
  createUserJwt,
  validateToken,
};
