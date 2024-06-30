import React from 'react'
import { useSelector } from 'react-redux'
import RenderTotalAmount from './RenderTotalAmount'
import RenderCartCourses from './RenderCartCourses'

const Cart = () => {
    const {total, totalItems} = useSelector(state=>state.cart)
  return (
    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
        <h1 className='mb-14 text-3xl text-richblack-5 font-medium'>Your Cart</h1>
        <p className='border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400'>{totalItems} Courses in Cart</p>
        {
            total > 0 ? (<div className='mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row'>
                <RenderCartCourses/>
                <RenderTotalAmount/> 
            </div>)
            :(<div className='mb-14 text-3xl text-richblack-5 font-medium'>Your Cart is Empty</div>)
        }
    </div>
  )
}

export default Cart