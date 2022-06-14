import React,{useEffect, useState} from 'react';
import Axios from 'axios';
import TextEditor from './TextEditor';
import {Button, Form, Modal} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
import MediaLibrary from './reactcomponents/MediaLibrary';
import Thread from './reactcomponents/Thread';
import {useParams} from "react-router-dom"
import { Title } from '@mui/icons-material';
function ArticleView() {




  //const [adminPriveleges, setAdminPrivileges] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    show: false,
    title: '',
    message: ''
  })

  const [threadId, setThreadId] = useState('')





  const [mediaLibrary, setMediaLibrary] = useState([])
  const store = useSelector(state => state)
  const location = useLocation();
  const {title} = useParams()
  const [editTitle,setEditTitle] = useState(title)
  //const {textBodyId} = location.state;
  const [article, setArticle] = useState([]) 
  const [adminPrivileges, setAdminPrivileges] = useState(false)
  const [video, setVideo] = useState([])
  useEffect(
    ()=>{
      console.log(`title: ${title}`)
      // Axios.get(`http://localhost:3001/api/gaet/article/${title}`).then((res)=>{
      //   setArticle(res.data)
      //   console.log(res.data)
      // })

      if(store)
      {


        console.log(`permission level was set to ${store.permissionLevel}`)
        if(store.permissionLevel == "admin")
        {
          setAdminPrivileges(true)
        }
      }




      if(adminPrivileges)
        Axios.get('http://localhost:3001/get/media')
       //console.log(`textBodyId : ${title}`)
    },[]
  )
      /* <TextEditor readOnly={readOnly} threadID={textBodyId}/> */

  return (
    <>
    <div id="main-content" className='white-mainclass' style={{overflowX: 'scroll', height: '100vh'}}>


    {/* {article.map((val)=>{ */}
{/* 
    const {textBodyId, title} = val
    return(
    
    <> */}


    {/* {adminPrivileges ? 
    
    
    
    <>

      <Form.Label>Title</Form.Label>

      <Form.Control type='text'></Form.Control>
    </>

    :*/}



    {adminPrivileges ? <></>:
    <h1>{title}</h1>}


    {console.log(`read only was set to: ${!adminPrivileges}`)}
    <Modal
        show={errorMessage.show}
        //onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{errorMessage.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage.message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>{setErrorMessage({...errorMessage, show: false})}}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    <TextEditor setThreadId={setThreadId} readOnly={!adminPrivileges} showControls={adminPrivileges} title={title} setErrorMessage={setErrorMessage}/>
    {/* </> */}
    {/* ) */}


    {adminPrivileges ?<MediaLibrary/> :<></>}
    
  
  {/* }) */}



    {/* /* The intention here is that you will be able to pass in the id of the article using the threadID prop and
    the TextEditor will pull the corresponding article from the database (I was tired when I coded this) */}
    
    </div>
    <Thread threadID={threadId}/>




    
    </>
  
  )
}

export default ArticleView