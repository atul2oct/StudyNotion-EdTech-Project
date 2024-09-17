import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { RxCross2 } from "react-icons/rx"
import { useSelector } from 'react-redux'
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

const CourseReviewModal = ({setReviewModal}) => {
    const {user} = useSelector(state=>state.profile);
    const {token} = useSelector(state=>state.auth);
    const {courseEntireData} = useSelector(state=>state.viewCourse);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm();

    const onSubmit = async(data) => {
        await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience,
            },
            token
        );
        setReviewModal(false);
    };

    const ratingChanged = (newRating) => {
        setValue("courseRating",newRating);
    };

    useEffect(()=>{
        setValue("courseExperience","");
        setValue("courseRating",0);
    },[]);

  return (
    <div className='fixed inset-0 z-[1000] !mt-0 h-screen w-screen grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
        <div className='rounded-lg border border-richblack-400 bg-richblack-800 my-10 w-11/12 max-w-[700px]'>
            {/* modal header */}
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5">Add Review</p>
                <button onClick={()=>setReviewModal(false)}>
                    <RxCross2 className="text-2xl text-richblack-5" />
                </button>
            </div>

            {/* modal body */}
            <div className="p-6">
                <div className="flex items-center justify-center gap-x-4">
                    <img src={user?.image} alt={`${user?.firstName}'s' + "profile"`} className='aspect-square w-[50px] rounded-full object-cover'/>
                    <div>
                        <p className="font-semibold text-richblack-5">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-richblack-5">Posting Publicly</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='mt-6 flex flex-col items-center'>

                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={24}
                        activeColor="#ffd700"
                    />

                    <div className="flex w-11/12 flex-col space-y-2">
                        <label htmlFor='courseExperience' className="text-sm text-richblack-5">
                            Add Your Experience<sup className="text-pink-200">*</sup>
                        </label>
                        <textarea id='courseExperience' placeholder='Add your Experience' {...register("courseExperience",{required:true})} className='form-style resize-x-none min-h-[130px] w-full'/>
                        {
                            errors.courseExperience && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">Please Add Your Experience</span>
                            )
                        }
                    </div>

                    {/* cancel and save button */}
                    <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                        <button onClick={()=>setReviewModal(false)} className='flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900'>Cancel</button>
                        <IconBtn text='Save'/>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal