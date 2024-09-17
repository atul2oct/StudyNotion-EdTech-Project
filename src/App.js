import React from 'react'
import "./App.css"
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/common/Navbar'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import OpenRoute from './components/core/Auth/OpenRoute'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import MyProfile from './components/core/Dashboard/MyProfile'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import Error from './pages/Error'
import Contact from './pages/Contact'
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import Cart from './components/core/Dashboard/Cart'
import Settings from './components/core/Dashboard/Settings'
import { useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from './utils/constants'
import MyCourses from './components/core/Dashboard/MyCourses'
import AddCourse from './components/core/Dashboard/AddCourse'
import EditCourse from './components/core/Dashboard/EditCourse'
import Catalog from './pages/Catalog'
import CourseDetails from './pages/CourseDetails'
import ViewCourse from './pages/ViewCourse'
import VideoDetails from './components/core/ViewCourse/VideoDetails'
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor'

const App = () => {
  const { user } = useSelector((state) => state.profile)
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col
    font-inter'>
    
      <Navbar/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/catalog/:catalogName' element={<Catalog/>}/>
        <Route path='/courses/:courseId' element={<CourseDetails/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path="/about" element={<About/>} />
        <Route path='*' element={<Error/>}/>
        {/* Open Route - for Only Non Logged in User */}
        <Route path='/login' 
          element={<OpenRoute><Login/></OpenRoute>}/>
        <Route path='/signup' 
          element={<OpenRoute><Signup/></OpenRoute>}/>
        <Route path='/forgot-password' 
          element={<OpenRoute><ForgotPassword/></OpenRoute>}/>
        <Route path='/update-password/:id' 
          element={<OpenRoute><UpdatePassword/></OpenRoute>}/>
        <Route path='/verify-email' 
          element={<OpenRoute><VerifyEmail/></OpenRoute>}/>
        
        {/* Private Route - for Only Logged in User */}
        <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
          {/* Route for all users */}
          <Route path='/dashboard/my-profile' element={<MyProfile/>}/>
          <Route path='/dashboard/Settings' element={<Settings/>}/>
          {/* Route only for Student */}
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses/>}/>
                <Route path='/dashboard/cart' element={<Cart/>}/>
              </>
            )
          }
          {/* Route only for Instructors */}
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (<>
              <Route path="dashboard/instructor" element={<Instructor/>} />
              <Route path="dashboard/my-courses" element={<MyCourses/>} />
              <Route path="dashboard/add-course" element={<AddCourse/>} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>} />
            </>)
          }
          
        </Route>
        
        <Route element={<PrivateRoute><ViewCourse/></PrivateRoute>}>
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<VideoDetails/>}/>
              </>
            )
          }
        </Route>
      </Routes>
    </div>
  )
}

export default App