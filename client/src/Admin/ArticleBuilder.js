import React, {useState, useRef, useImperativeHandle, useEffect} from 'react'
import {Form, Button} from 'react-bootstrap'
import TextEditor from "../TextEditor"
import Mainnav from "../reactcomponents/Mainnav"
import {Redirect} from "react-router-dom"

function ArticleBuilder() 
{

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

    <Mainnav/>
    

    <div id="main-content" className="white-mainclass">
        <h1>Article Builder</h1>

        <p>You can use this to build articles for our user base to read.</p>
        <Form>
            <Form.Group>

                <Form.Label>Title</Form.Label>
                <Form.Control type="Text" name="title" onChange={(e)=>{handleStateChange(e)}} placeHolder="Article Title"></Form.Control >

                <Form.Text variant="text-muted">The title that will appear when the article is listed</Form.Text>
            </Form.Group>

            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" onChange={(e)=>{handleStateChange(e)}} as="textarea" rows="3" placeholder='Article Description'>

            </Form.Control>
            </Form.Group>


        
        
        <Form.Label>Article body</Form.Label>
        <TextEditor showControls={false} title={title} description={description} readOnly={false} myRef={myRef} category="article" publishingMode/>
        {/* <Button onClick={()=>{
            console.log(articleState)
        }}>Log article state</Button> */}
        {/* <Button onClick={()=>{console.log(window.editorState)}}> {/*using window to store a global 
            Log stuff
        </Button> */}
        </Form>
                <iframe width="600" height="420" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://use.mazemap.com/embed.html#v=1&config=UoNCampus&zlevel=2&center=151.706167,-32.891064&zoom=18&campusid=117&utm_medium=iframe" style={{"border": "1px solid grey"}} allow="geolocation"></iframe><br/><small><a href="https://www.mazemap.com/">Map by MazeMap</a></small>


    </div>
    </>
  )
}

export default ArticleBuilder