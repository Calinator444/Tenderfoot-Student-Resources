//import "../css/App.css";
import React,{useState} from 'react';
import {Carousel} from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router';
import { scaleThumbnail } from '../Functions/imageScale';
import noPreviewImage from '../resources/no-preview-image.jpg'

//import "bootstrap/dist/css/bootstrap.css";


import { formatDate, formatTime } from '../Functions/dateArithmethic';

//import React,  from 'react'
function TestimonialCarousel(testimonialData){
    //console.log(testimonialData)
    const navigate = useNavigate()
    const [activeIndex, setActiveIndex] = useState(0)
    const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={activeIndex} onSelect={handleSelect}>



            
            {
            testimonialData.testimonialData.map((val) => {

                const {title, date, previewImage} = val
                return (
                    <Carousel.Item>
                        <img src={previewImage == undefined ? noPreviewImage : previewImage} alt="student-profile" style={{width: '100%', height: '600px', objectFit: 'cover'}} />
                        <Carousel.Caption>
                            <h2 onClick={()=>{navigate(`/Testimonials/${title}`)}}>{title}</h2>
                            <p>{`Posted: ${formatDate(new Date(date))} at ${formatTime(new Date(date))}`}</p>
                        </Carousel.Caption>
                    
                    </Carousel.Item>
                )
            })}
        </Carousel>
    )
}

export default TestimonialCarousel;