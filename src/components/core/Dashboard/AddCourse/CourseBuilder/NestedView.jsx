import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu} from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import ConfirmationModal from '../../../../common/ConfirmationModal';
import { BiSolidDownArrow } from "react-icons/bi";
import {AiOutlinePlus} from "react-icons/ai"
import SubSectionModal from './SubSectionModal';
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';

const NestedView = ({handleChangeEditSectionName}) => {

  const {course} = useSelector(state=>state.course)
  const {token} = useSelector(state=>state.auth)
  const dispatch = useDispatch()

  const [addSubSection,setAddSubSection] = useState(null)
  const [viewSubSection,setViewSubSection] = useState(null)
  const [editSubSection,setEditSubSection] = useState(null)
  const [confirmationModal,setConfirmationModal] = useState(null)

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id
      },
      token
    )
    console.log("PRINTING AFTER DELETE SECTIOn", result);
    if(result){
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }
  const handleDeleteSubSection = async (SubSectionId, sectionId) => {
    const result = await deleteSubSection(
      {
        SubSectionId,
        sectionId,
        token
      },
    )
    if(result){
      const updatedCourseContent = course.courseContent.map((section)=>section._id === sectionId ? result : section)

      const updatedCourse = {...course,courseContent: updatedCourseContent};
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  return (
    <div className='mt-10'>
      <div className='rounded-lg bg-richblack-700 p-6 px-8'>
        {/* show krna hai hide krna hai */}
        {course?.courseContent?.map((section)=>(
          <details key={section._id} open>
            <summary className='flex items-center justify-between gap-x-3 border-b-2'>

              {/* section */}
              <div className='flex flex-row items-center gap-x-3'>
                <RxDropdownMenu className='text-xl text-richblack-300'/>
                <p>{section.sectionName}</p>
              </div>
              
              <div className='flex items-center gap-x-3'>

                {/* edit button */}
                <button onClick={()=>handleChangeEditSectionName(section._id,section.sectionName)}>
                  <MdEdit className='text-xl text-richblack-300'/>
                </button>

                {/* delete button */}
                <button onClick={()=>{
                  setConfirmationModal({
                    text1: "Delete this Section",
                    text2: "All lectures in this Section will be deleted",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: ()=>handleDeleteSection(section._id),
                    btn2Handler: ()=>setConfirmationModal(null),
                  })
                }}>
                  <RiDeleteBin6Line className='text-xl text-richblack-300'/>
                </button>

                {/* | */}
                <span className='text-xl text-richblack-300'>|</span>

                {/* down arrow button */}
                <BiSolidDownArrow className='text-xl text-richblack-300'/>
              </div>
              
            </summary>

            {/* Render All Sub Sections Within a Section */}
                <div className="px-6 pb-4">
                  {
                    section.subSection.map((data)=>(
                      <div key={data?._id} onClick={()=>setViewSubSection(data)} className='flex items-center justify-between gap-x-3 border-b-2'>

                        {/* sub-section */}
                        <div className='flex flex-row items-center gap-x-3'>
                          <RxDropdownMenu className='text-xl text-richblack-300'/>
                          <p>{data.title}</p>
                        </div>

                        <div onClick={(e) => e.stopPropagation()}
                        className='flex items-center gap-x-3'>

                          {/* edit button */}
                          <button onClick={()=>setEditSubSection({...data, sectionId:section._id})}>
                            <MdEdit className='text-xl text-richblack-300'/>
                          </button>

                          {/* delete button */}
                          <button onClick={()=>{
                            setConfirmationModal({
                              text1: "Delete this Sub Section",
                              text2: "Current lecture will be deleted",
                              btn1Text: "Delete",
                              btn2Text: "Cancel",
                              btn1Handler: ()=>handleDeleteSubSection(data._id, section._id),
                              btn2Handler: ()=>setConfirmationModal(null),
                            })
                          }}>
                            <RiDeleteBin6Line className='text-xl text-richblack-300'/>
                          </button>
                        </div>                        

                      </div>
                    ))
                  }

                  <button className='mt-4 flex items-center gap-x-2 text-yellow-50 text-base' onClick={()=>setAddSubSection(section._id)}>
                    <AiOutlinePlus/>
                    <p>Add Lecture</p>
                  </button>
                </div>
          </details>
        ))}
      </div>

      {/* Modal Display */}
      {
        addSubSection ? (<SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true}/>)

        : viewSubSection ? (<SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true}/>)

        : editSubSection ? (<SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true}/>)

        : (<></>)
      }

      {/* Confirmation Modal */}
      {
        confirmationModal && (<ConfirmationModal modalData={confirmationModal}/>)
      }
    </div>
  )
}

export default NestedView