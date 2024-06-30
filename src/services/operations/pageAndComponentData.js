import React from 'react'
import toast from 'react-hot-toast'
import { apiConnector } from '../apiconnector'
import { catalogData } from '../api'

export const getCatalogaPageData = async(categoryId) => {
    const toastId = toast.loading('Loading...')
    let result = []
    try{
        const response = await apiConnector('POST',catalogData.CATALOGPAGEDATA_API,{categoryId:categoryId})

        if(!response?.data?.success){
            throw new Error("Could not fetch Category page data",response)
        }

        result = response?.data
    }catch(error){
        console.log("Catalog Page Data API Error",error)
        toast.error(error.message)
        result = error.response?.data;
    }
    toast.dismiss(toastId)
    return result;
}