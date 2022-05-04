/*
Author: Caleb Williams
Purpose: A page that can be used re-used to display a list of testimonials/generic articles

*/

import Mainnav from '../reactcomponents/Mainnav';
import React, {useEffect, useState} from 'react'
import Axios from 'axios';
//Don't ask me why 'Link' isn't exported by react-router, it just isn't
import {Link} from 'react-router-dom';
function TestimonialList(props) {
    const {dataset, gridOverride} = props

    const [articles, setArticleList] = useState([])//not sure if javascript is strongly typed but I used an array here anyway
    useEffect(()=>{
        setArticleList(dataset)
        // Axios.get("http://localhost:3001/api/get/testimonials").then(
        // (res)=>{
        //     console.log(res.data)
        //     setArticleList(res.data)
        // }
        // ).catch((err)=>{console.log("we couldn't locate the Article you're looking for :(")})
    },[dataset])
  return (
    <>
    


        <ul className={gridOverride ? 'article-list-grid' : 'article-list'}>
            {articles.map((values)=>{

                
                const {title, textBodyId, summary} = values;
                console.log(`textBodyId ${textBodyId}`)
                return(
                <li>
                    <div className='thumbnail' style={{backgroundColor: "red", width: "100px", height: "100px"}}></div>
                    <div className='preview-content'>
                    
                    {/* to={{
                    pathname: '/TestimonialView',
                    state: {textBodyId : textBodyId}
                } */}
                    <Link to={`/ArticleView/${title}`}
                ><h3>{title}</h3></Link>

                <p>{summary}</p>
                
                </div>
                </li>)
            })
        }
        </ul>
        
        </>
  )
}

export default TestimonialList