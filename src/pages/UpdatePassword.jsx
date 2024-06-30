import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { resetPassword } from '../services/operations/authAPI'
import { useLocation, useNavigate } from 'react-router-dom'

const UpdatePassword = () => {
    const dispatch = useDispatch()
    const {loading} = useSelector(state => state.auth)
    const navigate = useNavigate()
    const location = useLocation()

    const [formData,setFormData] = useState({password:"", confirmPassword:""})
    const {password, confirmPassword} = formData

    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleOnChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        console.log("location path name: ",location.pathname)
        console.log("token: ",location.pathname.split('/').at(-1))
        const token = location.pathname.split('/').at(-1)
        dispatch(resetPassword(password, confirmPassword, token, navigate))
    }
  return (
    <div>
        {
            loading ? (<div>Loading ... </div>)
            :(
                <div className='flex flex-col justify-center items-center m-auto max-w-lg min-h-[calc(100vh-4rem)] p-12'>
                    <h1 className='text-richblack-5 text-3xl font-semibold'>Choose  new password</h1>
                    <p className='text-lg mt-4 text-richblack-100'>Almost done. Enter your new password and youre all set.</p>
                    <form className='w-full flex flex-col gap-y-4 mt-6' onSubmit={handleOnSubmit}>
                        <label className='relative'>
                            <p className='text-richblack-5 mb-1 text-sm'>
                            New password<sup className='text-pink-200'>*</sup></p>
                            <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            name='password'
                            value={password}
                            onChange={handleOnChange}
                            placeholder='Enter Your Password'
                            className='form-style w-full'
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
                            Confirm New password<sup className='text-pink-200'>*</sup></p>
                            <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={handleOnChange}
                            placeholder='Enter Your Confirm Password'
                            className='form-style w-full'
                            />
                            <span onClick={() => setShowConfirmPassword(prev => !prev)}
                            className='absolute cursor-pointer right-3 top-9'>
                            {
                                showConfirmPassword ? <AiOutlineEye fontSize={24} fill="#AFB2BF" /> : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            }
                            </span>
                        </label>
                        <button className="bg-yellow-50 rounded-lg py-2 mt-6 px-3 font-medium text-richblack-900"
                            type='submit'>Reset Password</button>
                    </form>
                </div>
                
            )
        }
    </div>
  )
}

export default UpdatePassword