import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input'
import { useDispatch, useSelector } from 'react-redux'
import { sendOtp, signUp } from '../services/operations/authAPI'
import { Link, useNavigate } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi"
import HighlightText from '../components/core/HomePage/HighlightText'

const VerifyEmail = () => {
    const {signupData,loading} = useSelector(state=>state.auth)
    const [otp,setOtp] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=> {
        if(!signupData){
            navigate('/signup')
        }
    },[])

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signupData
        dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate))

    }
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading ? (<div className='text-richblack-5 text-3xl font-semibold text-center'>Loading ... </div>) 
            : (
                <div>
                    <h1 className='text-richblack-5 text-3xl font-semibold'>Verify email</h1>
                    <p className='text-lg mt-4 text-richblack-100'>A verification code has been sent to you. Enter the code below</p>
                    <form className='w-full flex flex-col gap-y-4 mt-6' onSubmit={handleOnSubmit}>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            containerStyle={{
                                justifyContent: "space-between",
                                gap: "0 6px",
                            }}
                            renderInput={(props) => <input
                                {...props}
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                            />}
                        />
                        <button className="bg-yellow-50 rounded-lg py-2 mt-6 px-3 font-medium text-richblack-900"
                            type='submit'>Verify email</button>
                    </form>
                    <div className='flex justify-between'>
                        <div>
                            <Link to='/login'>
                                <p className='flex items-center gap-x-2 text-md mt-4 text-richblack-100'>
                                <BiArrowBack /> Back To Login
                                </p>
                            </Link>
                        </div>
                        <button onClick={()=>dispatch(sendOtp(signupData.email,navigate))}>
                            <p className='bg-gradient-to-b from-highlight-1 via-highlight-2 to-highlight-3 text-transparent bg-clip-text'>Resend it</p>
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail