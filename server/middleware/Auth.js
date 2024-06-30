const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// auth
exports.auth = async (req,res,next) => {
    try{
        // extract token
        const token = req.body.token
                    || req.cookies.token
                    || req.header("Authorization").replace("Bearer ","");
        // if token missing, then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:`Token is missing`,
            })
        }

        // verify token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode
        }catch(error){
            return res.status(401).json({
                success:false,
                message:`token is invaild`
            })
        }
        next()
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong while validating the token in auth middleware error: ${error}`
        })
    }
}

// isStudent
exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:`This is a protected route for Students Only`
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in while validating the student in middleware error: ${error}`
        })
    }
}

// isInstructor
exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:`This is a protected route for Instructor Only`
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in while validating the Instructor in middleware error: ${error}`
        })
    }
}

// isAdmin
exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:`This is a protected route for Admin Only`
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in while validating the Admin in middleware error: ${error}`
        })
    }
}