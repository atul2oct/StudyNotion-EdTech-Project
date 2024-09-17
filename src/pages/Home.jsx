import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/CTAButton';
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';

const Home = () => {
  return (
    <div>
        {/* section 1 -> dark part */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center justify-between gap-8
         max-w-maxContent text-white '>

            {/* Become a Instructor Button */}            
            <Link to={"/signup"}>
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold
                text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]
                transition-all duration-200 hover:scale-95 hover:drop-shadow-none w-fit'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                    transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>

            {/* Heading */}
            <div className='text-center text-4xl font-semibold '>
                Empower Your Future with <HighlightText text={"Coding Skills"}/>               
            </div>

            {/* Sub Heading */}
            <div className='-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300 '>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto="/signup">Learn More</CTAButton>
                <CTAButton active={false} linkto="/login">Book a Demo</CTAButton>
            </div>

            {/* Video */}
             <div className='mx-3 my-7 shadow-blue-200 rounded-full shadow-[-10px_-10px_150px_-50px]'>
                <video className='shadow-[20px_20px_rgba(255,255,255)]'
                muted
                loop
                autoPlay>
                    <source src={Banner} type="video/mp4"/>
                </video>
            </div>

            {/* code section 1 */}
            <div>
                <CodeBlocks position={"lg:flex-row"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock your <HighlightText text="coding potential"/> with our online courses.
                    </div>
                }
                subheading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                ctabtn1={
                    {
                        btnText:"try it yourself",
                        linkto:"/signup",
                        active:true,
                    }
                }
                ctabtn2={
                    {
                        btnText:"learn more",
                        linkto:"/login",
                        active:false,
                    }
                }
                codeblock={
                       `<!DOCTYPE html>
                        <html>
                        head><title>Example
                        </title><linkrel="stylesheet"href="styles.css">       
                        /head>
                        body>
                        h1><ahref="/">Header</a>
                        /h1>
                        nav><ahref="one/">One</a><ahref="two/">Two<
                        /a><ahref="three/">Three</a>
                        /nav>`
                }
                codeColor={"text-yellow-25"}
                backgroundGradient={'codeblock2'} />
            </div>

            {/* code section 2 */}
            <div>
                <CodeBlocks position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-semibold w-full lg:w-[50%]'>
                        Start <HighlightText text="coding in seconds"/>
                    </div>
                }
                subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                ctabtn1={
                    {
                        btnText:"Continue Lesson",
                        linkto:"/signup",
                        active:true,
                    }
                }
                ctabtn2={
                    {
                        btnText:"learn more",
                        linkto:"/login",
                        active:false,
                    }
                }
                codeblock={
                    `<!DOCTYPE html>
                        <html>
                        head><title>Example
                        </title><linkrel="stylesheet"href="styles.css">       
                        /head>
                        body>
                        h1><ahref="/">Header</a>
                        /h1>
                        nav><ahref="one/">One</a><ahref="two/">Two<
                        /a><ahref="three/">Three</a>
                        /nav>`
                }
                codeColor={"text-yellow-25"}
                backgroundGradient={'none'} />
            </div>

            <div className='w-full'>
                <ExploreMore/>
            </div>
        </div>

        {/* section 2 -> light part  */}
        <div className='bg-pure-greys-5 text-richblack-700'>
            
            <div className='homepage_bg h-[310px]'>
                <div className='w-11/12 max-w-maxContent flex flex-col
                items-center justify-center gap-5 mx-auto'>
                <div className='h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white'>
                        <CTAButton active={true} linkto={'/signup'}>
                            <div className='flex items-center gap-3'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={'/signup'}>
                            <div>Learn more</div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col
            items-center justify-between gap-7'>
                <div className='flex flex-row gap-16 mb-10 mt-[95px]'>
                    <div className='text-4xl font-semibold w-[45%]'>
                        Get the skills you need for a <HighlightText text={"job that is in demand."}/>
                    </div>
                    <div className='flex flex-col gap-10 w-[45%] items-start'>
                        <div className='text-[16px] font-medium text-richblack-700'>
                        The modern StudyNotion is the dictates its own terms. Today, to be a competitive 
                        specialist requires more than professional skills.
                        </div>
                        <CTAButton active={true} linkto={'/signup'}>
                            <div>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>

                <TimelineSection/>

                <LearningLanguageSection/>

            </div>           

        </div>
        {/* section 3 -> dark part */}
        <div className='w-11/12 mx-auto max-w-maxContent flex flex-col
        items-center justify-between gap-8 bg-richblack-900
        text-white'>
        

        <InstructorSection/>
        <h2 className='text-center text-4xl font-semibold mt-10'> Reviews from other learners </h2>
        
        {/* Review slider here */}
        <ReviewSlider/>

        </div>

        {/* section 4 -> footer part */}
        <Footer/>
    </div>
  )
}

export default Home