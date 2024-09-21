const express = require('express')
const app = express()

const userRouter = require('./routes/User')
const profileRouter = require('./routes/Profile')
const paymentRouter = require('./routes/Payments')
const courseRouter = require('./routes/Course')
const contactUsRoute = require("./routes/Contact");

const database = require('./config/database')
const cookieParser = require('cookie-parser')
// 10:18 cors explain
const cors = require('cors')//front end ki request ko backend entertain kre
const {cloudinaryConnect} = require('./config/cloudinary')
const fileupload = require('express-fileupload')
require('dotenv').config()

const PORT = process.env.PORT || 4000 

// database connect
database.connect()

// middleware
app.use(express.json())
app.use(cookieParser())

app.use(
    cors({//deep dive why credentials:true ?
        origin: "*",
        credentials:true,            //access-control-allow-credentials:true
    })
)

app.use(
    fileupload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)
// cloudinary Connection
cloudinaryConnect()

// routes
app.use("/api/v1/auth",userRouter)
app.use("/api/v1/profile",profileRouter)
app.use("/api/v1/payment",paymentRouter)
app.use("/api/v1/course",courseRouter)
app.use("/api/v1/reach", contactUsRoute);
// http://localhost:4000/api/v1/course

// default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"server is up and running..."
    })
})

app.listen(PORT,()=>{
    console.log(`App is running at port no.: ${PORT}`)
})
// bcryptjs crypto-random-string node-schedule