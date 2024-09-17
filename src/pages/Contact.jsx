import React from 'react'
import Footer from '../components/common/Footer'
import ContactDetails from '../components/ContactPage/ContactDetails'
import ContactForm from '../components/ContactPage/ContactForm'
import ReviewSlider from '../components/common/ReviewSlider'

const Contact = () => {
  return (
    <div>
        <div className='mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row'>

            {/* contact details */}
            <div className='lg:w-[40%]'>
                <ContactDetails/>                
            </div>

            {/* contact form */}
            <div>
                <ContactForm/>                
            </div>
        </div>
        <div className='relative mx-auto my-20 flex flex-col w-11/12 max-w-maxContent items-center justify-between gap-8 bg-richblack-900 text-white'>
            <h1 className="text-center text-4xl font-semibold mt-8">
                Reviews from other learners
            </h1>
            {/* review slider */}
            <ReviewSlider/>
        </div>
        <Footer/>
    </div>
  )
}

export default Contact