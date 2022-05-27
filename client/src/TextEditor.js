/*
  Author:Caleb Williams
  Purpose: A text-editor that displays HTML that can be edited by the site admin
  
  Special Thanks: I'd like to thank 'jpuri' for their excellent text-editor plugin
  this saved me hours of time and effort that would have gone into developing a text-editor of my own




*/



import noPreviewImage from './resources/no-preview-image.jpg'

import { scaleThumbnail } from './Functions/imageScale';

import React, { useState, useEffect, myRef, useImperativeHandle, setErrorMessage } from 'react';
import { EditorState , convertToRaw, convertFromHTML, ContentState, convertFromRaw} from 'draft-js';
import {convertToHTML,} from 'draft-convert'
import Axios from "axios";
import {Button, Modal, Form, Row, Col} from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';//formatting breaks when this line is removed
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';
// import './App.css';

  
  function TextEditor(props){
  

  const [textBodyId, setTextBodyId] = useState(0)//a way of memorizing the article id if only the title was provided



  //publishing mode can be passed as an empty attribute, and the system will display the approprate controls for uploading the article contents
  const {myRef, title, description, editMode, category, publishingMode, 

  //overrideState is used when we want a parent element to have control of the editor state
  stateHandler, overrideState, setErrorMessage, previewImageSetter} = props;
  
  

  //using "props" lets us disambiguate between the local state variable "show controls" and the prop that was given
  const[showControls, setShowControls] = useState(false)

  // const toggleReadonly = ()=>{
  //   console.log("toggle read only fired")
  //   let newValue = readOnly ? false : true;
  //   setReadOnly(newValue)
  //   console.log(readOnly)
  // }


  const [state, setState] = useState({
    title: '',
    description: '',
    previewImage: noPreviewImage
  })
  

  const handleImageDirectoryChange = (e)=>
  {
    console.log('handleimagedirectorychange fired!')

    // var img = new Image()
    // img.src = e.target.value;
    // console.log(img)

    // var request = new XMLHttpRequest();
    // request.open('GET', e.target.value,true)
    // request.send()
    // request.onload = ()=>{
    //   console.log(request.status)
    // }
    const value = e.target.value

    //const {value} = e.target
    if(value == '')
    {
      setState({...state, previewImage: noPreviewImage})
      return
    }
    else{
      Axios.get(e.target.value).then(()=>{
        setState({...state, previewImage: value})
        console.log('then fired')
        
      }).catch(()=>{
      console.log('catch fired')
      setState({...state, previewImage: noPreviewImage})
      //imageLocated = false
    })

    }
    

    //console.log(imageLocated)
    
    //const {previewImage} = state;

    //console.log(value)
    
    //setState({...state, previewImage: value})
  }
  //const changeHandler =

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
    //window.editorState = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

//const [showError, setErrorMessage] = useState(false)

  const [previewImage, setPreviewImage] = useState('')
  const [message, setMessage] = useState({
    title: '',
    message: ''
  })
  const [readOnly, setReadOnly] = useState('false')
 

  const logStuff = ()=>{
    console.log(`logging stuff`)
  }
  const updateTextBody = ()=>{

    var getId;
    if(props.title)
      getId = textBodyId;//as in the state variable
    const {title, description} = state


    //cons
    const parameters = {body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),textBodyId : getId, description: description, title: title}//this line here is throwing the error
    Axios.post("http://localhost:3001/api/updateTestimonial", parameters).then((res)=>{
    

      if(res.data.affectedRows > 0)
      {
        setErrorMessage({
          title: 'Success!',
          message: "The text block was successfully updated",
          show: true

        })
        //setShow(true)
      }

      else{
        setErrorMessage({
          title: 'Error',
          message: "Sorry, we couldn't update that record",
          show: true
        })
        console.log("couldn't read status text?")
        console.log(res.data.affectedRows)
        //console.log(res.status.statusText)
      }
      //setErrorMessage(true)
      //console.log(res.data.statusText)
    })
    
  }
  const addTextBody = ()=>{
    //sends the state variable containing the content as a json file.
    console.log("sendData fired")
    // Sending data to backend as a JSON file


    Axios.post("http://localhost:3001/api/addTextBody", {body: JSON.stringify(convertToRaw(editorState.getCurrentContent())), 
    description: description, title: title, category: category}).then((res)=>{

      const {errno, affectedRows} = res.data
      console.log(res.data)
      if(errno)
      {
        //console.log(`errno is ${errno}`)

        //here we can handle the error we get back from the database with grace

        //if(title)
        switch(errno)
        {
            case 1062:
            console.log('ERR: 1062')
            setErrorMessage({
              title: 'Error'
              ,message: 'An article with that title already exists',
              show: true
            })
            //setShowError(true);
            break;
            case 1406:
            setErrorMessage({
              title: 'Error'
              ,message: 'the title or description you entered was tool long'
              ,show: true
            })
            break;
            default:
            setErrorMessage({
              title: 'Error'
              ,message: 'An error occured while attempting to add this to our database',
              show: true,
              })
              break;
              
            
        }
      }
      if(affectedRows)
      {
        if(affectedRows > 0)
      {
        setErrorMessage({
          title: 'Success!',
          message: 'Your article was successfully uploaded',
          show: true
        })}
      }
    })
  }

  const dumpContents = ()=>{
      let thing = editorState.getCurrentContent()

      console.log(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  }
  const toggleRead = ()=>{
    setReadOnly(!readOnly)
  }
  useEffect(()=>{
    setShowControls(props.showControls)
    setReadOnly(props.readOnly)
    console.log(`readOnly was set to ${readOnly}`)

    console.log(`show controls was set to: ${showControls}`)

    //there's some lag when you change state variables so we need to use the prop value
    if(props.readOnly)
    {

      console.log(`props.readOnly is GOOOOOOO`)
      setShowControls(false)
    }
    if(title)
    {//if thread ID was given


      console.log('title was given')
      Axios.get(`http://localhost:3001/api/get/textBody/${title}`).then((res)=>{
      console.log(res.data)
      console.log('get request complete')

        // We need to use an indexer because sql returns an array whenever a 'WHERE' clause is provided
        //setResponse(res.data[0].body)
      const response = res.data[0].body
      if(res.data[0].body == null)
      {

        //the body may be set to null if the thread has been manually inserted into the database
        //if such is the case exiting the function without making any assignments should prevent bugs
        console.log('hmm.... no article')
        return;
      }
      else{
        setTextBodyId(res.data[0].textBodyId)
        const {title, summary} = res.data[0]
        var tempState = {...state, description: summary, title: title}
      setState(tempState)
        
      }

      // componentDidMount()
      // {
      //   this.toggleRead.bind(this)
      // }
      console.log(response);
      const contentState = convertFromRaw(JSON.parse(response));
      const newState = EditorState.createWithContent(contentState)
      //var tempState = {...state}
      const {summary, title}= res.data[0]
      
      console.log("newState")
      console.log(newState)
      // const state = ContentState.createFromBlockArray(response.contentBlocks, response.entityMap)

      //might cause a recursion error
      // setEditorState(response)
        // setEditorState(state)

      console.log("text editor contents were overriden")

      // const blocksFromHTML = convertFromHTML(response)

      // const state = ContentState.createFromBlockArray(
      //   blocksFromHTML.contentBlocks,
      //   blocksFromHTML.entityMap,
      // );
      setEditorState(newState)
      //console.log(convertFromHtml)
      //console.log(convertToHTML(newState.getCurrentContent()))
      //console.log(convertToHTML(editorState.getCurrentContent()))
      })
      
    }
    else
    {

      console.log('title not provided?')
      //console.log("Text editor contents were left empty")
    }
  }, [readOnly])



  return (


    <>


    {!readOnly ?

      <>
            <Form.Group>

                <Form.Label>Title</Form.Label>
                <Form.Control value={state.title} type="Text" name="title"  onChange={(e)=>{setState({...state, title: e.target.value})}} placeHolder="Article Title"></Form.Control >

                <Form.Text variant="text-muted">The title that will appear when the article is listed</Form.Text>
            </Form.Group>

            <Form.Group>
              <Row>
                <Col>
                <Form.Label>Description</Form.Label>
                <Form.Control style={{marginBottom: '50px'}} value={state.description} name="description" onChange={(e)=>{setState({...state, description: e.target.value})}} as="textarea" rows="3" placeholder='Article Description'/>
                </Col>
                <Col>
                {state.previewImage}

                <div style={{width: '200px', height: '200px', backgroundImage: `url(${state.previewImage})`, backgroundSize: scaleThumbnail(state.previewImage, 200)}}></div>
                {/* <img src={state.previewImage} alt="choose preview image" /> */}
                <Form.Control onChange={(e)=>{handleImageDirectoryChange(e)}} placeholder='add a link to your preview image' type='text'></Form.Control>
                
                
                </Col>
              </Row>
            </Form.Group>
            </>
        :
        <></>
    
    }
      <Editor 


                // editorState={editorState}
                readOnly={readOnly}
                
                //defaultEditorState={editorState}
                editorState={overrideState ? overrideState : editorState}
                wrapperClassName={'text-editor-wrapper'}
                toolbarStyle={readOnly ? {display: 'none'} : {display:'flex'}}
                editorClassName={'editor-class'}
                wrapperStyle={{backgroundColor: '#FFFFFF',border: readOnly ? '0px' :'1px solid black', borderRadius: '5px'}}
                // onChange={window.editorState = editorState}
                onEditorStateChange={stateHandler ? stateHandler :setEditorState}
                //onEditorStateChange={setEditorState} 
                />
                <section className='admin-controls' style={{display: (showControls ? "block" : "none") }}>

                {/* might have to remove this using an "edit" or "create" mode */}
                <Button onClick={()=>{updateTextBody()}}>Update Text</Button>
                 {/* <Button variant="secondary"
                  onClick={()=>{toggleRead()}}>Toggle Editing Mode</Button> */}
                </section>

                <section className='admin-publishing' style={{display:(publishingMode ? "block" : "none")}}>
                  <Button onClick={()=>{addTextBody()}}>Upload Article</Button>
                  {/* <Button></Button> */}
                </section>
               
    </>
                
  )
}
export default TextEditor;