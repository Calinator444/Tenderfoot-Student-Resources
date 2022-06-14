import React, {useState, useEffect} from 'react'
import {Form, Row, Col, Button} from 'react-bootstrap'
import ErrorModal from '../reactcomponents/ErrorModal'
import { getVideoId as importGetVideoId} from '../Functions/youtubeTools'


import Axios from 'axios'
//import { getVideoId } from '../Functions/youtubeTools'



import { useParams } from 'react-router'

function VideoUpload() {
const {getVideoId} = useParams()

    const [retrievedData, setRetrievedData] = useState(false)


    useEffect(()=>{
    console.log(`video ID: ${getVideoId}`)
    if(getVideoId){
        //ensure request doesn't fire everytime useEffect fires
        if(!retrievedData){
        Axios.get(`http://localhost:3001/api/get/video/${getVideoId}`).then((res)=>{
            const {videoTitle, videoDescription} = res.data[0]


            console.log(res.data)
            console.log('get request complete')
            setFormData({...formData, title: videoTitle, description: videoDescription, useLink: true})
            setRetrievedData(true)
        })
        }
    
    
    }
    else
        console.log('videoId not provided')
},[])



const [replaceVideo, setReplaceVideo] = useState(false)
const updateVideo = ()=>{


    const videoID = importGetVideoId(formData.videoLink)

    var params = {videoDescription: formData.description, videoTitle: formData.title, videoId: getVideoId}

    if(replaceVideo)
    {
        const videoThumbnail = `http://i3.ytimg.com/vi/${videoID}/hqdefault.jpg`
        const thisVideoLink = `https://www.youtube.com/embed/${videoID}`
        params = {...params, videoLink: thisVideoLink, videoThumbnail: videoThumbnail}
    }

    console.log(params)
    Axios.patch('http://localhost:3001/update/video', params).then((res)=>{
        console.log(res)
        if(res.data.affectedRows > 0)
        setModalState({title: 'Success!', message: 'record was successfully updated', show: true})
    })
}
const submitVideo = ()=>{

    const videoData = new FormData()
    videoData.enctype="multipart/form-data"
    
    if(formData.useLink)
    {


        const videoID = importGetVideoId(formData.videoLink)
        if(videoID == null)
        {
            setModalState({title: 'Validation Error', message: 'The Youtube link you provided was invalid', show: true})
            return
        }
        const videoThumbnail = `http://i3.ytimg.com/vi/${videoID}/hqdefault.jpg`
        const thisVideoLink = `https://www.youtube.com/embed/${videoID}`
        videoData.append('videoLink', thisVideoLink)
        videoData.append('videoThumbnail',videoThumbnail)

    }
    else
    {
        videoData.append('videoFile', file)
    }
    videoData.append('videoTitle', formData.title)
    videoData.append('videoDescription', formData.description)


    Axios.post('http://localhost:3001/api/upload/video/thread', videoData)
}
const [modalState, setModalState] = useState({
    title: '',
    message: '',
    show: false
})

const [file, setFile] = useState('')
const [formData, setFormData] = useState({
    title: '',
    description: '',
    useLink: false,
    videoLink: ''

})





const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]: e.target.value})
    console.log(formData)

}
  return (



    // <>
    <div id='main-content' className='white-mainclass' style={{height: '100vh', overflowY: 'scroll'}}>
        
    <ErrorModal errorMessage={modalState} setErrorMessage={setModalState}/>
         <h1>Video Uploader</h1>
         <Form enctype="multipart/form-data">
             <Row>
                 <Col>
                     <Form.Label>Title</Form.Label>
                     <Form.Control value={formData.title} onChange={(e)=>{handleChange(e)}} name='title' type='text' placeholder='Video title'></Form.Control>

                 </Col>
                 <Col>
                     <Form.Label>Description</Form.Label>
                     <Form.Control value={formData.description} onChange={(e)=>{handleChange(e)}} name='description' as="textarea" rows="3" Placeholder='Video description'></Form.Control>


                 </Col>
             </Row>
             {/* <Row>
                 <Form.Check onClick={(e)=>{setFormData({...formData, useLink: e.target.checked})}} defaultChecked={formData.useLink} label='Use Youtube link'/>
             </Row> */}
             <Row>




                     <Form.Label>Video</Form.Label>


                    {/* {getVideoId ? 
                    <> */}
                        <Form.Group>
                            <Form.Check value={replaceVideo} onClick={(e)=>{setReplaceVideo(e.target.checked)}} label="Replace video"/>
                        </Form.Group>
                    {/* </>
                    
                        :
                        <>
                        </> */}

                
                {formData.useLink ?
                         <Form.Control type='text' name='videoLink' onChange={(e)=>{handleChange(e)}} placeholder='Video Link'></Form.Control>:
                         <Form.Control className='mb-3' type="file" accept="video/mp4" onChange={(e)=>{setFile(e.target.files[0]);console.log(file)}}/>
                    }
             </Row>

       </Form>
       <Button onClick={()=>{updateVideo()}}>Update video</Button>

        {//getVideoId ? 


       

       ///*<Button onClick={()=>{submitVideo()}}>Submit</Button>*/}
        }
       
       
       {/*<button onClick={()=>{console.log(formData)}}>log form data</button>*/}
    </div>
    // </>
  )
}

export default VideoUpload