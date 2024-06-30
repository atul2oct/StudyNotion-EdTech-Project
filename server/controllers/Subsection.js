const Section = require('../models/Sections')
const Subsection = require('../models/SubSection')
const { uploadImageToCloudinary } = require('../utils/imageUploader')

// create subsection
exports.createSubSection = async (req,res) => {
    try{
        // fetch data
        const {title,description,SectionId} = req.body
        // extract file/video
        const videoUrl = req.files.videoFile
        // vaildation data
        if(!title || !description|| !videoUrl || !SectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(videoUrl,process.env.FOLDER_NAME)
        
        // create entry subsection
        const SubSectionDetails = await Subsection.create({
            title,
            timeDuration: `${uploadDetails.duration}`,
            description,
            videoUrl:uploadDetails.secure_url
        })
        
        // update section with subsection OnjectId
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:SectionId},
            {
                $push:{subSection:SubSectionDetails._id}
            },
            {new:true}
        )
        .populate('subSection')
        
        // hw- log updated Section here, after adding populate query
        // return response
        return res.status(200).json({
            success:true,
            data:updatedSection, 
            message:"sub-section updated successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            data:error.message,
            message:`Failed to update sub section error: ${error}`
        })
    }
}

// update subsection hw
exports.updateSubSection = async (req,res) => {
    try{
        const { sectionId,subSectionId, title, description } = req.body
        const subSection = await Subsection.findById(subSectionId)

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
              })
        }
        if (title !== undefined) {
            subSection.title = title
        }
    
        if (description !== undefined) {
            subSection.description = description
        }

        if(req.files && req.files.video !== undefined){
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = uploadDetails.duration
        }
        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate('subSection')

        return res.json({
            success: true,
            data:updatedSection,
            message: "Section updated successfully",
          })
    }catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while updating the section",
        })
      }
    
}
//HW:deleteSubSection
exports.deleteSubSection = async (req,res)=>{
    try{
        // fetch data
        const {SubSectionId, sectionId} = req.body
        // vaildation data
        if(!SubSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Id is required"
            })
        }
        // delete entry subsection
        const subsection = await Subsection.findByIdAndDelete(SubSectionId)
        if(!subsection){
            return res.status(404).json({
                success:false,
                message:"unable to delete subsection"
            })
        }
        // TODO[testing]:do we need to delete SubSectionId from section schema??
        const section = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{subSection:SubSectionId}
            }
        )
        const updatedSubSection = await Section.findById(sectionId).populate('subSection')
        // return response
        return res.status(200).json({
            success:true,
            data:updatedSubSection,
            message:"sub-section deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Failed to delete sub section error: ${error}`
        })
    }
};