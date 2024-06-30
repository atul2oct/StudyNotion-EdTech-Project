import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../../services/operations/authAPI'

const LoginForm = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData,setFormData] = useState({email:"",password:""})
  const [showPassword,setShowPassword] = useState(false)

  const {email,password} = formData

  function changeHandler(event){
    setFormData(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handleOnSubmit = (event) => {
    event.preventDefault()
    dispatch(login(email,password,navigate))
  }
  return (
    <form onSubmit={handleOnSubmit}
      className='w-full flex flex-col gap-y-4 mt-6'>
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

      <label className='flex flex-col relative'>
        <p className='text-richblack-5 mb-1 text-sm'>
          Password<sup className='text-pink-200'>*</sup>
        </p>
        <input
        type={showPassword ? 'text' : 'password'}
          placeholder='Enter Password'
          name="password"
          value={password}
          onChange={changeHandler}
          className='!pr-10 form-style'
        />
        <span onClick={() => setShowPassword(prev => !prev)}
        className='absolute cursor-pointer right-3 top-9'>
          {
            showPassword ? <AiOutlineEye fontSize={24} fill="#AFB2BF" /> : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          }
        </span>
        <Link to='/forgot-password'>
          <p className='text-blue-100 text-xs mt-1 max-w-max ml-auto'>
            Forget password
          </p>
        </Link>
      </label>

      <button className='bg-yellow-50 rounded-lg py-2 mt-6 px-3 font-medium
      text-richblack-900'
      type='submit'>
        Sign in
      </button>
    </form>
  )
}

export default LoginForm