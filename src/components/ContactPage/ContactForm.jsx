import React from 'react'
import ContactUsForm from './ContactUsForm'

const ContactForm = () => {
  return (
    <div className='flex flex-col gap-3 border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14'>
        <h1 className='text-4xl leading-10 font-semibold text-richblack-5'>
        Got a Idea? We&apos;ve got the skills.<br/>
        Let&apos;s team up
        </h1>
        <p className=''>
            Tall us more about yourself and what you&apos;re got in mind.
        </p>
        <div className="mt-7">
            <ContactUsForm/>
        </div>
    </div>
  )
}

export default ContactForm