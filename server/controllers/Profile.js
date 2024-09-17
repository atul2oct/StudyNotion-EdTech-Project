const Course = require('../models/Course')
const CourseProgress = require('../models/CourseProgress')
const Profile = require('../models/Profile')
const User = require('../models/User')
const { uploadImageToCloudinary } = require('../utils/imageUploader')
const { convertSecondsToDuration } = require('../utils/secToDuration')
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
        let userDetails = await User.findOne({_id:userId})
        .populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            },
        })
        .exec()
        
        //validation 
        if (!userDetails) {
            return res.status(400).json({
              success: false,
              message: `Could not find user with id: ${userId}`,
            })
        }

        // Convert Mongoose document to plain JavaScript object
        userDetails = userDetails.toObject();
        
        // Loop through each course to calculate total duration and progress
        for( let i=0 ; i < userDetails.courses.length ; i++ ){
            let totalDurationInSeconds = 0;
            let SubSectionLength = 0;

            // Loop through each course content to calculate total duration
            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc,curr)=>acc+parseInt(curr.timeDuration),0);
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
                SubSectionLength += userDetails.courses[i].courseContent[j].subSection.length;
            }

            // Get the progress count for the course
            let courseProgressCount = await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId,
            });
            courseProgressCount = courseProgressCount?.completedVideos?.length || 0;

            // Calculate the progress percentage
            if(SubSectionLength === 0){
                userDetails.courses[i].progressPercentage = 100
            }else{
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage = Math.round((courseProgressCount/SubSectionLength)*100*multiplier)/multiplier;
            }
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

// ================ instructor Dashboard ================
exports.instructorDashboard = async (req, res) => {
    try{
        // get course data from Course
        const  courseDetails = await Course.find({ instructor:req.user.id });

        // create course data
        const courseData = courseDetails.map((course) => {
            // total student enrolled
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            // total amount generated
            const totalAmountGenerated = totalStudentsEnrolled * course.price;
            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            };

            return courseDataWithStats;
        });        

        // return response
        return res.status(200).json({
            success: true,
            courses: courseData,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to fetch Instructor Dashboard error: ${error}`
        });
    }
}