//used for building student testimonials
import {Form, Tooltip, Col, Row, Button} from 'react-bootstrap'
import ErrorModal from '../reactcomponents/ErrorModal';
import {convertToRaw, EditorState} from 'draft-js'
import MediaLibrary from '../reactcomponents/MediaLibrary';
import Mainnav from '../reactcomponents/Mainnav';
import Axios from 'axios'
import TextEditor from '../TextEditor';
import React, {useState, useEffect, useRef} from 'react'
import noPreviewImage from '../resources/no-preview-image.jpg'
import {getVideoId} from '../Functions/youtubeTools'


//import {Credentials} from './Youtube-credentials'

//import {uploader} from 'youtube-videos-uploader'
function TestimonialBuilder() {



    const [state, setState] = useState({
      title: '',
      includeThumbnail: false,
      previewImage: noPreviewImage,
      includePreview: false,
      imageFound: true,
       
      
    })
    const [errorMessage, setErrorMessage] = useState(
      {
        title: '',
        message: '',
        show: false
      }
    )

    const [editorState, setEditorState] = useState(
      ()=>EditorState.createEmpty(),
    )
    const uploadVideo = ()=>{
      
      //uploadVideo(Credentials, [{}])
      console.log(`preview image ${state.previewImage}`)

      const videoData = new FormData()
      videoData.enctype="multipart/form-data"
      //if(useVideoLink)\
      videoData.append('previewImage', state.includePreview && state.imageFound ? state.previewImage : null)

      if(useVideoLink)
      {
        const videoId = getVideoId(videoLink)
        console.log(videoId)
        if(videoId == null)
        {
          setErrorMessage({title: 'Form Invalid', message: 'the youtube link you entered was not valid', show:true})
          return
        }
        const videoThumbnail = `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`
        const thisVideoLink = `https://www.youtube.com/embed/${videoId}`
        videoData.append('videoThumbnail', videoThumbnail)
        videoData.append('videoLink',thisVideoLink)

      }
      else
      {

        videoData.append("videoFile", videoFile)
      }
      videoData.append("title", videoTitle)
      

      videoData.append("description", videoDescription)
      videoData.append("testimonialTitle", state.title )
      videoData.append("testimonialBody", JSON.stringify(convertToRaw(editorState.getCurrentContent())))
      Axios.post("http://localhost:3001/api/uploadTestimonial", videoData ).then((res) =>{
        console.log(res)
        const {errno} = res.data;
        if(errno)
        {
          switch(errno)
          {
            case 1062:
            setErrorMessage({ ...errorMessage ,title: 'Database error', message: 'An article with that title already exists', show:true})
            return
            default:
            //This is a vague response but it's better than nothing
            setErrorMessage({ ...errorMessage ,title: 'Database error', message: 'An internal server error occurred', show:true})
            return

          }
        }
        else
        {
          if(res.data.affectedRows > 0)
            setErrorMessage({title: 'Success!',message: 'Student testimonial was successfully uploaded. The video may take some additional time to process.',show: true})
        }
          console.log(res.data)
      })


    }
    const [video, setVideo] = useState({})
    // const checkChange = ()=>{
    //   refInput.disabled = true;
    // }
    const dumpContents = ()=>{
      console.log(`Video Title: ${videoTitle}`);
      console.log(`Include Video: ${videoMode}`);
      console.log(`Video File: ${videoFile}`)
      console.log(`Video Description: ${videoDescription}`)
    }


    const [useVideoLink, setUseVideoLink] = useState(false)
    const [videoLink, setVideoLink] = useState('')
    const [videoTitle, setVideoTitle] = useState('')
    const [videoMode, setVideoMode] =  useState(true)
    const [videoFile, setVideoFile] = useState("")
    const [videoDescription, setVideoDescription] = useState('')
    const [title, setTitle] = useState('');



    useEffect(()=>{
        //console.log()
        console.log("correct page loaded")
    }, [])

  return (


<>
    <div id='main-content' className='white-mainclass' style={{overflowY: 'scroll', height: '100vh'}}>

      <h1>Testimonial Builder</h1>
      <p>Testimonials are written and verbal accounts from past and former students. You can also include footage from interviews with these
        students to make them more engaging.
      </p>
      <Form enctype="multipart/form-data">
        <Row>
        
        {/* <Form.Group as={Col} className='mb-3'>
          <fieldset>
          <legend>Article Settings</legend>
          <Form.Label>
            Title
          </Form.Label>
          <Form.Control type="text" placeholder='title' onChange={(e)=>{
            // setVideoTitle(e.target.value)
            setTitle(e.target.value)
          }}>
          </Form.Control>
          <Form.Text className="text-muted">
            The name that will appear when this article is listed
          </Form.Text>


          
          <Form.Group>

          </Form.Group>
           </fieldset> */}
{/* 
        </Form.Group> */}
       

        <ErrorModal errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
        <Form.Group as={Col}>
          <fieldset style={{marginBottom: "20px"}}>
          <legend>Video controls</legend>

            
          <Form.Group>
          <Row>
            <Col>
              <Form.Check defaultChecked="true" onChange={(e)=>{
              setVideoMode(e.target.checked)
            }} label="include video"/>
            </Col>
            <Col>
              <Form.Check defaultChecked={false} onChange={(e)=>setUseVideoLink(e.target.checked)} label='Provide Youtube link'/>
            </Col>
          </Row>

          </Form.Group>


          <Form.Group>
          {useVideoLink ? 

          <>
            <Form.Label>Video Link</Form.Label>
            <Form.Control type='text' onChange={(e)=>{setVideoLink(e.target.value)}} placeholder='Video link'/>
          </>:
          <Form.Control className='mb-3' type="file" accept="video/mp4" disabled={!videoMode} onChange={(e)=>{setVideoFile(e.target.files[0])}}/>
          }

          </Form.Group>
          <Form.Group>
          <Form.Text className="text-muted">
            This video will appear at the bottom of the testimonial
          </Form.Text>
          </Form.Group>
          <Form.Label>
             Video Title
          </Form.Label>
          <Form.Control type="text" onChange={(e)=>{setVideoTitle(e.target.value)}} placeholder='Video title' disabled={!videoMode}>

          </Form.Control>

          <Form.Label> Video Description</Form.Label>
          <Form.Control onChange={(e)=>{setVideoDescription(e.target.value)}} as="textarea" rows="3" placeholder='Video description' disabled={!videoMode}>

          </Form.Control>
          </fieldset>
          </Form.Group>
          





        

        </Row>
        



          
            
      </Form>
      <fieldset style={{marginBottom: "20px"}}>
      <legend>Text Editor</legend>
      {/* This is a text editor, the readOnly state would never change because this information is never displayed to regular site visitors */}
      <TextEditor style={{border: '1px solid black'}} articleState={state} setArticleState={setState} readOnly={false} overrideState={editorState} overrideStateHandler={setEditorState}/>


      {/* Why do I have to apply formatting when I'm using react-booststrap lol */}
      <section className="admin-controls">
      <Button onClick={()=>{console.log(state)}}>
          Dump State
      </Button>

      <Button onClick={()=>{uploadVideo()}}>
        Upload Video
      </Button>
      </section>
      </fieldset>
      <MediaLibrary/>
      </div>
      </>
  )
}

export default TestimonialBuilder