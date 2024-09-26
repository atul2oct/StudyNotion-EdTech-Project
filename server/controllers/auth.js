const User = require('../models/User.js')
const optGenerator = require('otp-generator')
const bcrypt = require('bcryptjs')
const Profile = require('../models/Profile.js')
const jwt = require('jsonwebtoken')
const mailSender = require('../utils/mailSender.js')
const { passwordUpdated } = require('../mail/templates/passwordUpdate.js')
const Otp = require('../models/Otp.js')
require('dotenv').config()

// sendOtp
exports.sendOTP = async (req,res) => {
    try{
        // fetch email from request ki body
        const {email} = req.body

        // check if user already exists
        const checkUserPresent = await User.findOne({email})

        // if user already exists, then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:`User already exists with this email`
            })
        }
        // bekaar code otp wla -> find another way that can give garenty for unique otp
        // generate otp
        var otp = optGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        // check unique otp or not
        let result = await Otp.findOne({otp:otp})
        
        while(result){
            otp = optGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
            result = await Otp.findOne({otp:otp})
        }
        console.log("OTP Generated: ",otp)

        const otpPayload = {email,otp}
        
        // create an entry in db
        const otpBody = await Otp.create(otpPayload)
        res.status(200).json({
            success:true,
            otpBody,
            message:"Otp sent successfully"

        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in sending otp error: ${error}`
        })
    }
}

// signUp
exports.signUp = async (req,res) => {
    try{
        // fetch data from request ki body Destructure fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,            
        } = req.body

        // validate data
        if(!firstName || 
            !lastName || 
            !email || 
            !password || 
            !confirmPassword || 
            !otp){
                return res.status(403).json({
                    success:false,
                    message:`All fields are required`
                })
            }
        
        // Check if password and confirm password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:`Password mismatch password and confirmPassword does not match , please try again`
            })
        } 
        
        // check user already exists or not
        const checkUserPresent = await User.findOne({email})
        if(checkUserPresent){
            return res.status(400).json({
                success:false,
                message:`User already exists. Please sign in to continue.`
            })
        }
        
        // find most recent OTP stored for User
        const recentOtp = await Otp.find({email}).sort({createdAt:-1}).limit(1)
        console.log("otp: ",recentOtp)
        // validate otp
        if(!recentOtp || recentOtp.length === 0){
            // OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }else if(otp !== recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message:"invaild OTP"
            })
        }
        // hash the pasword
        const hashPassword = await bcrypt.hash(password,10)
        // entry create in db
        
        let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);
        
        // Create the Additional Profile For User
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        }) 
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashPassword,
            accountType,
            approved: approved,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,//iss api se avtar banta hai atul yadav -> ay
        })
        // return response
        return res.status(200).json({
            success:true,
            user,
            message:"User is registered successfully"

        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in sign up User connot be registered error: ${error}`
        })
    }
}

// logIn
exports.login = async (req,res) => {
    try{
        // get data from req body
        const {email,password} = req.body
        // validation data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required, please try again"
            });
        }
        // user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered please sign up first"
            });
        }
        // generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)){
            // password matched
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"72h",
            })
            // Save token to user document in database
            user.token = token
            user.password = undefined
            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3* 24 * 60 * 60 * 1000),
                httpOnly:true, // Cookie is accessible only by the server (not by JavaScript)
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User signed in successfully"
            })
        }else{
            // password mismatched
            return res.status(401).json({
                success:false,
                message:"Password mismatched"
            })
        }
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in login User error: ${error}`
        })
    }
}

// change password HW
exports.changePassword = async (req,res) => {
    try{
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id)

        // get data from req OldPassword,newPasswrod,conmfirmPassword
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // validation
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(401).json({ 
                success: false,
                message: "All fields are required" 
            });
        }
        const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password)
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res.status(401).json({ 
                success: false,
                message: "The password is incorrect"
            });
        }
        // Match new password and confirm new password
        if (newPassword !== confirmNewPassword) {
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            });
        }
        // update pwd in DB
        const hashPassword = await bcrypt.hash(newPassword,10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password:hashPassword},
            {new:true},
        )
        // send email - password updated
        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully:", emailResponse.response);
        }catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }
        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: "Password updated successfully" });
    }catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
}
