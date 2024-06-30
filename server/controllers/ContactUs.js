const contactUsEmail = require("../mail/templates/contactFormRes.js");
const mailSender = require('../utils/mailSender')

exports.contactUsController = async (req, res) => {
    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
    console.log(req.body)
    try {
      const emailRes = await mailSender(
        email,
        "Your Data send successfully",
        contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
      )
      console.log("Email Res ", emailRes)
      // return response
      return res.status(200).json({
        success:true,
        message:`Email sent successfully`
    })
    } catch (error) {
      console.log("Error", error)
      console.log("Error message :", error.message)
      return res.status(500).json({
        success:false,
        message:`Something went wrong in while contact us mail send error: ${error}`
    })
      
    }
  }