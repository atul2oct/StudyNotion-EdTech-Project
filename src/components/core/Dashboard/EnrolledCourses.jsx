import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI'
import ProgressBar from '@ramonak/react-progress-bar'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../../services/operations/authAPI'


const EnrolledCourses = () => {

    const {token} = useSelector(state=>state.auth);
    const navigate = useNavigate();

    const [enrolledCourses,setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        try{
            const response = await getUserEnrolledCourses(token)
            // Filtering the published course out
            const filterPublishCourse = response.filter((ele) => ele.status !== "Draft")
            setEnrolledCourses(filterPublishCourse);

        }catch(error){
            console.log("Unable to fetch Enrolled Courses error: ",error);
        }
    }
    
    useEffect(()=>{
        getEnrolledCourses();
    }, []);
    
  return (
    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
        <div className='text-3xl text-richblack-50'>Enrolled Courses</div>
        {
            !enrolledCourses ? (<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center"><div className='spinner'></div></div>)
            :( !enrolledCourses.length ? (<p className="grid h-[10vh] w-full place-content-center text-richblack-5">
            You have not enrolled in any courses yet.
            {/* TODO: Modify this Empty State */}
            </p>) 
            : (<div className="my-8 text-richblack-5">
                {/* Headings */}
                <div className="flex rounded-t-lg bg-richblack-500">
                    <p className='w-[45%] px-5 py-3'>Courses Name</p>
                    <p className='w-1/4 px-2 py-3'>Courses Duration</p>
                    <p className='flex-1 px-2 py-3'>Progress</p>
                </div>
                {/* card suru hote hai */}
                {
                    enrolledCourses.map((course, index, arr)=>(
                        <div key={index} className={`flex items-center border border-richblack-700 ${index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"}`}>
                            <div className='flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3' onClick={() => {navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}}>
                                <img src={course.thumbnail} alt="course_img" className='h-14 w-14 rounded-lg object-cover'/>
                                <div className='flex max-w-xs flex-col gap-2'>
                                    <p className="font-semibold">{course.courseName}</p>
                                    <p className="text-xs text-richblack-300">{course.courseDescription.length > 50 ? `${course.courseDescription.slice(0, 50)}...}` : course.courseDescription}</p>
                                </div>
                            </div>
                            <div className='w-1/4 px-2 py-3'>
                                {course?.totalDuration}
                            </div>
                            <div className='flex w-1/5 flex-col gap-2 px-2 py-3'>
                                <p>Progress: {course.progressPercentage || 0}%</p>
                                <ProgressBar
                                    completed={course.progressPercentage || 0}
                                    height='8px'
                                    isLabelVisible={false}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>))
        }
    </div>
  )
}

export default EnrolledCourses