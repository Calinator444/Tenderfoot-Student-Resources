/*
Author: Caleb Williams
Purpose: A page that can be used re-used to display a list of generic articles

*/



import { compareDates, formatDate, formatTime} from '../Functions/dateArithmethic';
import Mainnav from '../reactcomponents/Mainnav';
import React, {useEffect, useState} from 'react'
import {Pagination, Form, Row, Col} from 'react-bootstrap'
import noPreviewImage from '../resources/no-preview-image.jpg'
import Axios from 'axios';
//Don't ask me why 'Link' isn't exported by react-router, it just isn't
import {Link} from 'react-router-dom';


function TestimonialList(props) {
    const {dataset, gridOverride, testimonials} = props
    const navigationLink = testimonials ? '/Testimonials/' : '/ArticleView/'
    const [articles, setArticleList] = useState([])//not sure if javascript is strongly typed but I used an array here anyway
    const [pageNumbering, setPageNumbering] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const dateFormat = (date)=>{
        const currentDate = new Date()
                const d = new Date(date)
                //refactor this using 
                var dateString;
                switch(compareDates(d))
                {
                    case 1: 
                    dateString = 'yesterday'
                    break;
                    case 0: 
                    dateString = 'today'
                    break;
                    default: 
                    dateString = formatDate(d)//`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
                    break;
                }
                return dateString

    }
    useEffect(()=>{

        console.log(`active indices: ${activeIndex * 6} ${(activeIndex + 1)*6}`)
        setArticleList(dataset)

        console.log(dataset)
        // Axios.get("http://localhost:3001/api/get/testimonials").then(
        // (res)=>{
        //     console.log(res.data)
        //     setArticleList(res.data)
        // }
        // ).catch((err)=>{console.log("we couldn't locate the Article you're looking for :(")})
        let index = 0;
        let tempArray = [];
        for(let i = 0; i < dataset.length; i += 6)
        {


            //storing the index here prevents scoping issues
            let currentIndex = index;
            tempArray.push(
            <Pagination.Item active={activeIndex == currentIndex} onClick={()=>{setActiveIndex(currentIndex)}}>
                {++index}
            </Pagination.Item>)

        }
        setPageNumbering(tempArray)
        

    },[dataset, activeIndex])
  return (
    <>
    
        {/* .slice((activeIndex + 1)*6, (activeIndex + 1)*6) */}


            <Row>
                <Col xs={4}>
                    <Form.Control xs={5} onChange={(e)=>{setSearchTerm(e.target.value)}} placeholder='search'></Form.Control>
                </Col>
            </Row>
        <ul className={gridOverride ? 'article-list-grid' : 'article-list'}>
            {
                //conditional rendering to the rescue fell@s
            searchTerm == '' ?
            articles.slice(activeIndex * 6, (activeIndex + 1)*6).map((values)=>{


                
                
                
                const {title, textBodyId, summary, date} = values;
                //console.log(`textBodyId ${textBodyId}`)

                const currentDate = new Date()
                const d = new Date(date)
                //refactor this using 
                // var dateString;
                // switch(compareDates(d))
                // {
                //     case 1: 
                //     dateString = 'yesterday'
                //     break;
                //     case 0: 
                //     dateString = 'today'
                //     break;
                //     default: 
                //     dateString = formatDate(d)//`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
                //     break;
                // }
                return(
                <li>


                    <div className="head">
                        <div className='thumbnail' style={{ width: "100px", height: "100px", backgroundImage: `url(${noPreviewImage})` }} />
                        <div className='preview-content'>
                        
                    {/* to={{
                    pathname: '/TestimonialView',
                    state: {textBodyId : textBodyId}
                    } */}
                    <Link to={`${navigationLink}${title}`}>
                        <h3>{title}</h3></Link>
                    {`Published: ${dateFormat(new Date(date))} at ${formatTime(new Date(date))}`}

                {/* <p></p> */}
                </div>
                </div>
                <p>{summary}</p>
                </li>)
            }):
            //.title.find(searchTerm) != -1
            articles.filter(val => val.title.toLowerCase().search(searchTerm.toLowerCase()) != -1).map((val)=>
            {
                
                
                const {title, summary, date} = val
                return(
                    
                    <li>
                        <div className="head">
                        <div className='thumbnail' style={{ width: "100px", height: "100px", backgroundImage: `url(${noPreviewImage})` }} />
                        <div className='preview-content'>
                        
                    {/* to={{
                    pathname: '/TestimonialView',
                    state: {textBodyId : textBodyId}
                    } */}
                    <Link to={`/ArticleView/${title}`}>
                        <h3>{title}</h3></Link>
                    {`Published: ${dateFormat(date)} at ${formatTime(new Date(date))}`}

                {/* <p></p> */}
                </div>
                </div>
                <p>{summary}</p>

                    </li>




            )}
            
            
            )

        }
        </ul>




        
        {


        searchTerm == '' ?
        <>



        
        <Pagination>


            {pageNumbering}
        </Pagination> <button onClick={()=>{console.log(activeIndex)}}>Log active index</button></>
        :
            <></>


        }
        </>
  )
}

export default TestimonialList