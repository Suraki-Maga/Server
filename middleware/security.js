const jwt=require("jsonwebtoken")
const {SECRET_KEY}=require("../config")
const {UnauthorizedError}=require("../utils/errors")

//Function to extract the Jwt from request headers
const jwtFrom=({headers})=>{
    if(headers?.authorization){
        const[scheme,token]=headers.authorization.split(" ")
        if(scheme.trim()==="Bearer"){
            
            return token
        }
    }
    return undefined
}
//function to attact user to res object
const extractUserfromJwt=(req,res,next)=>{
    try{
        const token=jwtFrom(req)
        if(token){
            res.locals.user=jwt.verify(token,SECRET_KEY)
        }
        return next()
    }catch(err){
        return next()
    }
}

//function to verify an auth user exists
const requireAuthorizedUser=(req,res,next)=>{
    try{
        const {user} =res.locals
        if(!user.data){
            throw new UnauthorizedError()
        }
        return next()
    }catch(err){
        return next(err)
    }
}

module.exports={
    extractUserfromJwt,
    requireAuthorizedUser,
}