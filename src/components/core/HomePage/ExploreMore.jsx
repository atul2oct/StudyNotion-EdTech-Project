import React, { useState } from 'react'
import  {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';
const tabsNane = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];

const ExploreMore = () => {
    const [currentTab,setCurrentTab] = useState(tabsNane[0]);
    const [courses,setCourses] = useState(HomePageExplore[0].courses)
    const [currentCard,setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)
    
    const setMyCards = (value) => {
        setCurrentTab(value)
        const result = HomePageExplore.filter((course)=>course.tag === value)
        setCourses(result[0].courses)
        setCurrentCard(result[0].courses[0].heading)
    }

  return (
    <div className='flex flex-col relative justify-center items-center'>
        <div className='text-4xl font-semibold text-center'>
            Unlock the <HighlightText text={'Power of Code'}/>            
        </div>
        <p className='text-center text-richblack-300 text-sm text-[16px] mt-3'>
            Learn to Build Anything You Can Imagine
        </p>
        <div className='mt-5 flex flex-row rounded-full bg-richblack-800 mb-5
        border-richblack-100 px-1 py-1 w-fit'>
            {
                tabsNane.map((element,index)=>{
                    return (
                        <div key={index} onClick={()=>setMyCards(element)}
                        className={`text-[16px] flex flex-row gap-2 items-center 
                        ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium"
                        :"text-richblack-200"} rounded-full transition-all duration-200
                        cursor-pointer hover:bg-richblack-900 hover:text-richblack-5
                        px-7 py-2`}>
                            {element}
                        </div>
                    )
                })
            }
        </div>

        <div className='lg:h-[230px]'></div>
        {/* course card */}
        <div className='absolute flex flex-row justify-between gap-1
        w-[90%] top-44'>
            {
                courses.map((element,index)=>{
                    return(
                        <CourseCard key={index} cardData={element}
                        currentCard={currentCard} setCurrentCard={setCurrentCard}/>
                    )
                })
            }
        </div>
    </div>
  )
}

export default ExploreMore