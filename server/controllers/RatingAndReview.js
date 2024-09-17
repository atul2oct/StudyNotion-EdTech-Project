const RatingAndReview = require('../models/RatingAndReview')
const Course = require('../models/Course')
const { default: mongoose } = require('mongoose')

// create Rating And Review
exports.createRating = async (req,res) => {
    try{
        // get user id
        const userId = req.user.id
        // fetch data from req body
        const {rating,review,courseId} = req.body

        // check if user enrolled or not
        const courseDetails = await Course.findOne(
            {   _id:courseId,
                studentsEnrolled: {$elemMatch: {$eq: userId}},//studentsEnrolled == userId wo wla course dedo
            }
        )

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in course"
            })
        }

        // check if user is already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        })

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewed by the user"
            })
        }

        // create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId
        })
        
        // update the course with rating and review
        const UpdatedCourse = await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingAndReviews:ratingReview._id
                }
            },
            {new:true}
        )
            
        // return response
        return res.status(200).json({
            success:true,
            ratingReview,
            message:"Successfully created the rating and reviews"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch data error: ${error}`
        })
    }
}
// get average Rating
exports.getAverageRating = async (req,res) => {
    try{
        // get course id
        const {courseId} = req.body
        // calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "Rating"}
                }
            }
        ])
        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        // if no rating review exist
        else{
            return res.status(200).json({
                success:true,
                message:"Average rating is zero no rating is given till now"
            })
        }
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in avg rating error: ${error}`
        })
    }
}
// get all Rating And Review
exports.getAllRating = async (req,res) =>{
    try{
        const allReviews = await RatingAndReview.find().sort({rating: "desc"})
            .populate({
                path:"user",
                select: "firstName lastName email image"
            })
            .populate({
                path:"course",
                select:"courseName"
            })
            .exec()

            return res.status(200).json({
                success:true,
                allReviews,
                message:"All review fetched successfully"
            })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in avg rating error: ${error}`
        })
    }
}