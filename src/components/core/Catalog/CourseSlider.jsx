import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import Course_Card from './Course_Card'
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules'


const CourseSlider = ({Courses}) => {
  console.log("Courses",Courses)

  return (
    <>
      {
        Courses?.length > 0 ? (
          <Swiper
            slidesPerView={1}
            loop={true}
            spaceBetween={25}
            modules={[Autoplay,FreeMode,Pagination,Navigation]}
            pagination={{ clickable: true }}
            className="mySwiper max-h-[30rem]"
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            navigation={true}
            breakpoints={{
                1024:{slidesPerView:3,},
            }}        
          >
            {
              Courses?.map((course,index)=>(
                <SwiperSlide key={index}>
                  <Course_Card course={course} Height={'h-[250px]'}/>
                </SwiperSlide>
              ))
            }
          </Swiper>
        ) : (
          <p className="text-xl text-richblack-5">No Course Found</p>
        )
      }
    </>
  )
}

export default CourseSlider