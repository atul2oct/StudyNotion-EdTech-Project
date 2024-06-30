import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'
import { FiUpload } from "react-icons/fi"
import toast from 'react-hot-toast'
import { updateDisplayPicture } from '../../../../services/operations/SettingsAPI'

const ChangeProfilePicture = () => {
    const dispatch = useDispatch()
    const { token } = useSelector(state=>state.auth)
    const { user } = useSelector(state=>state.profile)

    const [loading,setLoading] = useState(false)
    const [imageFile,setimageFile] = useState(null)
    const [previewSource,setPreviewSource] = useState(null)

    const fileInputRef = useRef(null)

    const handleClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setimageFile(file)
            previewFile(file)
        }
    }

    // find this
    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          setPreviewSource(reader.result)
        }
    }

    const handleFileUpload = () => {
        console.log("uploading...")
        setLoading(true)
        try{
            const formData = new FormData()
            formData.append("displayPicture", imageFile)
            // formData.append("upload_preset", 'StudyNotion')
            dispatch(updateDisplayPicture(token, formData)).then(() => {
                setLoading(false)
              })
        }catch(error){
            console.log("ERROR MESSAGE - ", error.message)
        }
        console.log("uploaded")
        setLoading(false)
    }

    useEffect(()=>{
        if(imageFile){
            previewFile(imageFile)
        }
    },[imageFile])


  return (
    <div className='border-[1px] border-richblack-700 bg-richblack-800 flex flex-row items-center justify-between rounded-md p-8 px-12'>
        <div className='flex items-center gap-x-4'>
            <img src={previewSource || user?.image}
                alt={`profile-${user.firstName}`}
                className='w-[78px] rounded-full aspect-square object-cover'
            />
            <div className='space-y-2'>
                <p>Change Profile Picture</p>
                <div className='flex flex-row gap-3'>
                    <input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' accept="image/png, image/gif, image/jpeg"/>
                    <button className='cursor-pointer rounded-md bg-richblack-700 text-richblack-50 py-2 px-5 font-semibold' onClick={handleClick} disabled={loading}>
                        Select
                    </button>
                    <IconBtn onClick={handleFileUpload} text={loading ? "Uploading...":"Upload"}>
                        {
                            !loading && <FiUpload className="text-lg text-richblack-900" />
                        }
                    </IconBtn>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChangeProfilePicture