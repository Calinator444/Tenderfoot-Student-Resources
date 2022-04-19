import React,{useEffect, useState} from 'react';
import Axios from 'axios';
import TextEditor from './TextEditor';
import {Button, Form} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';


import {URLSearchparams, useParams} from "react-router-dom"
import { Title } from '@mui/icons-material';
function ArticleView() {
  const location = useLocation();
  const {title} = useParams()
  //const {textBodyId} = location.state;
  const [readOnly, setReadOnly] = useState(false)
  const [article, setArticle] = useState([])
  const [adminPrivileges, setAdminPrivileges] = useState(true)
  const [video, setVideo] = useState([])
  useEffect(
    ()=>{
      console.log(`title: ${title}`)
      Axios.get(`http://localhost:3001/api/get/article/${title}`).then((res)=>{
        setArticle(res.data)
        console.log(res.data)
      })
      console.log("testimonialView reached")
       //console.log(`textBodyId : ${title}`)
    },[]
  )
      /* <TextEditor readOnly={readOnly} threadID={textBodyId}/> */

  return (
    
    <div id="main-content" className='white-mainclass'>


    {article.map((val)=>{

    const {textBodyId, title} = val
    return(
    <>
    <h1>{title}</h1>
    <TextEditor readOnly threadID={textBodyId}/>
    </>
    )})



    /* The intention here is that you will be able to pass in the id of the article using the threadID prop and
    the TextEditor will pull the corresponding article from the database (I was tired when I coded this) */}
    
    </div>
  
  )
}

export default ArticleView