const Category = require('../models/Category')
function getRandomInt(max){
    return Math.floor(Math.random() * max)
}
// create Category ka handler function
exports.createCategory = async(req,res) => {
    try{
        // fetch data
        const {name,descritption} = req.body

        // validation
        if(!name){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        // create entry in DB
        const CategoryDetails = await Category.create({name,descritption})

        // return response
        return res.status(200).json({
            success:true,
            message:"Category creation successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong while Category creation error: ${error}`
        })
    }
}

// Gat all Category handler fuinction
exports.showAllCategory = async(req,res) => {
    try{
        // create entry in DB
        // find krna chahte hai find k liye koi input nhi hai toh all entry aa jaegi
        // but make sure krna name and descrition present hona chaheye  
        // const allCategory = await Category.find(
        //     {},
        //     {name:true,descritption:true}
        // )
        const allCategory = await Category.find({})

        // return response
        return res.status(200).json({
            success:true,
            data:allCategory,
            message:"All Category are fetched successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong while fetching Category error: ${error}`
        })
    }
}

// category page details
exports.categoryPageDetails = async (req,res) => {
    try{
        // get category id
        const {categoryId} = req.body

        // get all courses coresponding to this category id
        const selectedCategory = await Category.findById(categoryId)
                                .populate({
                                    path: "courses",
                                    match: { status: "Published" },
                                    populate: "ratingAndReviews",
                                }).exec()
        // validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }

        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
            })
        }

        // get courses for different categories
        const categoriesExceptSelected = await Category.find({
            _id: {$ne: categoryId},//not equal to this id
        })

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        )
        .populate({
            path: "courses",
            match: {status: "Published"},
        })
        .exec()

        // Get top-selling courses across all categories
        const allCategories = await Category.find()
        .populate({
            path: 'courses',
            match: { status: 'Published' },
            populate: {
                path: 'instructor',
            }
        })
        .exec()

        const allCourses = allCategories.flatMap((category)=>category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory, differentCategory, mostSellingCourses
            },
            message:"Successful get details"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong in category page details error: ${error}`
        })
    }
}