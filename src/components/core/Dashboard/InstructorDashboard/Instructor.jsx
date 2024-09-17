import React, { useEffect, useState } from 'react'
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { Link } from 'react-router-dom';

const Instructor = () => {

    const [loading,setLoading] = useState(false);
    const [instructorData,setInstructorData] = useState(null);
    const [courses,setCourses] = useState([]);

    const { token } = useSelector(state => state.auth);
    const { user } = useSelector((state) => state.profile)

    useEffect(()=>{
        const getCourseDataWithStats = async () => {
            setLoading(true);
            const InstructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);
            console.log('InstructorApiData',InstructorApiData);
            console.log('fetchInstructorCourses',result);
            if(InstructorApiData.length){
                setInstructorData(InstructorApiData);
            }

            if(result.length){
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithStats();
    },[]);

    const totalAmount = instructorData?.reduce((acc,curr)=>acc+curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc,curr)=>acc+curr.totalStudentsEnrolled, 0);

  return (

    <div>

        <div className="space-y-2">
            <h1 className="text-2xl font-bold text-richblack-5 text-center sm:text-left">Hii {user?.firstName} 👋</h1>
            <p className="font-medium text-richblack-200 text-center sm:text-left">
            Let's start something new
            </p>   
        </div>

        {
            loading ? (<div className='spinner'></div>) : 
            ( 
                courses.length > 0 ? (<div></div>) : 
                (
                    <div>
                        <p className="text-center text-2xl font-bold text-richblack-5">
                            You have not created any courses yet
                        </p>

                        <Link to="/dashboard/add-course">
                            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
                                Create a course
                            </p>
                        </Link>
                    </div>
                )
            )
        }
    </div>
  )
}

export default Instructor