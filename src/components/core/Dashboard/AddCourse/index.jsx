import React from 'react'
import RenderSteps from './RenderSteps'

function AddCourse() {
  return (
    <div className='mx-auto w-11/12 py-10'>
      <div className='flex xl:flex-row flex-col items-start justify-between w-10/12 gap-2 lg:gap-0'>
        <div className='lg:w-[calc(100%-28rem)] w-full'>
          <h1 className='mb-14 text-3xl font-medium text-richblack-5'>Add Course</h1>
          <div>
            <RenderSteps/>
          </div>
        </div>
        <div className='bg-richblack-800 rounded-md p-6 border-[1px]border-richblack-700 lg:max-w-sm'>
          <p className='text-richblack-5 font-semibold text-lg leading-[26px]'>⚡Course Upload Tips</p>
          <ul className='list-disc px-6'>
            <li className='text-richblack-5 font-medium text-xs leading-5'>Set the Course Price option or make it free.</li>
            <li className='text-richblack-5 font-medium text-xs leading-5'>Standard size for the course thumbnail is 1024x576.</li>
            <li className='text-richblack-5 font-medium text-xs leading-5'>Video section controls the course overview video.</li>
            <li className='text-richblack-5 font-medium text-xs leading-5'>Course Builder is where you create & organize a course.</li>
            <li className='text-richblack-5 font-medium text-xs leading-5'>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
            <li className='text-richblack-5 font-medium text-xs leading-5'>Information from the Additional Data section shows up on the course single page.</li>
            <li className='text-richblack-5 font-medium text-xs leading-5'>Make Announcements to notify any important</li>
            <li className='text-richblack-5 font-medium text-xs leading-5'>Notes to all enrolled students at once.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default AddCourse