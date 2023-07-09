import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router'



import MediaLibrary from '../reactcomponents/MediaLibrary'
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js'
import Axios from 'axios'
//import { convertFromRaw } from 'draft-js'
import {Form, Button, Modal} from 'react-bootstrap'
 
import { useNavigate } from 'react-router'


import { useSelector } from 'react-redux'

import TextEditor from '../TextEditor'

function TestimonialView() {
    
    const navigate = useNavigate()
    const [successConditions, setSuccessConditions] = useState({
      textBodyUpdated: false,
      videoUpdated: false
    })


    const [prepareRedirect, setPrepareRedirect] = useState(false)

    const [articleState, setArticleState] = useState({
      title: '',
      description: '',
      previewImage: '',
      includePreview: false

    })
    const [videoTitle, setVideoTitle] = useState('')



    const [useLink, setUseLink] = useState(false);
    const [replaceVideo, setReplaceVideo] = useState(false)
    const [modalData, setModalData] = useState({
      show: false,
      message: '',
      title: ''
    })

    const [video, setVideo] = useState('')
    const [videoLink, setVideoLink] = useState('') //videos can be uploaded/edited by providing a link
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



    const submitVideoLink = ()=>{

      console.log('submitVideoLink fired')
      var videoId = false;
      console.log(`videoLink ${videoLink}`)
      if(videoLink.match('https://youtu.be/') != null)
      {
        console.log('match 1 occurred')
        videoId = videoLink.split('https://youtu.be/')[1]
      }
      if(videoLink.match('https://www.youtube.com/watch?') != null)
      {
        console.log('match 2 occurred')
        videoId = videoLink.split('/watch?v=')[1]
      }

      console.log(`${videoLink.match('https://www.youtube.com/watch?') != null} ${videoLink.match('https://youtu.be/') != null}`)
      if(videoId == false)
      {

        console.log('video id was not set')
        console.log(videoLink)
        console.log(videoId)
        setModalData({title: 'Validation Error', message: 'The youtube link you submitted was invalid', show: true})
        return
      }
        
      const videoThumbnail = `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`
      const thisVideoLink = `https://www.youtube.com/embed/${videoId}`
      console.log(`videoId was foun as: ${videoId}`)
      //const videoLink = 
      Axios.post('http://localhost:3001/update/testimonial/link', {videoThumbnail: videoThumbnail, videoLink: thisVideoLink, videoId: testimonialData[0].videoId}).then((res)=>{
        const {errno, affectedRows} = res.data
        if(errno)
        {
          switch(errno)
          {
            case 1062:
            setModalData({title: 'Database error',message: 'an entry with that title already exists', show: true})
            return;
            default:
            setModalData({title: 'Database error',message: 'an entry with that title already exists', show: true})
            return;

          }
        }
        else 
          if(affectedRows > 0)
            setModalData({title: 'Success!', message: 'The video file has been updated', show:true})
      })
    }

    const uploadChanges = ()=>{

      updateTextBody()
      //un-comment this later


      if(replaceVideo && !useLink)
        submitVideo()


      if(replaceVideo && useLink)
        submitVideoLink()
      
    }
    //might need to use nesting here to ensure both queries complete
    const updateTextBody = ()=>{


      const {textBodyId} = testimonialData[0]



      const {title, description} = articleState
      const textBody = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
      
      Axios.post('http://localhost:3001/api/updateTestimonial', {body: textBody, title: title, previewImage: articleState.previewImage, description: description, textBodyId: textBodyId }).then((res)=>{
      //if(res.data.affectedRows > 0)
      //setModalData({show: true, title: 'Success!', message: 'Article was successfully updated'})
      if(!replaceVideo){
        setPrepareRedirect(true)
        setModalData({title: 'Success!', message: 'Article successfully updated', show: true})
      }
      })



    }




    useEffect(()=>{
        //console.log(`testimonial data length ${testimonialData.length()}`)
        console.log('useEffectFired')
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
            console.log(res.data[0])
            const {title, summary, previewImage} = res.data[0]
            
            setArticleState({...articleState, title: title, previewImage: previewImage, description: summary, includePreview: !(previewImage == null) })


            console.log(`${title} ${summary} ${previewImage}`)
            //setEditorState(res.data[0].body)
            const contentState = convertFromRaw(JSON.parse(res.data[0].body));
            const newState = EditorState.createWithContent(contentState)
            setEditorState(newState)
        })


    }, [])
  return (
    <div id='main-content' className='white-mainclass' style={{height: '100vh', overflowX: 'scroll'}}>


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
                    <Button variant="primary" onClick={()=>{prepareRedirect ? navigate('/Admin/Home') : setModalData({...modalData, show: false})}}>
                      Ok
                    </Button>
                  </Modal.Footer>
                </Modal>

                 {editingMode ? 
                
                <></>
                :
                <h1>{title}</h1>}
                {/* overrideState stateHandler title*/}


                
                <TextEditor overrideState={editorState} overrideStateHandler={setEditorState} articleState={articleState} setArticleState={setArticleState} readOnly={!editingMode} stateHandler={setEditorState}/>

                

                




                {editingMode ? 
                
                
                <Form.Check label='replace video' onClick={(e)=>{setReplaceVideo(e.target.checked);console.log(e.target.checked)}}></Form.Check>
                :
                <></>
                }


                {replaceVideo && !useLink ? <Form.Control onChange={(e)=>{setVideo(e.target.files[0])}} accept='video/mp4' type='file'></Form.Control>:<></>}
                {replaceVideo ? <Form.Check label='Use youtube link' onClick={()=>{setUseLink(!useLink)}}></Form.Check>: <></>}
                {
                  
                  replaceVideo && useLink ?
                  <>
                  <Form.Label>Youtube link</Form.Label>
                  <Form.Control type='text' onChange={(e)=>{setVideoLink(e.target.value)}} placeholder='Youtube link'/>
                  </>:
                  <></>}

                {editingMode ? 
                <Form.Group>
                <Button onClick={()=>{uploadChanges()}}>Publish Changes</Button> 
                </Form.Group>:
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



                {editingMode ? <MediaLibrary/> : <></>}

                </>
                
                
            )
        })
        
        
        }
        
    </div>
  )
}


export default TestimonialView