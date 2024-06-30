import React from 'react'
import ContactUsForm from '../../ContactPage/ContactUsForm'

const ContactformSection = () => {
  return (
    <div className='mx-auto'>
        <h1>Get in Touch</h1>
        <p>We’d love to here for you, Please fill out this form.</p>
        <div>
            <ContactUsForm/>
        </div>
    </div>
  )
}

export default ContactformSection