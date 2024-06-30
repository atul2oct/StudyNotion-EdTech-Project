import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../../slices/courseSlice'
import { RxCross1 } from "react-icons/rx";
import Upload from '../Upload'
import IconBtn from '../../../../common/IconBtn'

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {

  const {course} = useSelector(state=>state.course)
  const {token} = useSelector(state=>state.auth)
  const dispatch = useDispatch()

  const [loading,setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  // first render pe setValue krlo jo bhi dikhne wla hai video title desc
  useEffect(()=>{
    // sub section already create ho chuka hai
    if(view || edit){
      setValue("lectureTitle",modalData.title)
      setValue("lectureDesc",modalData.description)
      setValue("lectureVideo",modalData.videoUrl)
    }
  }, [])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValue = getValues()
    if(currentValue.lectureTitle !== modalData.title ||
      currentValue.lectureDesc !== modalData.description ||
      currentValue.lectureVideo !== modalData.videoUrl){
        return true
      }else{
        return false
      }
  }

  // handle the editing of subsection
  const handleEditSubSection = async() => {
    const currentValue = getValues()
    const formData = new FormData()
    formData.append("sectionId",modalData.sectionId)
    formData.append("subSectionId",modalData._id)

    // if updated then append
    if(currentValue.lectureTitle !== modalData.title ){
      formData.append("title",currentValue.lectureTitle)
    }
    if(currentValue.lectureDesc !== modalData.description ){
      formData.append("description",currentValue.lectureDesc)
    }
    if(currentValue.lectureVideo !== modalData.videoUrl ){
      formData.append("video",currentValue.lectureVideo)
    }

    setLoading(true)
    // API call
    const result = await updateSubSection(formData,token)
    if(result){
      // result me updated Section aa rha not course
      const updatedCourseContent = course.courseContent.map((section)=>section._id === modalData.sectionId ? result : section)

      const updatedCourse = {...course,courseContent: updatedCourseContent};
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data)=> {
    // view
    if(view){
      return
    }

    // edit
    if(edit){
      if(!isFormUpdated()){
        toast.error("No changes made to the form")
      }else{
        // edit krdo store me
        handleEditSubSection()
      }
      return
    }

    // add
    const formData = new FormData()
    formData.append("SectionId",modalData)
    formData.append("title",data.lectureTitle)
    formData.append("description",data.lectureDesc)
    formData.append("videoFile",data.lectureVideo)

    setLoading(true)

    // API CALL
    console.log("formData",...formData)
    const result = await createSubSection(formData,token)
    if(result){
      // TODO: check for updation
      const updatedCourseContent = course.courseContent.map((section)=>section._id === modalData ? result : section)

      const updatedCourse = {...course,courseContent: updatedCourseContent}
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  return (
    <div>
      <div>
        <div>
          <p>{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
          <button onClick={()=>(!loading ? setModalData(null) : {})}>
            <RxCross1/>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video = {true}
            viewData = {view ? modalData.videoUrl : null}
            editData = {edit ? modalData.videoUrl : null}
          />
          <div>
            <label htmlFor='lectureTitle' className="lable-style">Lecture Title</label>
            <input
              id='lectureTitle'
              placeholder='Enter Lecture Title'
              {...register('lectureTitle',{required:true})}
              className='form-style bg-richblack-700 w-full'
            />
            {errors.lectureTitle && (<span>
              Lecture Title is required
            </span>)}
          </div>
          <div>
            <label htmlFor='lectureDesc' className="lable-style">Lecture Description</label>
            <textarea
              id='lectureDesc'
              placeholder='Enter Lecture Description'
              {...register('lectureDesc',{required:true})}
              className='form-style bg-richblack-700 w-full min-h-[130px]'
            />
            {errors.lectureDesc && (<span>
              Lecture Description is required
            </span>)}
          </div>
          {
            !view && (
              <div>
                <IconBtn text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}/>
              </div>
            )
          }
        </form>
      </div>
    </div>
  )
}

export default SubSectionModal