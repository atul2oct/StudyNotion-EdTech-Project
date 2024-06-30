import toast from "react-hot-toast";
import { settingsEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
  } = settingsEndpoints

  export function updateDisplayPicture(token, formData) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            )
            console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", response)
            if (!response.data.success) {
                console.log(`Error in res: ${response.data.message}`)
                throw new Error(response.data.message)
            }
            console.log("res",response)
            console.log("res",response.data)
            console.log("res",response.data.data)
            dispatch(setUser(response.data.data))
            localStorage.setItem('user',JSON.stringify(response.data.data))
            toast.success("Image upload successful")
        }catch(error){
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId)
    }
  }

  export function updateProfile(user, token, formData) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        // dispatch(setLoading(true))
        try{
            const response = await apiConnector("PUT",UPDATE_PROFILE_API,formData,{
                Authorization: `Bearer ${token}`,
            })
            
            console.log("res: ",response)
            
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            
            // const userimage = `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firststName} ${response.data.updatedUserDetails.lastName}`

            dispatch(setUser({...user,...response.data.updatedUserDetails}))

            // localStorage.setItem('user',JSON.stringify(response.data.user))

            toast.success("Profile Updated Successfully")

        }catch(error){
            console.log("UPDATE_PROFILE_API API ERROR............", error)
            console.log("error: ",error.response.data.message)
            toast.error("Profile Updated Failure")
        }
        // dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
  }

  export async function changePassword(token, formData) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
console.log("1")
            const response = await apiConnector("POST",CHANGE_PASSWORD_API, formData, {
                Authorization: `Bearer ${token}`,
            })
            console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Password Changed Successfully")

        }catch(error){
            console.log("CHANGE_PASSWORD_API API ERROR............", error)
            toast.error(error.response.data.message)
        }
        toast.dismiss(toastId)
    }
  }

  export function deleteProfile(token, navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector("DELETE",DELETE_PROFILE_API,null,{
                Authorization: `Bearer ${token}`,
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("DELETE_PROFILE_API API RESPONSE............", response)
            toast.success("Profile Deleted Successful")
            dispatch(logout(navigate))

        }catch(error){
            console.log("DELETE_PROFILE_API API ERROR............", error)
            toast.error(error.response.data.message)
        }
        toast.dismiss(toastId)
    }
  }