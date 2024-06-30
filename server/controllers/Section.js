const Section = require('../models/Sections')
const Course = require('../models/Course')
const { populate } = require('../models/Category')
const SubSection = require('../models/SubSection')

exports.createSection = async (req,res) => {
    try{
        // data fetch
        const {sectionName,courseId} = req.body
        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        // create section
        const newSection = await Section.create({sectionName})
        // update course with section ObjectId 
        // Add the new section to the course's content array
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{courseContent:newSection._id},
            },
            {new:true}
            )
            .populate({
                path:"courseContent",
                populate:{
                    path: "subSection"
                }
            })
            // hw->populate section and subsection in updatedCourse
        // return response
        return res.status(200).json({
            success:true,
            updatedCourse, 
            message:"section created successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to create section error: ${error}`
        })
    }
}

// updateSection
exports.updateSection = async (req,res) => {
    try{
        // data fetch
        const {sectionName, sectionId, courseId} = req.body

        // data validation
        if(!sectionName || !sectionId || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }

        // update section
        const updatedSection = await Section.findByIdAndUpdate( sectionId, {sectionName}, {new:true})

        // update course
        const updatedCourse = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec()
        // return response
        return res.status(200).json({
            success:true,
            data:updatedCourse, 
            message:"section updated successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to update section error: ${error}`
        })
    }
}

// delete Section
exports.deleteSection = async (req,res) => {
    try{
        // data fetch
        // get Id - asssuming that we are sending id in params

    // routers -> router.post("/deleteSection", auth, isInstructor, deleteSection)
    // /deleteSection?sectionId=123&courseId=456 -> req.query

    // routers -> router.post("/deleteSection/:sectionId/:courseId", auth, isInstructor, deleteSection)
    // deleteSection/123/456 -> req.params
    
        // const {sectionId,courseId} = req.params//h.w req.param se test krna


        const { sectionId, courseId }  = req.body;
        // data validation
        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }

        // find by id and delete the section
        const section = await Section.findById(sectionId)
        
        await SubSection.deleteMany({_id: {$in:section.subSection}})

        await Section.findByIdAndDelete(sectionId)

        // TODO[testing]:do we need to delete sectionId from course schema?? yes
        await Course.findByIdAndUpdate(
            courseId,
            {$pull:{courseContent:sectionId}}
        )
        //find the updated course and return 
		const course = await Course.findById(courseId)
        .populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();
        // return response
        return res.status(200).json({
            success:true,
            data:course,
            message:"section deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to delete section error: ${error}`
        })
    }
}