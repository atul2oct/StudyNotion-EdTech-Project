import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../api";
const {GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API} = profileEndpoints

// ================ get User Enrolled Courses  ================
export async function getUserEnrolledCourses(token){
    const toastId = toast.loading("Loading...");
    let result=[];
    try{
        const response = await apiConnector("GET",GET_USER_ENROLLED_COURSES_API,null,{
            Authorization: `Bearer ${token}`,
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data.data;
        toast.success("Users Enrolled Courses");
    }catch(error){
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
        toast.error("Unable to fetch Users Enrolled Courses");
        result = error;
    }
    toast.dismiss(toastId);
    return result;
}

// ================ get Instructor Data  ================
export async function getInstructorData(token) {
    // const toastId = toast.loading("Loading...")
    let result = []
    try {
      const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
      result = response?.data?.courses;
    } catch (error) {
      console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
      toast.error("Could Not Get Instructor Data")
    }
    // toast.dismiss(toastId)
    return result
  }