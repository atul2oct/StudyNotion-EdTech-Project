import React from 'react'

const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
  return (
    <div className={`flex flex-col p-5 text-richblack-200 gap-16
    w-[28%] aspect-auto overflow-x-hidden justify-between
    ${currentCard === cardData.heading ? "bg-white shadow-[10px_10px_rgba(255,214,10)]":"bg-richblack-800"}`}
    onClick={()=>setCurrentCard(cardData.heading)}>
        <div className='mb-4'>
            <div className={`text-lg font-semibold ${currentCard === cardData.heading ? "text-richblack-900":"text-richblack-5"}`}>
                {cardData.heading}
            </div>
            <p className='text-richblack-300 text-md text-[16px] mt-3'>
                {cardData.description}
            </p>
        </div>
        <div>
            <div className='border-t border-dashed scale-150 border-richblack-200 '></div>
            <div className='flex items-center justify-between w-full m-2'>
                <div>
                    {cardData.level}
                </div>
                <div>
                    {cardData.lessionNumber} Lessons
                </div>
            </div>
        </div>
    </div>
  )
}

export default CourseCard