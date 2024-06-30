import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'
import { RiEditBoxLine } from "react-icons/ri"

const MyProfile = () => {
  const {user} = useSelector(state=>state.profile)
  const navigate = useNavigate()
  return (
    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
      <h1 className='text-richblack-5 mb-14 text-3xl font-medium'>
        My Profile
      </h1>

      {/* section 1 */}
      <div className='flex justify-between items-center rounded-md  border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
        <div className='flex items-center gap-x-4'>
          <img src={user?.image} alt={`profile-${user?.firstName}`}
            className='aspect-square w-[78px] rounded-full object-cover'
          />
          <div className='space-y-1'>
            <p className='text-richblack-5 text-lg font-semibold'>{user?.firstName + " " + user?.lastName}</p>
            <p className='text-richblack-300 text-sm'>{user?.email}</p>
          </div>
        </div>
        <IconBtn text="Edit" onClick={()=>navigate('/dashboard/settings')}>
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* section 2 */}
      <div className='flex flex-col justify-between items-center rounded-md  border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 my-10'>
        <div className='flex w-full items-center justify-between'>
        {/* todo: remaing  */}
          <p className="text-lg font-semibold text-richblack-5">About</p>
            <IconBtn text="Edit" onClick={()=>navigate('/dashboard/settings')}>
              <RiEditBoxLine />
            </IconBtn>
        </div>
        <p className={`${user?.additionalDetails?.about ? "text-richblack-5":"text-richblack-400"} text-sm font-medium`}>
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* section 3 */}
      <div className='flex flex-col rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 my-10 gap-y-10'>
        <div className='flex justify-between items-center w-full'>
          <p className='text-lg font-semibold text-richblack-5'>Personal Details</p>
          <IconBtn text="Edit" onClick={()=>navigate('/dashboard/settings')}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex w-full justify-between items-center max-w-[500px]">
          <div className='flex flex-col justify-between gap-y-5'>
            <div>
              <p className='mb-2 text-sm text-richblack-600'>First Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.firstName}</p>
            </div>
            <div>
              <p className='mb-2 text-sm text-richblack-600'>Email</p>
              <p className="text-sm font-medium text-richblack-5">{user?.email}</p>
            </div>
            <div>
              <p className='mb-2 text-sm text-richblack-600'>Gender</p>
              <p className="text-sm font-medium text-richblack-5">{user?.additionalDetails?.gender ?? "Add Gender"}</p>
            </div>
          </div>
          <div className='flex flex-col justify-between gap-y-5'>
            <div>
              <p className='mb-2 text-sm text-richblack-600'>Last Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.lastName}</p>
            </div>
            <div>
              <p className='mb-2 text-sm text-richblack-600'>Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
            </div>
            <div>
              <p className='mb-2 text-sm text-richblack-600'>Date of Birth</p>
              <p className="text-sm font-medium text-richblack-5">{user?.additionalDetails?.dateofBirth ?? "Add Date of Birth"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile