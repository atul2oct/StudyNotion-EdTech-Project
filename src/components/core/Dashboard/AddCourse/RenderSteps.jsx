import React from 'react'
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import CourseInformationForm from './CourseInformation/CourseInformationForm';
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm';
import PublishCourse from './PublishCourse';

const RenderSteps = () => {

    const {step} = useSelector((state)=> state.course);

    const steps = [
        {
            id:1,
            title: "Course Information",
        },
        {
            id:2,
            title: "Course Builder",
        },
        {
            id:3,
            title: "Publish",
        },
    ]
  return (
    <>
        <div className='mx-auto w-11/12'>
            <div className='relative mb-2 flex flex-row justify-center items-center w-[70%] mx-auto text-center'>
                {
                    steps.map((item)=>(
                        <>
                            <div key={item.id} className='flex flex-col items-center'>
                                <button
                                className={`grid place-items-center cursor-default aspect-square w-[34px] rounded-full border-[1px] ${step === item.id ? "bg-yellow-900 border-yellow-50 text-yellow-50":"bg-richblack-800 border-richblack-500 text-richblack-500"} ${step > item.id && "bg-yellow-50 text-yellow-50"}} `}>
                                {
                                    step > item.id ? (<FaCheck className="font-bold text-richblack-900" />):(item.id)
                                }
                                </button>
                            </div>

                            {/* add code for dashes between the labels */}
                            {
                                item.id !== steps.length && (
                                    <>
                                        <div className={`border-dashed border-b-2 my-auto ${step > item.id ? "border-yellow-50":"border-richblack-500"} w-full`}></div>
                                    </>
                                )
                            }
                        </>
                    ))
                }
            </div>
            <div className='relative mb-16 flex flex-row select-none justify-center items-center w-full text-center'>
                {
                    steps.map((item)=>(
                        <div key={item.id} className='w-1/3'>
                                <p className={`${step > item.id ? "text-richblack-5":"text-richblack-300"} ${step === item.id && "text-richblack-50"} text-center'`}>{item.title}</p>
                        </div>
                    ))
                }
            </div>
        </div>

        
        {
            step === 1 && <CourseInformationForm/>
        }
        {
            step === 2 && <CourseBuilderForm/>
        }
        {
            step === 3 && <PublishCourse/>
        }
    </>
  )
}

export default RenderSteps