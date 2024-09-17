const Course = require('../models/Course')
const Category = require('../models/Category')
const User = require('../models/User')
const Section = require("../models/Sections")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const {uploadImageToCloudinary} = require('../utils/imageUploader')
const { convertSecondsToDuration } = require("../utils/secToDuration")
// Function to create a new course

// exports.createCourse = async (req,res) => {
//     try{
//         // fetch data
//         let {courseName,
//             courseDescription,
//             whatYouWillLearn,
//             price,
//             tag,
//             category,
//             status,
// 			instructions,} = req.body
        
//         // get thumbnail
//         const thumbnail = req.files.thumbnailImage
        
//         // validation
//         if(
//             !courseName ||
// 			!courseDescription ||
// 			!whatYouWillLearn ||
// 			!price ||
// 			!tag ||
// 			!thumbnail ||
// 			!category
//         ){
//             return res.status(400).json({
//                 success:false,
//                 message:"All fields are required"
//             })
//         }
//         if (!status || status === undefined) {
// 			status = "Draft";
// 		}

//         // Check if the user is an instructor
//         const userId = req.user.id
//         const instructorDetails = await User.findById(userId, {
// 			accountType: "Instructor",
// 		});
//         console.log("instructor Details: ",instructorDetails)

//         if(!instructorDetails){
//             return res.status(404).json({
//                 success:false,
//                 message:"instructor Deatils not found"
//             })
//         }

//         // given Category is vaild or not
//         const CategoryDetails = await Category.findById(category)

//         if(!CategoryDetails){
//             return res.status(500).json({
//                 success:false,
//                 message:"Unable to retrive Category details"
//             })
//         }

//         // upload image to cloudinary
//         const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

//         // create an entry for new course
//         const newCourse = await Course.create({
//             courseName,
// 			courseDescription,
// 			instructor: instructorDetails._id,
// 			whatYouWillLearn: whatYouWillLearn,
// 			price,
// 			tag: tag,
// 			category: CategoryDetails._id,
// 			thumbnail: thumbnailImage.secure_url,
// 			status,
// 			instructions: instructions,
//         })
//         // add the new course to the user schema of instructor
//         await User.findByIdAndUpdate(
//             {_id:instructorDetails._id},
//             {
//                 $push: {
//                     courses:newCourse._id
//                 }
//             },
//             {new:true}
//         )
//         // return response
//         return res.status(200).json({
//             success:true,
//             data:newCourse,
//             message:"Category details not found"
//         })
//     }catch(error){
//         return res.status(500).json({
//             success:false,
//             message:`Failed to create course error: ${error}`
//         })
//     }
// }

exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag: _tag,
			category,
			status,
			instructions: _instructions,
		} = req.body;

		// Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage;

		// Convert the tag and instructions from stringified Array to Array
		const tag = JSON.parse(_tag)
		const instructions = JSON.parse(_instructions)
	
		console.log("tag", tag)
		console.log("instructions", instructions)
		console.log("thumbnail", thumbnail)

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag.length ||
			!thumbnail ||
			!category ||
			!instructions.length
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the Category given is valid
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);

		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status,
			instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

// Edit Course Details
exports.editCourse = async (req, res) => {
	try{
		const {courseId} = req.body
		const updates = req.body
		const course = await Course.findById(courseId)

		if (!course) {
			return res.status(404).json({ error: "Course not found" })
		}
	
		// If Thumbnail Image is found, update it
		if (req.files) {
			console.log("thumbnail update")
			const thumbnail = req.files.thumbnailImage
			const thumbnailImage = await uploadImageToCloudinary(
				thumbnail,
				process.env.FOLDER_NAME
			)
			course.thumbnail = thumbnailImage.secure_url
		}

		// Update only the fields that are present in the request body
		for(const key in updates){
			if(updates.hasOwnProperty(key)){
				if(key === 'tag' || key === 'instructions'){
					course[key] = JSON.parse(updates[key])
				}else{
					course[key] = updates[key]
				}
			}
		}

		await course.save()

		const updatedCourse = await Course.findOne({
			_id:courseId,
		})
		.populate({
			path: 'instructor',
			populate: {
				path: 'additionalDetails',
			},
		})
		.populate('category')
		.populate('ratingAndReviews')
		.populate({
			path: 'courseContent',
			populate: {
				path: 'subSection',
			},
		})
		.exec()

		res.json({
			success: true,
			message: "Course updated successfully",
			data: updatedCourse,
		})

	}catch (error) {
		console.error(error)
		res.status(500).json({
		  success: false,
		  message: "Internal server error",
		  error: error.message,
		})
	}
}

