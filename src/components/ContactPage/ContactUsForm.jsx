import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiConnector } from '../../services/apiconnector'
import { contactusEndpoint } from '../../services/api'
import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {
    const [loading,setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm()

    const submitContactForm = async(data) => {
      setLoading(true)
      // console.log("Logging Data",data)
      try{
        const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data)
        console.log("Email response- ",response)
      }catch(error){
        console.log("Error: ",error.message)
      }
      setLoading(false)
    }

    useEffect(()=>{
      if(isSubmitSuccessful){
        reset({
          email:"",
          firstname:"",
          lastname:"",
          message:"",
          phoneNo:"",
        })
      }
    },[reset,isSubmitSuccessful])

  return (
    <form onSubmit={handleSubmit(submitContactForm)} className="flex flex-col gap-7">
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* firstname */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor='firstname' className="lable-style">First Name</label>
            <input
              type='text'
              name='firstname'
              id='firstname'
              placeholder='Enter first name'
              className="form-style"
              {...register("firstname",{required:true})}
            />
            {
              errors.firstname && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your name
                </span>
              )
            }
          </div>
          {/* lastname */}
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label htmlFor='lastname' className="lable-style">Last Name</label>
            <input
              type='text'
              name='lastname'
              id='lastname'
              placeholder='Enter first name'
              className="form-style"
              {...register("lastname")}
            />
          </div>
        </div>
        {/* phone number */}
        <div className='flex flex-col gap-2'>
          <label className="lable-style" htmlFor='phonenumber'>Phone Number</label>
          <div className='flex flex-row gap-5'>
            {/* drop down */}
            <div className='flex flex-col gap-2 w-[81px] '>
              <select className="form-style h-12"
                name='dropdown'
                id='dropdown'
                {...register("countrycode",{required:true})}>
                {
                  CountryCode.map((element,index)=>{
                    return (
                      <option className="form-style text-richblack-200" key={index} value={element.code}>
                        {element.code} -{element.country}
                      </option>
                    )
                  })
                }
              </select>
            </div>
            <div className='flex flex-col w-full'>
              <input
                  type='number'
                  name='phonenumber'
                  id='phonenumber'
                  placeholder='12345 67890'
                  className="form-style"
                  {...register("phoneNo",
                  {
                    required:true, message:"Please enter Phone Number",
                    maxLength:{value:10, message:"Invalid Phone Number"},
                    minLength:{value:8, message:"Invalid Phone Number"}
                  })}
                />
            </div>
          </div>
          {
            errors.phoneNo && (
              <span>
                {errors.phoneNo.message}
              </span>
            )
          }
        </div>
        {/* email */}
        <div className='flex flex-col'>
            <label htmlFor='email' className="lable-style">Email Address</label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Enter email address'
              className="form-style"
              {...register("email",{required:true})}
            />
            {
              errors.email && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your email address
                </span>
              )
            }
        </div>
        {/* message */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='message' className="lable-style">Message</label>
          <textarea
            name='message'
            id='message'
            cols="30"
            rows="7"
            placeholder='Enter your message here'
            className="form-style"
            {...register("message",{required:true})}
          />
          {
            errors.emssage && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your message
              </span>
            )
          }
        </div>
        {/* button */}
        <button type='submit' disabled={loading}
          className={`${!loading && "hover:scale-95 hover:shadow-none transition-all duration-200"} rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] sm:text-[16px]disabled:bg-richblack-500`}>
          Send message
        </button>
      
    </form>
  )
}

export default ContactUsForm