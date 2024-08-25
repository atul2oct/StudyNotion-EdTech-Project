const {instance} = require('../config/razorpay')
const Course = require('../models/Course')
const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail')
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require('../mail/templates/paymentSuccessEmail')
const crypto = require("crypto");
const CourseProgress = require('../models/CourseProgress')

// initiate the Razorpay order
exports.capturePayment = async (req,res) => {
    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0){
        return res.json({
            success:false,
            message:'Please provide Course Id'
        })
    }
    console.log('...................................................................................................................')

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id)

            if(!course){
                return res.status(200).json({
                    success:false,
                    message:'Could not find the course'
                })
            }
            // const uid = mongoose.Types.ObjectId(userId);
            const uid = new mongoose.Types.ObjectId(userId)

            if(course.studentsEnrolled.includes(uid)){
                console.log('h')
                return res.status(200).json({
                    success:false,
                    message:'Student is already enrolled'
                })
            }
            totalAmount += course.price
        }catch(error){
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
            })            
        }
    }
    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
      }
    
    try{
        const paymentResponse = await instance.orders.create(options);
        console.log('paymentResponse : ',paymentResponse)
        
        res.json({
            success:true,
            data:paymentResponse,
            message:'Success in capture payment'
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Could not initiate order'
        })  
    }
}

// verify signature of razorpay and server
exports.verifySignature = async (req,res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;
    
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(404).json({
            success:false,
            message:"Payment Failed"
        })
    }
    
    let body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex')

        if(expectedSignature === razorpay_signature){
            // enroll karawo student ko
            await enrolledStudent(courses,userId, res)
            // return res
            return res.status(200).json({
                success:true,
                message:"Payment Verified"
            })

        }
        
        return res.status(400).json({
            success:false,
            message:"Payment failed"
        })
}

const enrolledStudent = async(courses, userId, res) => {
    
        if(!courses || !userId){
            return res.status(400).json({
                success:false,
                message:"Please Provide Course ID and User ID"
            })
        }

        for(const courseId of courses){
            try{
                // find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                    {_id:courseId},
                    {$push:{studentsEnrolled:userId}},
                    {new:true},
                )

                if(!enrolledCourse){
                    return res.status(500).json({
                        success:false,
                        message:"Courses not found"
                    })
                }

                const courseProgress = await CourseProgress.create({
                    courseId:courseId,
                    userId:userId,
                    completedVideos: [],
                })

                // find the student and add the course to their list of enrolledCourses
                const enrolledStudent = await User.findByIdAndUpdate(userId,
                    {$push:{
                        courses:courseId,
                        courseProgress:courseProgress._id,

                    }},
                    {new:true}
                )

                console.log("Updated course: ", enrolledCourse)

                // send mails to students
                const emailResponse = await mailSender(
                                    enrolledStudent.email,
                                    "Congratulation from codehelp",
                                    `Successfully Enrolled into ${enrolledCourse}`,
                                    courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`)
                )
                console.log(`successfully to verifySignature from Razorpay order and enrolled in course`)
                
            }catch(error){
                return res.status(500).json({
                    success:false,
                    message:`Failed to verifySignature the Razorpay order error: ${error}`
                })
            }
        }
}

exports.sendPaymentSuccessEmail = async (req,res) => {
    
    const {orderId, paymentId, amount} = req.body
    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success:false,
            message:"Please provide all the fields"
        })
    }
    
    try{
        // find the student
        
        const enrolledStudent = await User.findById(userId)
        
        await mailSender(
            enrolledStudent.email,
            `Payment recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
                amount/100,
                orderId,
                paymentId
            )
        )
        console.log("send Payment SuccessEmail")
        
    }catch(error){
        console.log("error in sending mail",error)
        return res.status(500).json({
            success:false,
            message:"Could not send email"
        })
    }
}

// // capture the payment and initiate the Razorpay order
// exports.capturePayment = async(req,res) => {
//     // get courseId and UserId
//     const {course_id} = req.body
//     const userId = req.user.id
//     // vaildation
//     // vaild courseID
//     if(!course_id){
//         return res.status(404).json({
//             success:false,
//             message:"please provide course id"
//         })
//     }
//     // Vaild course details
//     let course;
//     try{
//         course = await Course.findById(course_id)
//         if(!course){
//             return res.status(404).json({
//                 success:false,
//                 message:"Could'nt find the course"
//             })
//         }
        
//         // user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId)//convert string to object id
//         // const uid = mongoose.Types.ObjectId(userId)// by this way it not depricated
        
//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(404).json({
//                 success:false,
//                 message:"student is slready enrolled"
//             })
//         }
//     }catch(error){
//         return res.status(500).json({
//             success:false,
//             message:`Failed to Vaild course details error: ${error}`
//         })
//     }
    
//     // order create
//     const amount = course.price
//     const currency = 'INR' 

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes: {
//             courseId: course_id,
//             userId,
//         }
//     }

//     try{
//         // initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options)
//         console.log(paymentResponse)
//         // return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDeccription:course.courseDeccription,
//             thumbnail:course.thumbnail,
//             ordrId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//             message:`successfully initiate the Razorpay order`
//         })
//     }catch(error){
//         return res.status(500).json({
//             success:false,
//             message:`Failed to initiate the Razorpay order error: ${error}`
//         })
//     }
    
// }

// // verify signature of razorpay and server
// exports.verifySignature = async (req,res) => {
//     const wekHookSecret = '12345678';

//     const signature = req.headers["x-razorpay-signature"]

//     const shasum = crypto.createHmac("sha256",wekHookSecret)
//     shasum.update(JSON.stringify(req.body))
//     const digest = shasum.digest('hex')

//     if(signature === digest){
//         console.log("Payment is Authorised")

//         const {courseId, userId} = req.body.payload.entity.notes

//         try{
//             // fulfill tha action
//             // find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 {_id:courseId},
//                 {$push:{studentsEnrolled:userId}},
//                 {new:true}
//             )
//             if(!enrolledCourse){
//                 return res.status(404).json({
//                     success:false,
//                     message:"Could'nt find the course"
//                 })
//             }
//             console.log(enrolledCourse)
//             // find the student and add the course to their list enrooled courses me
//             const enrolledStudent = await User.findOne(
//                 {_id:userId},
//                 {$push:{courses:courseId}},
//                 {new:true}
//             )
//             console.log(enrolledStudent)
//             // confirmation mail
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulation from codehelp",
//                 "Congratulation, you are onboarded into new CodeHelp"
//             )
//             console.log(emailResponse)
//             return res.status(200).json({
//                 success:true,
//                 message:`successfully to verifySignature from Razorpay order and enrolled in course`
//             })
//         }catch(error){
//             return res.status(500).json({
//                 success:false,
//                 message:`Failed to verifySignature the Razorpay order error: ${error}`
//             })
//         }
//     }else{
//         return res.status(400).json({
//             success:false,
//             message:`invalid request Failed to verifySignature the Razorpay order`
//         })
//     }
// }

