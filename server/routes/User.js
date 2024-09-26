const express = require('express')
const router = express.Router()

// Import the required controllers and middleware functions
const {sendOTP, signUp, login, changePassword} = require('../controllers/auth');
const {resetPasswordToken, resetPassword} = require('../controllers/resetPassword');
const {auth} = require('../middleware/Auth');

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post('/login',login)

// Route for user signup
router.post('/signup',signUp)

// Route for send otp
router.post('/sendotp',sendOTP)

// Route for change password
router.post('/changepassword',auth,changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post('/reset-password-token',resetPasswordToken)

// Route for resetting user's password after verification
router.post('/reset-password',resetPassword)

// Export the router for use in the main application
module.exports = router

