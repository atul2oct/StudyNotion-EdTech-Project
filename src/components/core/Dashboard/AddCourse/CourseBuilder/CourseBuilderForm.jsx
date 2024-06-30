import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn'
import { IoAddCircleOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import NestedView from './NestedView'
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice'
import toast from 'react-hot-toast'
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI'
import { BiRightArrow } from "react-icons/bi";


const CourseBuilderForm = () => {

  const {register, handleSubmit, setValue, formState:{errors} } = useForm();

  const [editSectionName,setEditSectionName] = useState(null)
  const [loading,setLoading] = useState(false)

  const dispatch = useDispatch()
  const {course} = useSelector(state=>state.course)
  const {token} = useSelector(state=>state.auth)
  console.log(course)

  const onSubmit = async(data) => {
    setLoading(true)
    let result;
    if(editSectionName){
      // we are editing the section name
      result = await updateSection(
        {
          sectionName:data.sectionName,
          sectionId: editSectionName,
          courseId: course._id
        },token
      )
    }else{
      // we are creating the section name
      result = await createSection(
        {
          sectionName:data.sectionName,
          sectionId: editSectionName,
          courseId: course._id
        },token
      )
    }

    // update values
    if(result){
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName","")
    }
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName","")
  }

  const goToNext = () => {
    if(course.courseContent.length === 0){
      toast.error("Please add atleast one section")
      return
    }
    if(course.courseContent.some((section)=>section.subSection.length === 0)){
      toast.error("Please add atleast one section")
      return
    }
    // if every thing is good
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if(editSectionName === sectionId){
      cancelEdit()
      return;
    }
    setEditSectionName(sectionId)
    setValue("sectionName",sectionName)
  }

  return (
    <div className='bg-richblack-800 rounded-lg p-6 border-[1px] border-richblack-700 space-y-6'>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='sectionName' className='lable-style'>Course Title<sup className='text-pink-200 ml-1'>*</sup></label>
            <input
                name='sectionName' id='sectionName' type='text' placeholder='Add a section to build your course'
                className='form-style bg-richblack-700'
                {...register("sectionName",{required:true})}
            />
            {
                errors.courseTitle && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                  Section Name is Required.
                </span>
                )
            }
        </div>
        <div className='flex flex-row items-center w-full gap-x-5 mt-10'>
          <IconBtn
            type="submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            customClasses="text-yellow-50"
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>

          {
            editSectionName && (
              <button
              type='submit'
              onClick={cancelEdit}
              className='text-sm text-richblack-300 underline'
              >
                Cancel Edit
              </button>
            )
          }
          
        </div>
      </form>
      {
        course?.courseContent.length > 0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )
      }
      <div className='flex justify-end gap-x-3 mt-10'>
        <button
          onClick={goBack}
          className='rounded-md cursor-pointer flex items-center'
        >
          Back
        </button>
        <IconBtn text="Next" onClick={goToNext}>
          <BiRightArrow/>
        </IconBtn>
      </div>
    </div>
  )
}

export default CourseBuilderForm
