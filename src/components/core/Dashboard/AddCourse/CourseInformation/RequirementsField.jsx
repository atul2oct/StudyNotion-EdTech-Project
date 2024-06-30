import React, { useEffect, useState } from 'react'
import IconBtn from '../../../../common/IconBtn'

const RequirementsField = ({name, label, register, setValue, errors, getValues}) => {
  
  const [requirement,setRequirement] = useState("")
  const [requirementList, setRequirementList] = useState([])

  const handleAddRequirement = () => {
    if(requirement){
        setRequirementList([...requirementList,requirement])
        setRequirement("")
    }
  }
  const handleRemoveRequirement = (index) => {
    const UpdatedRequirementList = [...requirementList]
    UpdatedRequirementList.splice(index,1)
    setRequirementList(UpdatedRequirementList)
  }

  useEffect(()=>{
    register(name, {
        required:true,
        validate: (value)=> value.length > 0
    }
        )
  },[])

  useEffect(()=>{
    setValue(name, requirementList)
  },[requirementList])

    return (
    <div className='flex flex-col items-start gap-3'>   
        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor={name} className='lable-style'>{label}<sup className='text-pink-200 ml-1'>*</sup></label>
            <input
                name={name} 
                id={name} 
                value={requirement}
                type='text' 
                placeholder='Enter Benefits of the course'
                className='form-style bg-richblack-700'
                onChange={(e)=>setRequirement(e.target.value)}
            />
            
            {
                errors[name] && (
                <span className='-mt-1 text-[12px] text-yellow-100'>
                    {label} is Required.
                </span>
                )
            }

        </div>

        <button
        className='text-yellow-5 font-semibold'
        type='button'
        onClick={handleAddRequirement}>
                Add
        </button> 
        
        {
            requirementList.length > 0 && (
                <ul>
                    {
                        requirementList.map((requirement, index) => (
                            <li key={index} className='flex gap-x-4 items-center text-richblack-5'>
                                <span>
                                    {requirement}
                                </span>
                                <button
                                    onClick={() => handleRemoveRequirement(index)}
                                    type='button'
                                    className='text-xs text-pure-greys-300'
                                >
                                    x clear
                                </button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
    </div>
  )
}

export default RequirementsField