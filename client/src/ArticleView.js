import React,{useEffect, useState} from 'react';
import Axios from 'axios';
import TextEditor from './TextEditor';
import {Button, Form} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';


import {URLSearchparams, useParams} from "react-router-dom"
import { Title } from '@mui/icons-material';
function ArticleView() {


  const store = useSelector(state => state)
  const location = useLocation();
  const {title} = useParams()
  //const {textBodyId} = location.state;
  const [article, setArticle] = useState([]) 
  const [adminPrivileges, setAdminPrivileges] = useState(false)
  const [video, setVideo] = useState([])
  useEffect(
    ()=>{
      console.log(`title: ${title}`)
      Axios.get(`http://localhost:3001/api/get/article/${title}`).then((res)=>{
        setArticle(res.data)
        console.log(res.data)
      })

      if(store)
      {
        if(store.permissionLevel == "admin")
        {
          setAdminPrivileges(true)
        }
      }
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
    <TextEditor readOnly={!adminPrivileges} showControls={adminPrivileges} threadID={textBodyId}/>
    </>
    )})



    /* The intention here is that you will be able to pass in the id of the article using the threadID prop and
    the TextEditor will pull the corresponding article from the database (I was tired when I coded this) */}
    
    </div>
  
  )
}

export default ArticleView