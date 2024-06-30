import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../../common/IconBtn'
import { updateProfile } from '../../../../services/operations/SettingsAPI'
const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

const EditProfile = () => {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log("user: ",user)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    try{
      dispatch(updateProfile(user, token, data))
    }catch(error){
      console.log("Error in Submiting form",error)
    }
  } 
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        <div className='border-[1px] border-richblack-700 bg-richblack-800 flex flex-col rounded-md p-8 px-12 my-10 gap-y-6 mt-10'>

        <h1 className='text-lg font-semibold text-richblack-5'>
          Profile Information
        </h1>

        <div className='flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-5'>
          <div className='flex flex-col gap-2 w-full lg:w-[48%]'>
            <label htmlFor='firstName' className='lable-style'>First Name</label>
            <input
              name='firstName' id='firstName' type='text' placeholder='Enter first name'
              className='form-style bg-richblack-700'
              {...register("firstName",{required:true})}
              defaultValue={user?.firstName}
            />
            {
              errors.firstName && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                  Please enter your first name.
                </span>
              )
            }
          </div>
          <div className='flex flex-col gap-2 w-full lg:w-[48%]'>
            <label htmlFor='lastName' className=''>Last Name</label>
            <input
              name='lastName' id='lastName' type='text' placeholder='Enter first name'
              className='form-style bg-richblack-700'
              {...register("lastName",{required:true})}
              defaultValue={user?.lastName}
            />
            {
              errors.lastName && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                  Please enter your last Name.
                </span>
              )
            }
          </div>
        </div>
        <div className='flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-5'>
          <div className='flex flex-col gap-2 w-full lg:w-[48%]'>
            <label htmlFor='dateOfBirth' className='lable-style'>Date of Birth</label>
            <input
              name='dateOfBirth' id='dateOfBirth' type='text' placeholder='Enter first name'
              className='form-style bg-richblack-700'
              {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Please enter your Date of Birth.",
                  },
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })
              }
              defaultValue={user?.additionalDetails?.dateOfBirth}
            />
            {
              errors.dateOfBirth && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                  Please enter your date of birth.
                </span>
              )
            }
          </div>
          <div className='flex flex-col gap-2 w-full lg:w-[48%]'>
            <label htmlFor='gender' className=''>Gender</label>
            <select
              name='gender' id='gender' type='text' placeholder='Enter Your gender'
              className='form-style bg-richblack-700'
              {...register("gender",{required:true})}
              defaultValue={user?.additionalDetails?.gender}
            >
              {
                genders.map((gender,index)=>(
                  <option key={index} value={gender}>
                    {gender}
                  </option>
                ))
              }
            </select>
            {
              errors.gender && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                  Please enter your gender.
                </span>
              )
            }
          </div>
        </div>
        <div className='flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-5'>
          <div className='flex flex-col gap-2 w-full lg:w-[48%]'>
            <label htmlFor='' className='label-style'>Contact Number</label>
            <input
              type='tel'
              name='contactNumber'
              id='contactNumber'
              placeholder='Enter your Contact Number'
              className='form-style bg-richblack-700'
              {...register("contactNumber", {
                  required: {
                    value: true,
                    message: "Please enter your Contact Number.",
                  },
                  maxLength: { value: 12, message: "Invalid Contact Number" },
                  minLength: { value: 10, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.additionalDetails?.contactNumber}
            />
            {errors.contactNumber && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.contactNumber.message}
                </span>
              )}
          </div>
          <div className='flex flex-col gap-2 w-full lg:w-[48%]'>
            <label htmlFor='about' className='label-style'>About</label>
            <input
              type='text'
              name='about'
              id='about'
              placeholder="Enter Bio Details"
              className='form-style bg-richblack-700'
              {...register("about", { required: true })}
                defaultValue={user?.additionalDetails?.about}
            />
            {
              errors.about && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your About.
                </span>
              )
            }
          </div>
        </div>
        </div>
        <div className='flex justify-end gap-2'>
          <button className='cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50'>Cancel</button>
          <IconBtn type="submit" text="Save"/>
        </div>
      </form>
    </>
  )
}

export default EditProfile