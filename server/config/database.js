const mongoose = require('mongoose')
require('dotenv').config()

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>console.log("DB connected successfully"))
    .catch((error) => {
        console.log(`DB connection failure error code: ${error}`)
        process.exit(1)
    })
}