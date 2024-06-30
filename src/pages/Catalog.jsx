import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/api'
import { getCatalogaPageData } from '../services/operations/pageAndComponentData'
import Course_Card from '../components/core/Catalog/Course_Card'
import CourseSlider from '../components/core/Catalog/CourseSlider'

const Catalog = () => {

  const {catalogName} = useParams()
  
  const [catalogPageData,setCatalogPageData] = useState(null)
  const [categoryId,setCategoryId] = useState()
  
  // fetch All Categories
  useEffect(()=>{

    const getCategories = async() => {
      const result = await apiConnector('GET',categories.CATEGORIES_API)
      console.log("All Category result",result)
      const category_id = result?.data?.data?.filter(category => category.name.split(" ").join('-').toLowerCase() === catalogName)[0]._id;
      setCategoryId(category_id)
      // console.log("category_id",category_id)
      // console.log("category_id",category_id[0]._id)
    }

    getCategories()
  },[catalogName])

  useEffect(()=>{
    const getCategoryDetails = async() => {
      try{
        const result = await getCatalogaPageData(categoryId)
        setCatalogPageData(result)
      }catch(error){
        console.log(error)
      }
    }

    if(categoryId)
      getCategoryDetails()
    
  },[categoryId])
  
  return (
    <div className='text-white'>
      {/* top level section */}
      <div>
        <p>{`Home / Catalog /`}
        <span>
          {catalogPageData?.data?.selectedCategory?.name}
        </span></p>
        <p>{catalogPageData?.data?.selectedCategory?.name}</p>
        <p>{catalogPageData?.data?.selectedCategory?.description}</p>
      </div>


      {/* Courses to Bought */}
      <div>
        {/* Section 1 */}
        <div>
        <div>Courses to get you started</div>
          <div className='flex gap-x-3'>
            <p>Most Popular</p>
            <p>New</p>
          </div>
          <div>
            <CourseSlider Courses={catalogPageData?.data?.selectedCategory.courses} />
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <p>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</p>
          <div>
            <CourseSlider Courses={catalogPageData?.data?.differentCategory.courses}/>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <p>Frequently Bought Together</p>
          <div className='py-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              {
                catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                .map((course,index)=>(
                  <Course_Card course={course} key={index} Height="h-[400px]"/>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      <Footer/>
      
    </div>
  )
}

export default Catalog