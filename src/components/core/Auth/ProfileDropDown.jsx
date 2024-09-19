import React, { useRef, useState } from 'react'
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../../services/operations/authAPI'
import useOnClickOutside from '../../../hooks/useOnClickOutside'

const ProfileDropDown = () => {
  const { user } = useSelector((state)=>state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [open,setOpen] = useState(false);

  const ref = useRef();

  useOnClickOutside(ref,()=>setOpen(false));
// --------------
  // if (!user){
  //   console.log("no user");
  //   return localStorage.setItem("token",null);
  // } 

  return (
    <button className='relative' onClick={()=>setOpen(!open)}>
      <div className='flex items-center gap-x-1'>
        <img src={user?.image} className='aspect-square rounded-full w-8 object-cover'
          alt={`profile-${user?.firstName}`}
        />
        <AiOutlineCaretDown className='text-sm text-richblack-100'/>
      </div>
      {
        open && (
          <div className='absolute divide-y-[1px] divide-richblack-700 overflow-hidden rounded-sm
            border-y-[1px] border-richblack-700 bg-richblack-800 top-[118%] right-0 z-[1000]'
            onClick={(e) => e.stopPropagation()} ref={ref}
          >

            <Link to="/dashboard/my-profile" onClick={()=>setOpen(false)}>
              <div className='flex w-full items-center gap-x-1 py-[10px] px-3 text-sm
              text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                <VscDashboard className='text-lg'/>
                Dashboard
              </div>
            </Link>
            <div onClick={()=>{
              setOpen(false)
              dispatch(logout(navigate))
            }} className='flex w-full items-center gap-x-1 py-[10px] px-3 text-sm
              text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
              <VscSignOut className='text-lg'/>
              Logout
            </div>
          </div>
        )
      }
    </button>
  )
}

export default ProfileDropDown