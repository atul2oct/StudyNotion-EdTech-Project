import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import { FaQuoteLeft, FaQuoteRight  } from "react-icons/fa6";

const Quote = () => {
  return (
    <div className='text-richblack-5 leading-snug'>
      <FaQuoteLeft className='text-richblack-600 inline -translate-y-4'/>
        We are passionate about revolutionizing the way we learn.
        Our innovative platform <HighlightText text={'combines technology'}/>,
        <span className='text-brown-500'>
            {" "}
            expertise
        </span>
            , and community to create an 
        <span className='text-brown-500'>
            {" "}
            unparalleled educational experience.
        </span>
        <FaQuoteRight className='text-richblack-600 inline -translate-y-4'/>
    </div>
  )
}

export default Quote