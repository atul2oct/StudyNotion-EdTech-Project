import React, { useEffect, useState } from 'react'
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import ReactMarkdown from 'react-markdown';
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
import Footer from '../components/common/Footer';
import { ACCOUNT_TYPE } from '../utils/constants';
import toast from 'react-hot-toast';
import { addToCart } from '../slices/cartSlice';
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar';

// 1:03:00
const CourseDetails = () => {

    const {token} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.profile);
    const {paymentLoading} = useSelector(state => state.course);
    const {loading} = useSelector(state => state.profile);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Declear a state to save the course details
    const [courseData, setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    // Getting courseId from url parameter
    const {courseId} = useParams(); 

    useEffect(()=>{
        // Calling fetchCourseDetails fucntion to fetch the details
        const getCourseFullDetails = async()=>{
            try{
                const result = await fetchCourseDetails(courseId)          
                setCourseData(result)

            }catch(error){
                console.log("Could not fetch course details")
            }
        }

        getCourseFullDetails();
    },[courseId]);

    // Calculating Avg Review count (currently not working;)
    const [avgReviewCount, setAverageReviewCount] = useState(0);
    useEffect(()=> {
        const count = GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
        setAverageReviewCount(count);
    },[courseData])


    // Total number of lectures
    const [totalNoOfLecture, setTotalNoOfLecture] = useState(0);
    useEffect(()=>{
        let lectures = 0
        courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        
        setTotalNoOfLecture(lectures);       
        
    },[courseData]);

    // collapse all
    const [isActive, setIsActive] = useState(Array(0));

    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id) ? isActive.concat([id]) : isActive.filter((e)=>e != id)
        );
    };

    // to update (add toc art or buy)
    const handleBuyCourse = ()=> {
        if(token){
            buyCourse(token, [courseId], user, navigate,dispatch)
            return;
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to purchase the course",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate('/login'),
            btn2Handler: () => setConfirmationModal(null),
        });
    }
    const handleAddToCart = () => {
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
          toast.error("You are an Instructor, you cant buy a course");
          return;
        }
        if(token){
          dispatch(addToCart(courseData?.data?.courseDetails))
          return;
        }
        setConfirmationModal({
          text1:"you are not logged in",
          text2:"Please login to add to cart",
          btn1text:"login",
          btn2Text:"cancel",
          btn1Handler:()=>navigate("/login"),
          btn2Handler: ()=> setConfirmationModal(null),
      })
      }

    if(loading || !courseData){
        return (
            <div className='grid min-h[calc(100vh-3.5rem)] place-items-center'>
                <div className='spinner'></div>
            </div>
        )
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

    if(paymentLoading){
        return (
            <div className='grid min-h[calc(100vh-3.5rem)] place-items-center'>
                <div className='spinner'></div>
            </div>
        )
    }
    
  return (
    <>
        <div className='relative w-full bg-richblack-800'>
        {/* hero section */}
            <div className='mx-auto box-content px-4 lg:w-[1260px] 2xl:relative'>
                <div className='mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]'>

                    <div className='relative block max-h-[30rem] lg:hidden'>
                        <div className='absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]'></div>
                        <img src={thumbnail} alt='course thumbnail' className='aspect-auto w-full'/>
                    </div>

                    <div className='z-30 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5'>

                        <div>
                            <p className='text-4xl font-bold text-richblack-5'>{courseName}</p>
                        </div>
                        
                        <p className='text-richblack-200'>{courseDescription}</p>
                        <div className='text-md flex flex-wrap items-center gap-2'>
                            <span className='text-yellow-25'>{avgReviewCount}</span>
                            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
                            <span>{`(${ratingAndReviews.length} reviews) `}</span>
                            <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
                        </div>

                        <div>
                            <p>Created By {`${instructor.firstName} ${instructor.lastName}`}</p>
                        </div>

                        <div className='flex flex-wrap gap-5 text-lg'>
                            <p className='flex items-center gap-2'>
                                {" "}
                                <BiInfoCircle/>Created At {formatDate(createdAt)}
                            </p>
                            <p className='flex items-center gap-2'>
                                {" "}
                                <HiOutlineGlobeAlt/> English
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 border-y border-x-richblack-500 py-4 w-full lg:hidden'>
                        <p className='space-x-3 pb-4 text-3xl font-semibold text-richblack-5'>Rs. {price}</p>
                        {/* <button className='bg-yellow-50 text-richblack-900 Button' onClick={handleBuyCourse}>
                            Buy Now
                        </button>
                        <button className="bg-richblack-50 text-richblack-900 Button">Add to Cart</button> */}

                        <div className='flex flex-col gap-4'>
                            <button className='bg-yellow-50 text-richblack-900 Button'
                            onClick = { user && courseData?.data?.courseDetails?.studentsEnrolled.includes(user?._id) ? () => navigate('/dashboard/enrolled-courses') : handleBuyCourse }
                            >
                            {
                                user && courseData?.data?.courseDetails?.studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"
                            }
                            </button>

                            {
                            (!user || !courseData?.data?.courseDetails?.studentsEnrolled.includes(user?._id)) && (<button onClick={handleAddToCart} className='bg-richblack-900 text-richblack-5 Button'>Add to Cart</button>)
                            }
                        </div>
                    </div>
                    
                </div>

                {/* course card */}
                <div className='right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block'>
                    <CourseDetailsCard
                        course = {courseData?.data?.courseDetails}
                        setConfirmationModal = {setConfirmationModal}
                        handleBuyCourse = {handleBuyCourse}
                    />
                </div>

            </div>            
        </div>

        <div className='mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]'>
        
            <div className='mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]'>
                {/* What will you learn section */}
                <div className='my-8 border border-richblack-600 p-8'>
                    <p className="text-3xl font-semibold">What you will learn</p>
                    <div className='mt-5'>
                        <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>                        
                    </div>
                </div>

                {/* Course Content Section */}
                <div className='max-w-[830px]'>
                    <div className='flex flex-col gap-3'>                
                        <p className='text-2xl font-semibold'>Course Content</p>
                        <div className='flex flex-wrap justify-between gap-2'>
                            <div className='flex gap-2'>
                                <span>
                                    {courseContent.length} {`section(s)`}
                                </span>
                                <span>
                                    {totalNoOfLecture} {`lecture(s)`}
                                </span>
                                <span>
                                    {courseData.data?.totalDuration} total length
                                </span>
                            </div>
                            <div>
                                <button className="text-yellow-25" onClick={() => setIsActive([])}>
                                    Collapse all Sections
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Course Details Accordion */}
                    <div className='py-4'>
                            {
                                courseContent?.map((course, index) => (
                                    <CourseAccordionBar course={course} key={index} isActive={isActive} handleActive={handleActive}/>                                    
                                ))
                            }
                    </div>

                    {/* Author Details */}
                    <div className='mb-12 py-4'>
                        <p className='text-2xl font-semibold'>Author</p>
                        <div className='flex items-center gap-4 py-4'>
                            <img src={instructor.image ? instructor.image : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`} alt="Author" className="h-14 w-14 rounded-full object-cover"/>
                            <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                        </div>
                        <p className="text-richblack-50">
                            {instructor?.additionalDetails?.about}
                        </p>
                    </div>
                </div>

            </div>
        </div>            

        <Footer/>
        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
        }
    </>
    
  )
}

export default CourseDetails