import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../../common/IconBtn'
import { resetCourseState, setStep } from '../../../../../slices/courseSlice'
import { COURSE_STATUS } from '../../../../../utils/constants'
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI'
import { useNavigate } from 'react-router-dom'

const PublishCourse = () => {

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [loading,setLoading] = useState(false)
    const {course} = useSelector(state=>state.course)
    const {token} = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const goBack = () => {
        dispatch(setStep(2))
    }

    const goToCourses = () => {
        dispatch(resetCourseState())
        navigate("/dashboard/my-courses")
    }

    const handleCoursePublish = async() => {
        if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true || (course?.status === COURSE_STATUS.DRAFT && getValues('public') === false)){
            // no updation in form
            // no need to make api call
            goToCourses();
            return;
        }
        // if form is updated
        const formData = new FormData()
        formData.append('courseId',course._id);
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
        formData.append('status',courseStatus);

        // api call
        setLoading(true)
        const result = await editCourseDetails(formData,token)
        if(result){
            goToCourses()
        }
        setLoading(false)
    }

    const onSubmit = () => {
        handleCoursePublish()
    }

  return (
    <div className='rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700'>

        <p>Publish Course</p>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-2 w-full'>
                <label className=''>
                <input
                    name='public' id='public' type='checkbox' placeholder='Enter Course Title'
                    className='text-richblack-700 border-[1px] border-richblack-900'
                    {...register("public",{required:true})}
                />
                    <span className='ml-3'>Make This Course as Public</span>
                </label>
            </div>

            <div className='flex justify-end gap-x-3'>
                <button
                    disabled={loading}
                    type='button'
                    onClick={goBack}
                    className='flex items-center rounded-md py-2 px-5 bg-richblack-300'
                    >
                    Back 
                </button>

                <IconBtn disabled={loading} text='save changes'/>
            </div>
        </form>
    </div>
  )
}

export default PublishCourse