/*
Author: Caleb Williams
Purpose: A page that lets users browse which testimonials they'd like to see

*/

import Mainnav from '../reactcomponents/Mainnav';
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
        ).catch((err)=>{console.log("we couldn't locate the testimonial you're looking for :(")})
        console.log('useEffect complete')
    },[])
  return (
    <>
    <Mainnav/>
    <div className='white-mainclass' id="main-content">




        <h1>Testimonial list</h1>
        <p>check out the list of written and verbal testimonials we have from current and past students. Doing so may provide some insights into how you can improve your studies.</p>
        <ul className='testimonial-list'>
            {testimonials.map((values)=>{
                const {title, textBodyId} = values;
                console.log(`textBodyId ${textBodyId}`)
                return(
                <li>
                    <div className='thumbnail' style={{backgroundColor: "red", width: "100px", height: "100px"}}></div>
                    <div className='preview-content'>
                    
                    
                    <Link to={{
                    pathname: '/TestimonialView',
                    state: {textBodyId : textBodyId}
                }
                }><h3>{title}</h3></Link>

                <p>This is an example paragraph</p>
                
                </div>
                </li>)
            })
        }
        </ul>
        </div>
        </>
  )
}

export default TestimonialList