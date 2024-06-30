import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard = () => {
    const {loading: authLoading} = useSelector(state=>state.auth)
    const {loading: profileLoading} = useSelector(state=>state.profile)

    if(authLoading || profileLoading){
        return(
            <div className='spinner'></div>
        )
    }
  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)] text-richblack-5'>
        <Sidebar/>
        <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
            <>
                <Outlet/>
            </>
        </div>
    </div>
  )
}

export default Dashboard