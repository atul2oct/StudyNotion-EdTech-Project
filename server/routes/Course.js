const express = require('express')
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
    createCourse,
    showAllCourse,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
  } = require('../controllers/Course')

// Categories Controllers Import
const {createCategory, showAllCategory, categoryPageDetails} = require('../controllers/Category')

// Sections Controllers Import
const {createSection, updateSection, deleteSection} = require('../controllers/Section')

// Sub-Sections Controllers Import
const {createSubSection, updateSubSection, deleteSubSection} = require('../controllers/Subsection')

// Rating Controllers Import
const {createRating, getAverageRating, getAllRating} = require('../controllers/RatingAndReview')

// update Course Progress Controllers Import
const {updateCourseProgress} = require("../controllers/courseProgress");
// Import the required middleware functions
const {auth, isStudent, isInstructor, isAdmin} = require('../middleware/Auth')

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
// router.post("/deleteSection/:sectionId/:courseId", auth, isInstructor, deleteSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", showAllCourse)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)
// update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

// Export the router for use in the main application
module.exports = router