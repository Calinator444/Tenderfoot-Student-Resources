//used for building student testimonials
import {Form, Tooltip, Col, Row, Button} from 'react-bootstrap'


import Mainnav from '../reactcomponents/Mainnav';
import Axios from 'axios'
import TextEditor from '../TextEditor';
import React, {useState, useEffect, useRef} from 'react'



//import {Credentials} from './Youtube-credentials'

//import {uploader} from 'youtube-videos-uploader'
function TestimonialBuilder() {
    const uploadVideo = ()=>{
      //uploadVideo(Credentials, [{}])
      
      const videoData = new FormData()
      videoData.enctype="multipart/form-data"
      videoData.append("videoFile", videoFile)
      videoData.append("title", videoTitle)
      videoData.append("description", videoDescription)


      
      Axios.post("http://localhost:3001/api/uploadVideo", videoData).then((response) =>{
        console.log(response.data)
      })


      console.log('placeholder')
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
    const [videoTitle, setVideoTitle] = useState('')
    const [videoMode, setVideoMode] =  useState(true)
    const [videoFile, setVideoFile] = useState("")
    const [videoDescription, setVideoDescription] = useState('')
    useEffect(()=>{
        //console.log()
        console.log("correct page loaded")
    }, [])

  return (


<>
    <div id='main-content' className='white-mainclass'>

      <h1>Testimonial Builder</h1>
      <p>Testimonials are written and verbal accounts from past and former students. You can also include footage from interviews with these
        students to make the testimonials more engaging.
      </p>
      <Form enctype="multipart/form-data">
        <Row>
        
        <Form.Group as={Col} className='mb-3'>
          <fieldset>
          <legend>Standard controls</legend>
          <Form.Label>
            Title
          </Form.Label>
          <Form.Control type="text" placeholder='title' onChange={(e)=>{
            setVideoTitle(e.target.value)
          }}>
          </Form.Control>
          <Form.Text className="text-muted">
            The name that will appear when this article is listed
          </Form.Text>


          
          <Form.Group>
            <Form.Check defaultChecked="true" onChange={(e)=>{
              setVideoMode(e.target.checked)
            }} label="include video"/>
          </Form.Group>
           </fieldset>

        </Form.Group>
       


        <Form.Group as={Col}>
          <fieldset style={{marginBottom: "20px"}}>
          <legend>Video controls</legend>
          <Form.Group>
          
            <Form.Control className='mb-3' type="file" accept="video/mp4" disabled={!videoMode} onChange={(e)=>{setVideoFile(e.target.files[0])}}/>
              {/* the functionality for uploading videos hasn't been integrate yet */}

          </Form.Group>
          <Form.Group>
          <Form.Text className="text-muted">
            This video will appear at the bottom of the testimonial
          </Form.Text>
          </Form.Group>
          <Form.Label>
             Video Title
          </Form.Label>
          <Form.Control type="text" onChange={(e)=>{setVideoTitle(e.target.value)}} placeholder='video title' disabled={!videoMode}>

          </Form.Control>

          <Form.Label> Video Description</Form.Label>
          <Form.Control onChange={(e)=>{setVideoDescription(e.target.value)}} as="textarea" rows="3" placeholder='video description' disabled={!videoMode}>

          </Form.Control>
          </fieldset>
          </Form.Group>
          





        

        </Row>
        



          
            
      </Form>
      
      {/* This is a text editor, the readOnly state would never change because this information is never displayed to regular site visitors */}
      <TextEditor style={{border: '1px solid black'}} readOnly={false}/>


      {/* Why do I have to apply formatting when I'm using react-booststrap lol */}
      <section className="admin-controls">
      <Button onClick={()=>{dumpContents()}}>
          Dump State
      </Button>

    <Button onClick={()=>{uploadVideo()}}>
        Upload Video
      </Button>
      </section>

      </div>
      </>
  )
}

export default TestimonialBuilder