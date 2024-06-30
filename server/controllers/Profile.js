const Profile = require('../models/Profile')
const User = require('../models/User')
const { uploadImageToCloudinary } = require('../utils/imageUploader')
require('dotenv').config()

// update Profile becasue profile is already created with null
exports.updateProfile = async (req,res) => {
    try{
        // fetch data gender="" means agr a rhe toh wo wali value agr nhi toh empty
        const {gender="",dateOfBirth="",about,contactNumber} = req.body
        const userId = req.user.id//meddleware auth se aega
        // validattion
        if(!gender || !dateOfBirth || !about || !contactNumber){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        // find profile by user id
        const userDetails = await User.findById(userId)
        
        const ProfileId = userDetails.additionalDetails
        
        // update profile
        // const profiledetails = await Profile.findByIdAndUpdate(
        //     ProfileId,
        //     {
        //         gender,
        //         dateOfBirth,
        //         about,
        //         contactNumber
        //     }

        // )
        // OR

        const profileDetails = await Profile.findById(ProfileId)

        profileDetails.gender = gender
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber

        await profileDetails.save()

        // return response
        return res.status(200).json({
            success:true,
            updatedUserDetails:profileDetails,
            message:"Profile updated successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to update profile error: ${error}`
        })
    }
}

// delete account
exports.deleteAccount = async (req,res) => {
    try{
        // TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });

        // get id
        const userId = req.user.id//meddleware auth se aega
        
        // validattion
        const userDetails = await User.findById(userId)
        
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"not a valid account"
            })
        }

        // delete profile/additional details in user==profile id
        await Profile.findByIdAndDelete(userDetails.additionalDetails)
        
        // TODO: HW unenroll user from all enrolled courses studentsEnrolled
        // find a by by which i can schedule the req (like user deletes his account but is it delete after 5 days)
        // delete user
        await User.findByIdAndDelete(userId)

        // return response
        return res.status(200).json({
            success:true,
            message:"Profile deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to delete user error: ${error}`
        })
    }
}

// get all details of a user
exports.getAllUserDetails = async (req,res) => {
    try{
        // get id
        const id = req.user.id
        // vaildation and get user details
        const userDetails = await User.findById(id)
            .populate('additionalDetails')
            .exec()
        
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"not a valid account"
            })
        }
        
        // return response
        return res.status(200).json({
            success:true,
            userDetails,
            message:"Successfuly fetched all details of a user"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to fetch all details of a user error: ${error}`
        })
    }
}

// update Display Picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id

        const image = await uploadImageToCloudinary(
          displayPicture,
          process.env.FOLDER_NAME,
          1000,
          1000,
        )
        
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
          { _id: userId },
          { image: image.secure_url },
          { new: true }
        )
        res.send({
          success: true,
          message: `Image Updated successfully`,
          data: updatedProfile,
        })
      } catch (error) {
        console.log(error)
        return res.status(500).json({
          success: false,
          message: `Failed to update Display Picture error: ${error}`,
        })
      }
}

// get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
    try{
        // get user id
        const userId = req.user.id

        // get enrolled data from user
        const userDetails = await User.findOne({_id:userId}).populate("courses").exec()
        
        //validation 
        if (!userDetails) {
            return res.status(400).json({
              success: false,
              message: `Could not find user with id: ${userDetails}`,
            })
        }

        // return response
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to fetch all Enrolled Courses error: ${error}`
        })
    }
}