// get all courses handler fuinction
exports.showAllCourse = async (req,res) => {
    try{
        // fetch data
        const allCourse = await Course.find(
			{ status: "Published"},
			{
				courseName:true,
				price:true,
				thumbnail:true,
				instructor:true,
				ratingAndReviews:true,
				studentsEnrolled:true,
			}
		)
		.populate("instructor")
		.exec()
		
        return res.status(200).json({
            success:true,
            data:allCourse,
            message:"Data successfully fetched"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch data error: ${error}`
        })
    }
}

// getcourseDetails
exports.getCourseDetails = async (req,res) => {
    try{
        // get id
        const {courseId} = req.body
        // find course details
        const courseDetails = await Course.findOne(
            {_id:courseId}
        )
        .populate(
            {
                path:"instructor",
                populate:{
                    path:"additionalDetails"
                }
            }
        )
        .populate("category")
        .populate("ratingAndReviews")
        .populate(
            {
                path:"courseContent",
                populate:{
                    path:"subSection",
					select: "-videoUrl",
                }
            }
        )
        .exec()

        // validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`could not find the course with id: ${courseId}`
            })
        }

		let totalDurationInSeconds = 0
		courseDetails.courseContent.forEach((content) => {
			content.subSection.forEach((subSection) => {
				const timeDurationInSeconds = parseInt(subSection.timeDuration)
				totalDurationInSeconds += timeDurationInSeconds
			})
		})
		const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success:true,
            data:{
				courseDetails,
				totalDuration
			},
            message:"Course details fetched sucessfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch data in getCourseDetails error: ${error}`
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {
	try{
		const { courseId } = req.body
    	const userId = req.user.id

		const courseDetails = await Course.findOne({
			_id: courseId,
		  })
			.populate({
			  path: "instructor",
			  populate: {
				path: "additionalDetails",
			  },
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
			  path: "courseContent",
			  populate: {
				path: "subSection",
			  },
			})
			.exec()

		let courseProgressCount = await CourseProgress.findOne({
			courseId: courseId,
			userId: userId,
		})
	
		if (!courseDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			})
		}

		let totalDurationInSeconds = 0

		courseDetails.courseContent.forEach((content) => {
			content.subSection.forEach((subSection) => {
				const timeDurationInSeconds = parseInt(subSection.timeDuration)
				totalDurationInSeconds += timeDurationInSeconds
			})
		})

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

		return res.status(200).json({
		success: true,
		data: {
			courseDetails,
			totalDuration,
			completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
			},
		})
	}catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
	try{
		const instructorId = req.user.id
		const instructorCourses = await Course.find({
			instructor: instructorId,
		}).sort({ createdAt: -1 })
		// Return the instructor's courses
		res.status(200).json({
			success: true,
			data: instructorCourses,
		  })
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: "Failed to retrieve instructor courses",
			error: error.message,
		})
	}
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
	try{
		const { courseId } = req.body
		// Find the course
		const course = await Course.findById(courseId)
		if(!course){
			return res.status(404).json({ message: "Course not found" })
		}
		// Unenroll students from the course
		const studentsEnrolled = course.studentsEnrolled
		for(const studentId of studentsEnrolled){
			await User.findByIdAndUpdate(studentId,{
				$pull: { course: courseId },
			})
		}

		// Delete sections and sub-sections
		const courseSections = course.courseContent
		for(const sectionId of courseSections){
			const section = await Section.findById(sectionId)
			if(section){
				const subSections = section.subSection
				for(const subSectionId of subSections){
					// Delete sub-sections of the section
					await SubSection.findByIdAndDelete(subSectionId)
				}
			}
			// Delete the section
			await Section.findByIdAndDelete(sectionId)
		}
		
		// Delete the course
		await Course.findByIdAndDelete(courseId)
		return res.status(200).json({
			success: true,
			message: "Course deleted successfully",
		})
		
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message,
		})
	}
}