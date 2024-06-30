import React, { useEffect, useState } from 'react'
import { buyCourse } from '../services/operations/studentsFeaturesAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import GetAvgRating from '../utils/avgRating';
import Error from './Error';
import ConfirmationModal from '../components/common/ConfirmationModal';
import RatingStars from '../components/common/RatingStars';
import { formatDate } from '../services/formatDate';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';
// 1:03:00
const CourseDetails = () => {

    const {token} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.profile)
    const {paymentLoading} = useSelector(state => state.course)
    const {loading} = useSelector(state => state.profile)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [confirmationModal, setConfirmationModal] = useState()

    const {courseId} = useParams()

    const [courseData, setCourseData] = useState(null)

    useEffect(()=>{
        const getCourseFullDetails = async()=>{
            try{
                const result = await fetchCourseDetails(courseId)
                console.log("course data: ",result)                
                setCourseData(result)

            }catch(error){
                console.log("Could not fetch course details")
            }
        }
        getCourseFullDetails()
    },[courseId])

    const [avgReviewCount, setAverageReviewCount] = useState(0)

    // useEffect(()=> {
    //     const count = GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
    //     setAverageReviewCount(count);
    // },[courseData])

    const [totalNoOfLecture, setTotalNoOfLecture] = useState(0)

    useEffect(()=>{
        let lectures = 0
        courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        
        setTotalNoOfLecture(lectures)
        
        
    },[courseData])

    const [isActive, setIsActive] = useState(Array(0));

    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id) ? isActive.concat(id) : isActive.filter((e)=>e != id)
        )
    }

    // to update
    const handleBuyCourse = ()=> {
        if(token){
            buyCourse(token, [courseId], user, navigate,dispatch)
            return;
        }
        setConfirmationModal({
            text1:"you are not Logged in",
            text2:"Please login to purchase the course",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler: () => navigate('/login'),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

    if(loading || !courseData){
        return <div className='spinner'></div>
    }

    if(!courseData.success){
        return <Error/>
    }

    const {
        _id: course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    } = courseData.data?.courseDetails;
    
  return (
    <div className='flex flex-col text-white'>

        <div className='relative flex flex-col justify-start p-8'>
            <p>{courseName}</p>
            <p>{courseDescription}</p>
            <div>
                <span>{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
                <span>{`(${ratingAndReviews.length} reviews) `}</span>
                <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
            </div>

            <div>
                <p>Created By {`${instructor.firstName}`}</p>
            </div>

            <div className='flex gap-x-3'>
                <p>
                    Created At {formatDate(createdAt)}
                </p>
                <p>
                    {" "} English
                </p>
            </div>

            <div>
                <CourseDetailsCard
                    course = {courseData?.data?.courseDetails}
                    setConfirmationModal = {setConfirmationModal}
                    handleBuyCourse = {handleBuyCourse}
                />
            </div>
        </div>

        <div>
            <p>What you will learn</p>
            <div>
                {whatYouWillLearn}
            </div>
        </div>

        <div>
            <div>                
                <p>Course Content</p>
            </div>
           <div className='flex gap-x-3 justify-between'>
                <div>
                    <span>{courseContent.length} sections</span>
                    <span>{totalNoOfLecture} lectures</span>
                    <span>{courseData.data?.totalDuration} total length</span>
                </div>
                <div>
                    <button onClick={() => setIsActive([])}>
                        Collapse all Sections
                    </button>
                </div>
           </div>
        </div>

        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
        }
        <button className='bg-yellow-50 p-6 mt-10 w-28' onClick={()=>handleBuyCourse()}>
            Buy Now
        </button>
    </div>
  )
}

export default CourseDetails