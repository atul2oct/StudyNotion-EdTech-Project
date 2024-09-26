import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI'
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import RequirementsField from './RequirementsField';
import { setCourse, setStep } from '../../../../../slices/courseSlice';
import IconBtn from '../../../../common/IconBtn';
import toast from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../../utils/constants';
import ChipInput from './ChipInput';
import { MdNavigateNext } from "react-icons/md"
import Upload from '../Upload';

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
    } = useForm()

    const dispatch = useDispatch()
    const {course, editCourse} = useSelector(state=>state.course)
    const {token} = useSelector(state=>state.auth)

    const [loading,setLoading] = useState(false);
    const [courseCategories,setCourseCategories] = useState([])

    useEffect(()=>{
        const getCategories = async()=> {
            setLoading(true)
            const categories = await fetchCourseCategories();
            if(categories.length > 0){
                setCourseCategories(categories)
            }
            setLoading(false)
        }

        if(editCourse){
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.category);
            setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail);
        }
        getCategories()
    },[])

    const isFormUpdated = () => {
        const currentValues = getValues()
        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseImage !== course.thumbnail ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() ){
            return true;
        }else{
            return false;
        }

    }

    // handle next button click
    const onSubmit = async(data) => {
        if(editCourse){
            if(isFormUpdated()) {
                const currentValues = getValues()
                const formData = new FormData()
                
                formData.append("courseId", course._id);
                if(currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle);
                }

                if(currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc);
                }

                if(currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice);
                }

                if (currentValues.courseTags.toString() !== course.tag.toString()) {
                    formData.append("tag", JSON.stringify(data.courseTags))
                }

                if(currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }

                if(currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory);
                }

                if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                    formData.append("instructions", JSON.stringify(data.courseRequirements));
                }

                if (currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage)
                }

                setLoading(true);
                const result = await editCourseDetails(formData,token)
                setLoading(false);
                if(result){
                    dispatch(setStep(2))
                    dispatch(setCourse(result))
                }

            }else{
                toast.error("NO Changes made so far")
            }
            return
        }
        //create a new course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("category", data.courseCategory);
        formData.append("status", COURSE_STATUS.DRAFT);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("thumbnailImage", data.courseImage)
        console.log("image",data.courseImage)
        

        setLoading(true);
        const result = await addCourseDetails(formData,token)
        if(result) {
            dispatch(setStep(2))
            dispatch(setCourse(result));
        }
        setLoading(false);
        console.log("PRINTING FORMDATA", formData);
        console.log("PRINTING result", result);
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='bg-richblack-800 rounded-lg p-6 border-[1px] border-richblack-700 space-y-6'>

        {/* Course Title */}
        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='courseTitle' className='lable-style'>Course Title<sup className='text-pink-200 ml-1'>*</sup></label>
            <input
                name='courseTitle' id='courseTitle' type='text' placeholder='Enter Course Title'
                className='form-style bg-richblack-700'
                {...register("courseTitle",{required:true})}
            />
            {
                errors.courseTitle && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                    Course Title is Required.
                </span>
                )
            }
        </div>

        {/* Course Short Description */}
        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='courseShortDesc' className='lable-style'>Course Short Description<sup className='text-pink-200 ml-1'>*</sup></label>
            <textarea
                name='courseShortDesc' id='courseShortDesc' type='text' placeholder='Enter Description'
                className='form-style bg-richblack-700 min-h-[140px] resize-x-none w-full'
                {...register("courseShortDesc",{required:true})}
            />
            {
                errors.courseShortDesc && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                    Course Short Description is Required.
                </span>
                )
            }
        </div>

        {/* Course Price */}
        <div className='flex flex-col gap-2 w-full relative'>
            <label htmlFor='coursePrice' className='lable-style'>Price<sup className='text-pink-200 ml-1'>*</sup></label>
            <input
                name='coursePrice' id='coursePrice' type='text' placeholder='Enter Price'
                className='form-style bg-richblack-700 px-10'
                {...register("coursePrice",{
                    required:true,
                    valueAsNumber:true
                })}
            />
            <HiOutlineCurrencyRupee className={`absolute ${errors.coursePrice ? "top-[40%]":"top-1/2" } text-richblack-300 ml-4 mt-1 text-lg`}/>
            {
                errors.coursePrice && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                    Course Price is Required.
                </span>
                )
            }
        </div>

        {/* Course Category */}
        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='courseCategory' className='lable-style'>Category<sup className='text-pink-200 ml-1'>*</sup></label>
            <select
                name='courseCategory' id='courseCategory' type='text' placeholder='Choose a Category'
                className='form-style bg-richblack-700'
                defaultValue=""
                {...register("courseCategory",{required:true})}
            >
                <option value="" disabled>Choose a Category</option>
                {
                    !loading && courseCategories?.map((category, index)=>(
                        <option key={index} value={category?._id}>
                            {category?.name}
                        </option>
                    ))
                }
            </select>
            {
                errors.courseCategory && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                    Course Category is Required.
                </span>
                )
            }
        </div>
        {/* create a custom component for handling tags input */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and press Enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        {/* create a custom component for handling Course Thumbnail */}
        <Upload
            name="courseImage"
            label="Course Thumbnail"
            register={register}
            setValue={setValue}
            errors={errors}
            editData={editCourse ? course?.thumbnail : null}
        />

        {/* Benifits of the Course */}
        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='courseBenefits' className='lable-style'>Benefits of the course<sup className='text-pink-200 ml-1'>*</sup></label>
            <textarea
                name='courseBenefits' id='courseBenefits' type='text' placeholder='Enter Benefits of the course'
                className='form-style bg-richblack-700 min-h-[130px]'
                {...register("courseBenefits",{required:true})}
            />
            {
                errors.courseBenefits && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                    Course Benefits is Required.
                </span>
                )
            }
        </div>
        
        {/* Requirements/Instructions */}
        <RequirementsField
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            setValue={setValue}
            errors={errors}
            getValues={getValues}
        />

        {/* Next Button */}
        <div className='flex gap-4'>
            {
                editCourse && (
                    <button
                        onClick={()=>dispatch(setStep(2))}
                        className='bg-richblack-300 order-2 border border-richblack-500 cursor-pointer rounded-md py-2 px-5 font-semibold text-richblack-900'
                    >
                        Continue without Saving
                    </button>
                )
            }

            <IconBtn
                disabled={loading}
                text={!editCourse ? "Next" : "Save Chnages"}

            >
                <MdNavigateNext />
            </IconBtn>
        </div>
    </form>
  )
}

export default CourseInformationForm