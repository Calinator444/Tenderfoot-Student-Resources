import React, {useState, useRef, useImperativeHandle, useEffect} from 'react'
import {Form, Button, Modal} from 'react-bootstrap'
import TextEditor from "../TextEditor"

import {Redirect} from "react-router-dom"
import { useNavigate } from 'react-router'

import MediaLibrary from '../reactcomponents/MediaLibrary'
import Axios from 'axios'

function ArticleBuilder() 
{
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    title: '',
    message: '',
    show: false
})






useEffect(()=>{
    const adminStatus = sessionStorage.getItem("permission_level")
    

    console.log(adminStatus)
}, [])








const [articleState, setArticleState] = useState(
    {title : '',
    description: '',
    includeThumbnail : false}
)

const myRef = useRef({})
const handleStateChange = (e)=>{
    const value = e.target.value
    const name = e.target.name

    //I'm using the spread operator to copy all of the previous values from the object while overwriting "name"
    setArticleState({...articleState, [name]: value})
    console.log(articleState)
    console.log(name)
}   



    const {title, description} = articleState
  return (
    <>

    

    <div id="main-content" className="white-mainclass">
        <h1>Article Builder</h1>


        <Modal show={errorMessage.show}>
        <Modal.Header closeButton>
          <Modal.Title>{errorMessage.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setErrorMessage({...errorMessage, show: false})}}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>

        <p>You can use this to build articles for our user base to read.</p>
        <Form>
        <Form.Label>Article body</Form.Label>
        <TextEditor showControls={false} title={title} description={description} readOnly={false} myRef={myRef} setErrorMessage={setErrorMessage} category="article" publishingMode/>
        {/* <Button onClick={()=>{
            console.log(articleState)
        }}>Log article state</Button> */}
        {/* <Button onClick={()=>{console.log(window.editorState)}}> {/*using window to store a global 
            Log stuffF
        </Button> */}
        </Form>
                {/* <iframe width="600" height="420" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://use.mazemap.com/embed.html#v=1&config=UoNCampus&zlevel=2&center=151.706167,-32.891064&zoom=18&campusid=117&utm_medium=iframe" style={{"border": "1px solid grey"}} allow="geolocation"></iframe><br/><small><a href="https://www.mazemap.com/">Map by MazeMap</a></small> */}



    {/* break media-library off into separate component (re-use for profile pics?) */}


    {
    <MediaLibrary/>
    
    
    
    }
    {/* <div className='media-library'>




        
    </div> */}
    </div>
    
    </>
  )
}

export default ArticleBuilder