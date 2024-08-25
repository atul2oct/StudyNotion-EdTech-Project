import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

const CourseReviewModal = ({setReviewModal}) => {
    const {user} = useSelector(state=>state.profile);
    const {token} = useSelector(state=>state.auth);
    const {courseEntireData} = useSelector(state=>state.viewCourse);
    console.log("user",user);
    console.log("courseEntireData",courseEntireData)


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
    <div>
        <div>
            {/* modal header */}
            <div>
                <p>Add Review</p>
                <button onClick={()=>setReviewModal(false)}>
                    Close
                </button>
            </div>
            {/* modal body */}
            <div>
                <img src={user?.image} alt={`${user?.firstName}+${ user?.lastName} `} className='aspect-square w-[50px] rounded-full object-cover'/>
                <div>
                    <p>{user?.firstName} {user?.lastName}</p>
                    <p>Posting Publicly</p>
                </div>
            </div>
            <form onSubmit={()=>onSubmit(handleSubmit)} className='mt-6 flex flex-col items-center'>

                <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                />

                <div>
                    <label htmlFor='courseExperience'>
                        Add Your Experience*
                    </label>
                    <textarea id='courseExperience' placeholder='Add your Experience' {...register("courseExperience",{required:true})} className='form-style min-h-[130px w-full'/>
                    {
                        errors.courseExperience && (
                            <span>Please Add Your Experience</span>
                        )
                    }
                </div>

                {/* cancel and save button */}
                <div>
                    <button onClick={()=>setReviewModal(false)}>Cancel</button>
                    <IconBtn text='save'/>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CourseReviewModal