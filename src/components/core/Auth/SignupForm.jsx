import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useNavigate } from 'react-router-dom'
import { ACCOUNT_TYPE } from '../../../utils/constants'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { sendOtp } from '../../../services/operations/authAPI'
import Tab from '../../common/Tab'
import { setSignupData } from '../../../slices/authSlice'

const SignupForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // student or instructor
  const [accountType,setAccountType] = useState(ACCOUNT_TYPE.STUDENT)
  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    confirmPassword:""
  })
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {firstName, lastName, email, password, confirmPassword} = formData

  // Handle input fields, when some value changes
  function changeHandler(event){
    setFormData(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  // handle form Submition
  const handleOnSubmit = (event) => {
    event.preventDefault()

    if(password !== confirmPassword){
      toast.error('Password mismatch')
      return
    }

    const signupData = {
      ...formData,
      accountType
    }
    // setting signup data to store
    // to be used after otp verification
    dispatch(setSignupData(signupData))
    dispatch(sendOtp(signupData.email,navigate))

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }

  // data to pass to tab component
  const tabData = [
    {
      id:1,
      tabName:'Student',
      type:ACCOUNT_TYPE.STUDENT,
    },
    {
      id:2,
      tabName:'Instructor',
      type:ACCOUNT_TYPE.INSTRUCTOR,
    },
  ]
  return (
    <div>
    {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType}/>
    {/* form */}
      <form className='w-full max-w-max flex flex-col gap-y-4 mt-6'
      onSubmit={handleOnSubmit}>

        {/* Name */}
        <div className='flex gap-x-4'>
          <label>
            <p className='text-richblack-5 text-sm mb-1'>First Name<sup className='text-pink-200'>*</sup></p>
            <input
              type='text'
              placeholder='Enter first name'
              name='firstName'
              value={firstName}
              onChange={changeHandler}
              className='form-style w-full'
            />
          </label>
          <label>
            <p className='text-richblack-5 text-sm mb-1'>Last Name<sup className='text-pink-200'>*</sup></p>
            <input
              type='text'
              placeholder='Enter last name'
              name='lastName'
              value={lastName}
              onChange={changeHandler}
              className='form-style w-full'
            />
          </label>
        </div>
        {/* email address */}
        <label className='flex flex-col'>
          <p className='text-richblack-5 mb-1 text-sm'>
            Email Address<sup className='text-pink-200'>*</sup>
          </p>
          <input
          type='text'
            placeholder='Enter email address'
            name="email"
            value={email}
            onChange={changeHandler}
            className='form-style'
          />
        </label>

        {/* password */}
        <div className='flex gap-x-4'>

          <label className='relative'>
            <p className='text-richblack-5 mb-1 text-sm'>
              Create Password<sup className='text-pink-200'>*</sup>
            </p>
            <input
            type={showPassword ? 'text' : 'password'}
              placeholder='Enter Password'
              name="password"
              value={password}
              onChange={changeHandler}
              className='form-style'
            />
            <span onClick={() => setShowPassword(prev => !prev)}
            className='absolute cursor-pointer right-3 top-9'>
              {
                showPassword ? <AiOutlineEye fontSize={24} fill="#AFB2BF" /> : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              }
            </span>
          </label>

          <label className='relative'>
            <p className='text-richblack-5 mb-1 text-sm'>
              Confirm Password<sup className='text-pink-200'>*</sup>
            </p>
            <input
            type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Enter Password'
              name="confirmPassword"
              value={confirmPassword}
              onChange={changeHandler}
              className='form-style'
            />
            <span onClick={() => setShowConfirmPassword(prev => !prev)}
            className='absolute cursor-pointer right-3 top-9'>
              {
                showConfirmPassword ? <AiOutlineEye fontSize={24} fill="#AFB2BF" /> : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              }
            </span>
          </label>

        </div>
        {/* submit button */}
        <button className='bg-yellow-50 rounded-lg py-2 mt-6 px-3 font-medium
        text-richblack-900'
        type='submit'>
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupForm