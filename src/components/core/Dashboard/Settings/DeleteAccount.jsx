import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiTrash2 } from "react-icons/fi"

const DeleteAccount = () => {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      // dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <>
      <div className='border-[1px] border-pink-700 bg-pink-900 flex flex-row  rounded-md p-8 px-12 my-10 gap-x-5'>
        <div className='rounded-full bg-pink-700 h-14 w-14 aspect-square flex justify-center items-center'>
          <FiTrash2 className='text-3xl text-pink-200'/>
        </div>
        <div>
          <h2 className='text-lg font-semibold text-richblack-5'>
            Delete Account
          </h2>
          <div className='text-pink-25 w-4/5'>
            <p>
              Would you like to delete account?
            </p>
            <p>
              This account contains Paid Courses. Deleting your account will remove all the contain associated with it.
            </p>
          </div>
          <button type="button" className='text-pink-300 w-fit cursor-pointer italic' onClick={handleDeleteAccount}>
            I want to delete my account.
          </button>
        </div>
      </div>
    </>
    
  )
}

export default DeleteAccount