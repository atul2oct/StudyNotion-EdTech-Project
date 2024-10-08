import React from 'react'
import { HiOutlineVideoCamera } from "react-icons/hi"

const CourseSubSectionAccordion = ({subSec}) => {
  console.log("subSec",subSec)
  return (
    <div>
        <div className='flex justify-between py-2'>
            <div className='flex items-center py-2'>
                <span><HiOutlineVideoCamera/></span>
                <p>{subSec?.title}</p>
            </div>
        </div>
    </div>
  )
}

export default CourseSubSectionAccordion