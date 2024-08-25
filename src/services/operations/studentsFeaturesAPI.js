import toast from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY
const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints

function loadScript(src){
    return new Promise((resolve)=>{
        const script = document.createElement("script")
        script.src = src;

        script.onload = ()=>{
            resolve(true)
        }
        script.onerror = ()=>{
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch){
    const toastId = toast.loading("Loading...")

    try{
        // load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!res){
            toast.error("RazorPay SDK failed to load")
            return
        }
        // inital the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses}, {
            Authorization: `Bearer ${token}`,
        })
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }
        console.log("PRINTING orderResponse", orderResponse);
        console.log("PRINTING orderResponse currency", orderResponse.data.data.currency);
        console.log("PRINTING orderResponse amount", typeof(`${orderResponse.data.data.amount}`));
        console.log("PRINTING orderResponse order id", orderResponse.data.data.id);
        console.log("PRINTING orderResponse order id", typeof(orderResponse.data.data.id));
        
        // options
        const options = {
            // key: RAZORPAY_KEY,
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            // order_id: orderResponse.data.data.amount.toString(),
            name:"StudyNotion",
            description:"Thank You for Purchasing the Course",
            image:'https://api.dicebear.com/5.x/initials/svg?seed=StudyNotion',
            prefill:{
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email
            },
            handler: function(response){
                // send successfull wla mail
                console.log('6')
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
                // verify payment
                console.log('7')
                verifyPayment({...response, courses}, token, navigate,dispatch)
                console.log('8')
            },
        }
        console.log('9',options)
        // dialogue box open
        const paymentObject = new window.Razorpay(options)
        console.log('19')
        paymentObject.open()
        console.log('20')
        paymentObject.on("payment.failed",function(response){
            toast.error('oops, payment failed')
            console.log("could not make payment",response.error)
        })
        console.log('21')
    }catch(error){
        console.log("Payment Api Error")
        toast.error("Could not make payment")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token){
    try{
        console.log('10')
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
        console.log('Payment success email sent');
    }catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR....",error)
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch){
    console.log('12')
    const toastId = toast.loading('Verifing Payment...')
    dispatch(setPaymentLoading(true))
    
    try{
        console.log("bodyData",bodyData)
        console.log("token",token)
        console.log('13')
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })
        console.log('14')
        
        console.log("verifyPayment response:",response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        console.log('15')
        toast.success("payment Successful, you are added to the course")
        console.log('16')
        navigate('/dashboard/enrolled-courses')
        console.log('17')
        dispatch(resetCart())
        console.log('18')

    }catch(error){
        console.log("Payment verify Error",error)
        toast.error('Could not verify Payment')
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false))
}