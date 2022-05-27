import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router'
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'
import Axios from 'axios'
//import { convertFromRaw } from 'draft-js'
import {Form, Button, Modal} from 'react-bootstrap'
 
import { useNavigate } from 'react-router'


import { useSelector } from 'react-redux'

import TextEditor from '../TextEditor'

function TestimonialView() {
    
    const navigate = useNavigate()

    // const [formData, setFormData] = {
    //   VideoTitle: '',
      



    // }



    const [successConditions, setSuccessConditions] = useState({
      textBodyUpdated: false,
      videoUpdated: false
    })
    const [videoTitle, setVideoTitle] = useState('')
    const [replaceVideo, setReplaceVideo] = useState(false)
    const [modalData, setModalData] = useState({
      show: false,
      message: '',
      title: ''
    })

    const [video, setVideo] = useState('')
    const store = useSelector(state => state)
    const [editingMode, setEditingMode] = useState(false)
    const submitVideo = ()=>{



      //by default the testimonial edit just replaced the video but leaves the description and title the same
      const {videoTitle, videoDescription} = testimonialData[0]
      let formData = new FormData()
      formData.enctype="multipart/form-data"
      formData.append("videoFile",video)
      formData.append('videoTitle',videoTitle)

      formData.append('videoDescription', videoDescription)
      //formData.append("", formData)
      Axios.post('http://localhost:3001/update/testimonial',formData)
    }

    const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
    const {title} = useParams()
    const [testimonialData, setTestimonialData] = useState([])





    const uploadChanges = ()=>{

      udpateTextBody()
      //un-comment this later


      if(replaceVideo)
        submitVideo()
    }
    //might need to use nesting here to ensure both queries complete
    const udpateTextBody = ()=>{


      const {textBodyId} = testimonialData[0]
      const textBody = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
      
      Axios.post('http://localhost:3001/api/updateTestimonial', {body: textBody, textBodyId: textBodyId }).then((req,res)=>{




      })



    }




    useEffect(()=>{
        //console.log(`testimonial data length ${testimonialData.length()}`)

        //setVideoTitle(title)
        if(store)//check user is logged in
        {
          if(store.permissionLevel == 'admin')
          {
            setEditingMode(true)
            setVideoTitle(title)
          }
        }
        Axios.get(`http://localhost:3001/api/get/testimonial/${title}`).then((res)=>{


            console.log(res.data)


            //techinically this could return multiple testimonials, but the title has a unique constraint applied in the database
            setTestimonialData(res.data)
            //setEditorState(res.data[0].body)
            const contentState = convertFromRaw(JSON.parse(res.data[0].body));
            const newState = EditorState.createWithContent(contentState)
            setEditorState(newState)
        })


    }, [])
  return (
    <div id='main-content' className='white-mainclass'>


        {



        testimonialData.map((val)=>{
            const {title, body, videoLink} = val
            console.log(`videoLink set to ${videoLink}`)
            return(
                <>
                <Modal show={modalData.show}>
                  <Modal.Header closeButton>
                    <Modal.Title>{modalData.title}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{modalData.message}</Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={()=>{navigate('/Admin/Home')}}>
                      Ok
                    </Button>
                  </Modal.Footer>
                </Modal>

                {editingMode ? 
                <>
                <Form.Label>Title: </Form.Label>
                <Form.Control style={{marginBottom: '50px'}} onChange={(e)=>{setVideoTitle(e.target.value)}} type='text' value={title}></Form.Control>
                </>
                :
                <h1>{title}</h1>}
                {/* overrideState stateHandler title*/}




                
                <TextEditor overrideState={editorState} readOnly={!editingMode} stateHandler={setEditorState}/>

                

                




                {editingMode ? 
                
                
                <Form.Check label='replace video' onClick={(e)=>{setReplaceVideo(e.target.checked);console.log(e.target.checked)}}></Form.Check>
                :
                <></>
                }


                {replaceVideo ? <Form.Control onChange={(e)=>{setVideo(e.target.files[0])}} accept='video/mp4' type='file'></Form.Control>:<></>}



                {editingMode ? 
                <Button onClick={()=>{uploadChanges()}}>Publish Changes</Button> :
                <></>
                }
                <iframe

          //560x315 aspect ratio
            // width="853"
            // height="505"
                src={videoLink}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                >   </iframe>
                </>
                
                
            )
        })
        
        
        
        }
        
    </div>
  )
}


export default TestimonialView