import React, { useEffect, useState } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
// Import required modules
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules'
// Icons
import { FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"


import { ratingsEndpoints } from '../../services/api'
import { apiConnector } from "../../services/apiconnector"

const ReviewSlider = () => {

    const [reviews,setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(()=>{
        const fetchAllReviews = async () => {
            const {data} = await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API);
            console.log(data);
            if(data?.success){
                setReviews(data.allReviews);
            }
            console.log("Printing reviews",reviews);
        }
        fetchAllReviews()
    },[]);
    console.log("Printing reviews",reviews);
  return (
    <div className="text-white w-full">
        <div className="h-[190px] max-w-maxContent">
            <Swiper
            slidesPerView={4}
            spaceBetween={25}
            loop={true}
            freeMode={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay,FreeMode,Pagination]}
            className="w-full"
            >
                {
                    reviews.map((review,index) => (
                        <SwiperSlide key={index}>
                            {/* profile pic ,name ,course name */}
                            <div className="flex gap-5 w-full">
                                <img src={review?.user?.image ?? `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`} alt="profile pic" className="w-9 h-9 aspect-square object-cover rounded-full"/>
                                <div >
                                    <p>{`${review?.user?.firstName} ${review?.user?.lastName}`}</p>
                                    <p>{review?.course?.courseName}</p>
                                </div>
                            </div>
                            {/* review */}
                            <p>{review?.review}</p>
                            {/* Stars */}
                            <div>
                                <p>{review?.rating.toFixed(1)}</p>
                                <ReactStars
                                    count={5}
                                    value={review.rating}
                                    size={20}
                                    edit={false}
                                    emptyIcon={<FaStar/>} 
                                    fullIcon={<FaStar/>}                                    
                                />
                            </div>
                        </SwiperSlide>
                    ))
                }
                
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider