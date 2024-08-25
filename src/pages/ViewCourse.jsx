import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice'
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
// 22:45
const ViewCourse = () => {

    const [reviewModal, setReviewModal] = useState(false);

    const {courseId} = useParams();
    console.log("courseId from params",courseId)
    const {token} = useSelector(state=>state.auth);
    const dispatch = useDispatch();

    useEffect(()=>{
        const setCourseSpecificDetails = async() => {
            const courseData = await getFullDetailsOfCourse(courseId, token);
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
            dispatch(setEntireCourseData(courseData.courseDetails));
            let lecture = 0;
            courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lecture += sec.subSection.length;
            })
            dispatch(setTotalNoOfLectures(lecture));
            dispatch(setCompletedLectures(courseData.completedVideos));
        }
        setCourseSpecificDetails();
    },[]);
    
  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal={setReviewModal}/>
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className='mx-6'>
                    <Outlet/>
                </div>
            </div>
        </div>
        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}
    </>
  )
}

export default ViewCourse