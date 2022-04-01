/*
Author: Caleb Williams
Purpose: A page that lets users browse which testimonials they'd like to see

*/



import React, {useEffect, useState} from 'react'
import Axios from 'axios';
//Don't ask me why 'Link' isn't exported by react-router, it just isn't
import {Link} from 'react-router-dom';
function TestimonialList() {

    const [testimonials, setTestimonials] = useState([])//not sure if javascript is strongly typed but I used an array here anyway
    useEffect(()=>{


        console.log('useEffect fired')
        Axios.get("http://localhost:3001/api/get/testimonials").then(
        (res)=>{
            console.log(res.data)
            setTestimonials(res.data)
        }
        )
        console.log('useEffect complete')
    },[])
  return (
    <div className='white-mainclass' id="main-content">
        <h1>Testimonial list</h1>
        <p>select a testimonial to view</p>
        <ul>
            {testimonials.map((values)=>{
                const {title, testimonialId} = values;
                console.log(`testimonialId ${testimonialId}`)
                return(
                <li> <Link to={{
                    pathname: '/TestimonialView',
                    state: {testimonialId : 2}
                }}>{title}</Link></li>)
            })}
        </ul>
        </div>
  )
}

export default TestimonialList