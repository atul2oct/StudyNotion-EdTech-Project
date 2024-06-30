import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../api";
const {GET_USER_ENROLLED_COURSES_API} = profileEndpoints

export async function getUserEnrolledCourses(token){
    const toastId = toast.loading("Loading...")
    let result=[]
    try{
        console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
        const response = await apiConnector("GET",GET_USER_ENROLLED_COURSES_API,null,{
            Authorization: `Bearer ${token}`,
        })
        console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        result = response.data.data
        toast.success("Users Enrolled Courses");
    }catch(error){
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
        toast.error("Unable to fetch Users Enrolled Courses");
    }
    toast.dismiss(toastId)
    return result
}