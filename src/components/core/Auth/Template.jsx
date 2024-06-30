import React from 'react'
import frameImg from "../../../assets/Images/frame.png"
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { useSelector } from 'react-redux'

const Template = ({ title, description1, description2, image, formType }) => {
    
    const {loading} = useSelector(state => state.auth)

  return (
    <>
        {
            loading ? (<div className="spinner"></div>)
            :(<div className='flex md:flex-row md:gap-y-0 md:gap-x-12 flex-col-reverse
                gap-y-12 py-12 justify-between w-11/12 max-w-maxContent mx-auto
                items-center min-h-[calc(100vh-3.5rem)]'>
                    {/* left */}
                    <div className='mx-auto max-w-[450px] w-11/12 md:mx-0'>
                        <h1 className='text-richblack-5 text-3xl font-semibold'>
                            {title}
                        </h1>
                        <p className='text-lg mt-4'>
                            <span className='text-richblack-100'>
                                {description1}
                            </span>{" "}
                            <span className='text-blue-100 font-edu-sa font-bold italic'>
                                {description2}
                            </span>
                        </p>
                        {formType === "login" ? <LoginForm/> : <SignupForm/>}
                    </div>
                    {/* right */}
                    <div className='relative mx-auto max-w-[450px] md:mx-0'>
                        <img
                            src={frameImg}
                            alt='pattern'
                            width={558}
                            height={504}
                            loading='lazy'
                        />
                        <img
                            src={image}
                            alt='pattern'
                            width={558}
                            height={504}
                            loading='lazy'
                            className='absolute -top-4 right-4 z-10'
                        />
                    </div>
                </div>)}
    </>
  )
}

export default Template