import React, {useEffect, useState} from 'react'
import ListGeneric from './ListGeneric'
import Axios from "axios"
import TestimonialCarousel from '../reactcomponents/TestimonialCarousel'
import Mainnav from "../reactcomponents/Mainnav"

function TestimonialList() {
    useEffect(()=>{
    Axios.get("http://localhost:3001/api/get/testimonials").then((res)=>{
      setData(res.data)
    })
},[])


    const [data, setData] = useState([])

  return(
      <>
      {/* <Mainnav/> */}
        <div className='white-mainclass' id="main-content" style={{height: '100vh'}}>
        <h1>Testimonials</h1>
        <p>Check out one of our testimonials from former first year students who started out just like you</p>
        <TestimonialCarousel testimonialData={data}/>
        {/* <ListGeneric dataset={data} testimonials/> */}
    </div>
    </>
  )
}

export default TestimonialList