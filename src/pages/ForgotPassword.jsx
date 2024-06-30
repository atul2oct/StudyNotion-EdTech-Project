import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getPasswordResetToken } from '../services/operations/authAPI'
import { BiArrowBack } from "react-icons/bi"

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const {loading} = useSelector(state => state.auth)
  // email send hoa hai ki nhi flag
  const [emailSend,setEmailSend] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  // kaun sa email
  const [email,setEmail] = useState("")

  const handleClick = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2*60*1000); // 2 minutes in milliseconds
    handleOnSubmit()
  };

  const handleOnSubmit = (event) => {
    event.preventDefault()
    dispatch(getPasswordResetToken(email,setEmailSend))
  }

  useEffect(() => {
    let timer;
    if (isButtonDisabled) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000); // Update every second
    } else {
      setRemainingTime(120); // Reset remaining time when button is enabled
    }
    return () => clearInterval(timer);
  }, [isButtonDisabled]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className='flex flex-col justify-center items-center m-auto
    max-w-lg min-h-[calc(100vh-4rem)] p-12'>
      {
        loading ? (<div>Loading ...</div>) 
        : (
          <div className='flex flex-col justify-center'>
            <h1 className='text-richblack-5 text-3xl font-semibold'>
              {
                !emailSend ? "Reset your password" : "Check email"
              }
            </h1>
            <p className='text-lg mt-4 text-richblack-100'>
              {
                !emailSend ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" 
                : `We have sent the reset email to ${email}`
              }
            </p>
            <form className='w-full flex flex-col gap-y-4 mt-6'
            onSubmit={handleOnSubmit}>
              {
                !emailSend && (
                  <label>
                    <p className='text-richblack-5 mb-1 text-sm'>
                    Email Address<sup className='text-pink-200'>*</sup></p>
                    <input
                      type='text'
                      required
                      name='email'
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      placeholder='Enter Your Email Address'
                      className='form-style w-full'
                    />
                  </label>
                )
              }
              {isButtonDisabled && (
                <div className='text-richblack-5'>
                  Remaining time: {minutes} min {seconds} sec
                </div>
              )}
              <button className={`${isButtonDisabled ? "bg-richblack-400 cursor-not-allowed":"bg-yellow-50"} rounded-lg py-2 mt-6 px-3 font-medium text-richblack-900`}
              type='submit'
              onClick={handleClick}
              disabled={!emailSend ? false : isButtonDisabled}
              >
                {
                  !emailSend ? "Reset Password" : "Resend email"
                }
              </button>
            </form>
            <div>
              <Link to='/login'>
                <p className='flex items-center gap-x-2 text-md mt-4 text-richblack-100'>
                  <BiArrowBack /> Back To Login
                </p>
              </Link>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ForgotPassword