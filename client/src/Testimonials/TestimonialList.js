import React, {useEffect, useState} from 'react'
import ListGeneric from './ListGeneric'
import Axios from "axios"

import Mainnav from "../reactcomponents/Mainnav"

function TestimonialList() {
    useEffect(()=>{
    Axios.get("http://localhost:3001/api/get/testimonials").then((res)=>{setData(res.data)})
},[])


    const [data, setData] = useState([])

  return(
      <>
      {/* <Mainnav/> */}
        <div className='white-mainclass' id="main-content">


        <ListGeneric dataset={data} testimonials/>
    </div>
    </>
  )
}

export default TestimonialList