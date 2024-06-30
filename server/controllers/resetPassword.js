const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const bcrypt = require('bcrypt')
require('dotenv').config()
const crypto = require('crypto')

// resetPasswodToken
exports.resetPasswordToken = async (req,res) => {
    try{
        // get email from req body
        const email = req.body.email
        // check user for this email , eamil validation
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered please sign up first"
            });
        }
        // generate token
        const token = crypto.randomUUID();
        // update user by adding token and exipration time
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExipres:Date.now() + 5*60*1000,
            },
            {new:true}//updated doc return hoga wrna purana wla return hoga
            ) 
        // link generate
        const url = `http://localhost:3000/update-password/${token}`
        // send  mail containing the url
        await mailSender(email,"Password reset link",`Password reset link: ${url}`)
        // return response
        return res.status(200).json({
            success:true,
            message:`Email sent successfully`
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in while reseting Password Token error: ${error}`
        })
    }

}

// reset password
exports.resetPassword = async (req,res) => {
    try{
        // data fetch
        const {password,confirmPassword,token} = req.body
        // validating data
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:`Password mismatch`
            })
        }
        // get usaer details
        const userDetails = await User.findOne({token:token})
        // if no entry - invaild token
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:`Token invalid`
            })
        }
        // token time check
        if(userDetails.resetPasswordExipres < Date.now()){
            return res.status(400).json({
                success:false,
                message:`Time expires`
            })
        }
        // passwoord hash
        const hashedPassword = await bcrypt.hash(password , 10 )
        // update password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )
        // return response
        res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in reset pwd error: ${error}`
        })
    }
}