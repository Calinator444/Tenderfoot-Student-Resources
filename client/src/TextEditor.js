/*
  Author:Caleb Williams
  Purpose: A text-editor that displays HTML that can be edited by the site admin
  
  Special Thanks: I'd like to thank 'jpuri' for their excellent text-editor plugin
  this saved me hours of time and effort that would have gone into developing a text-editor of my own




*/




import React, { useState, useEffect, myRef, useImperativeHandle } from 'react';
import { EditorState , convertToRaw, convertFromHTML, ContentState, convertFromRaw} from 'draft-js';
import {convertToHTML,} from 'draft-convert'
import Axios from "axios";
import {Button, Modal} from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';//formatting breaks when this line is removed
// import './App.css';

  
  function TextEditor(props){


  
  //publishing mode can be passed as an empty attribute, and the system will display the approprate controls for uploading the article contents
  const {threadID, myRef, title, description, editMode, category, publishingMode} = props;
  const callConsoleLog = ()=>{
    console.log("ref use was successful")
  }
  
  // useImperativeHandle(myRef, ()=>{
  //   callConsoleLog()
  // },[])
  
  

  //using "props" lets us disambiguate between the local state variable "show controls" and the prop that was given
  const[showControls, setShowControls] = useState(props.showControls)

  // const toggleReadonly = ()=>{
  //   console.log("toggle read only fired")
  //   let newValue = readOnly ? false : true;
  //   setReadOnly(newValue)
  //   console.log(readOnly)
  // }




  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
    window.editorState = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

const [showError, setShowError] = useState(false)


  const [message, setMessage] = useState({
    title: '',
    message: ''
  })
  const [readOnly, setReadOnly] = useState(props.readOnly)
 

  const logStuff = ()=>{
    console.log(`logging stuff`)
  }
  const updateTextBody = ()=>{


    const parameters = {body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),textBodyId : threadID}
    Axios.post("http://localhost:3001/api/updateTestimonial", parameters).then((res)=>{
    

      if(res.data.affectedRows > 0)
      {
        setMessage({
          title: 'Success!',
          message: "The text block was successfully updated"

        })
        //setShow(true)
      }

      else{
        setMessage({
          title: 'Error',
          message: "Sorry, we couldn't update that record"
        })
        console.log("couldn't read status text?")
        console.log(res.data.affectedRows)
        //console.log(res.status.statusText)
      }
      setShowError(true)
      //console.log(res.data.statusText)
    }).catch((err)=>{
      console.log("catch fired")
      setMessage({
        title: "Network Error", message: "the server appears to be down at the moment"
      })
      setShowError(true)
      
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
        console.log(`errno is ${errno}`)






        //here we can handle the error we get back from the database with grace
        setShowError(true)
        switch(errno)
        {
          case 1062:

            setMessage({
              title: 'Error'
              ,message: 'An article with that title already exists'
            })
            //setShowError(true);
            break;
            case 1406:
            setMessage({
              title: 'Error'
              ,message: 'the title or description you entered was tool long'
            })
            break;
            default:
            setMessage({
              title: 'Error'
              ,message: 'An error occured while attempting to add this to our database'
              })
              break;
              
            
        }
      }
      if(affectedRows)
      {
        if(affectedRows > 0)
        setMessage({
          title: 'Success!',
          message: 'Your article was successfully uploaded'
        })
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
    if(readOnly)
      setShowControls(false)
    if(threadID)
    {//if thread ID was given
      Axios.get(`http://localhost:3001/api/selectTestimonial/${threadID}`).then((res)=>{
      console.log(res.data)

        // We need to use an indexer because sql returns an array whenever a 'WHERE' clause is provided
        //console.log(res.data[0].body);//WHY IS THIS EMPTY WHAT THE FUCK?!
        //setResponse(res.data[0].body)
      const response = res.data[0].body
      if(res.data[0].body == null)
      {

        //the body may be set to null if the thread has been manually inserted into the database
        //if such is the case exiting the function without making any assignments should prevent bugs
        return;
      }

      // componentDidMount()
      // {
      //   this.toggleRead.bind(this)
      // }
      console.log(response);
      const contentState = convertFromRaw(JSON.parse(response));
      const newState = EditorState.createWithContent(contentState)
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
      console.log("Text editor contents were left empty")
    }
  }, [])
  return (


    <>

<Modal show={showError}>
        <Modal.Header closeButton>
          <Modal.Title>{message.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShowError(false)}}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
      <Editor 
                // editorState={editorState}
                readOnly={readOnly}
                
                //defaultEditorState={editorState}
                editorState={editorState}
                wrapperClassName={'text-editor-wrapper'}
                toolbarStyle={readOnly ? {display: 'none'} : {display:'flex'}}
                editorClassName={'editor-class'}
                wrapperStyle={{backgroundColor: '#FFFFFF',border: readOnly ? '0px' :'1px solid black', borderRadius: '5px'}}
                // onChange={window.editorState = editorState}
                onEditorStateChange={setEditorState}
                //onEditorStateChange={setEditorState} 
                />
                <section className='admin-controls' style={{display: (showControls ? "block" : "none") }}>

                {/* might have to remove this using an "edit" or "create" mode */}
                <Button onClick={()=>{updateTextBody()}}>Update Text</Button>
                 <Button variant="secondary"
                  onClick={()=>{toggleRead()}}>Toggle Editing Mode</Button>
                </section>
                {/* <button onClick={()=>{dumpContents()}}>Dump editor contents</button>
                <button onClick={()=>{toggleReadonly()}}>toggle readonly</button> */}

                <section className='admin-publishing' style={{display:(publishingMode ? "block" : "none")}}>
                  <Button onClick={()=>{addTextBody()}}>Upload Article</Button>
                  {/* <Button></Button> */}
                </section>
               
    </>
                
  )
}
export default TextEditor;