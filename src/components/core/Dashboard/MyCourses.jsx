import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import IconBtn from '../../common/IconBtn'
import { VscAdd } from "react-icons/vsc"
import CoursesTable from './InstructorCourses/CoursesTable'

const MyCourses = () => {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

  useEffect(()=>{

    // get all courses from instructor on first render
    const fetchCourses = async () => {
        const result = await fetchInstructorCourses(token)
        if(result){
            setCourses(result)
        }
    }
    fetchCourses()
  },[])
  return (
    <div className='mx-auto w-11/12 py-10'>
      <div className='mb-14 flex items-center justify-between'>
        <h1 className="text-3xl font-medium text-richblack-5">MyCourses</h1>
        <IconBtn
          text="New"
          onClick={()=>navigate('/dashboard/add-course')}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {
        courses && <CoursesTable courses={courses} setCourses={setCourses}/>
      }
    </div>
  )
}

export default MyCourses