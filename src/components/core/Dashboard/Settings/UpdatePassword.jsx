import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../../../../services/operations/SettingsAPI'
import IconBtn from '../../../common/IconBtn'

const UpdatePassword = () => {

  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    console.log("password Data - ", data)
    try {
      dispatch(changePassword(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className='border-[1px] border-richblack-700 bg-richblack-800 flex flex-col rounded-md p-8 px-12 my-10 gap-x-5'>

        <h2 className="text-lg font-semibold text-richblack-5 mb-6">
          Password
        </h2>
        <div className='flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-y-5'>

          <label className='relative w-full lg:w-[48%]'>
            <p className='text-richblack-5 mb-1 text-sm'>
            Current Password<sup className='text-pink-200'>*</sup>
            </p>
            <input
            type={showPassword ? 'text' : 'password'}
              placeholder='Enter Password'
              name="oldPassword"
              className='form-style bg-richblack-700 w-full'
              {...register("oldPassword", { required: true })}
            />
            <span onClick={() => setShowPassword(prev => !prev)}
            className='absolute cursor-pointer right-3 top-9'>
              {
                showPassword ? <AiOutlineEye fontSize={24} fill="#AFB2BF" /> : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              }
            </span>
            {
              errors.oldpPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )
            }
          </label>

          <label className='relative w-full lg:w-[48%]'>
            <p className='text-richblack-5 mb-1 text-sm'>
              Change Password<sup className='text-pink-200'>*</sup>
            </p>
            <input
            type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Enter Password'
              name="newPassword"
              className='form-style bg-richblack-700 w-full'
            />
            <span onClick={() => setShowConfirmPassword(prev => !prev)}
            className='absolute cursor-pointer right-3 top-9'>
              {
                showConfirmPassword ? <AiOutlineEye fontSize={24} fill="#AFB2BF" /> : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              }
            </span>
            {
              errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )
            }
          </label>

          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update"/>
        </div>
      </form>
    </>
    
  )
}

export default UpdatePassword