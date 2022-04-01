/*
  Author:Caleb Williams
  Purpose: A text-editor that displays HTML that can be edited by the site admin
  
  Special Thanks: I'd like to thank 'jpuri' for their excellent text-editor plugin
  this saved me hours of time and effort that would have gone into developing a text-editor of my own




*/




import React, { useState, useEffect } from 'react';
import { EditorState , convertToRaw, convertFromHTML, ContentState, convertFromRaw} from 'draft-js';
import {convertToHTML,} from 'draft-convert'
import Axios from "axios";
import {Button} from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';//formatting breaks when this line is removed
// import './App.css';

  
  const TextEditor = (props) => {
  const {threadID, readOnly} = props;
  // const [readOnly, setReadOnly] = useState(false);
  // const toggleReadonly = ()=>{
  //   console.log("toggle read only fired")
  //   let newValue = readOnly ? false : true;
  //   setReadOnly(newValue)
  //   console.log(readOnly)
  // }
  const [shittyBangBang, setShittyBangBang] = useState('')
  const [editorState, setEditorState] = useState(threadID ? shittyBangBang : 
    () => EditorState.createEmpty(),
  );



  const sendData = ()=>{
    //sends the state variable containing the content as a json file.
    console.log("sendData fired")
    // Sending data to backend as a JSON file
    Axios.post("http://localhost:3001/api/insertTestimonial", {body: JSON.stringify(convertToRaw(editorState.getCurrentContent()))})
  }

  const dumpContents = ()=>{
      let thing = editorState.getCurrentContent()

      console.log(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  }

  useEffect(()=>{


    
    if(threadID){//if thread ID was given
      //var response;
      Axios.get(`http://localhost:3001/api/selectTestimonial/${threadID}`).then((res)=>{
      console.log(res.data)

        // We need to use an indexer because sql returns an array whenever a 'WHERE' clause is provided
        //console.log(res.data[0].body);//WHY IS THIS EMPTY WHAT THE FUCK?!
        //setResponse(res.data[0].body)
      const response = res.data[0].body
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
      console.log("threadID was set to default")
    }
  }, [])
  return (


    <>
      <Editor 
                // editorState={editorState}
                readOnly={readOnly}
                
                //defaultEditorState={editorState}
                editorState={editorState}
                wrapperClassName={'text-editor-wrapper'}
                toolbarStyle={readOnly ? {display: 'none'} : {display:'flex'}}
                editorClassName={'editor-class'}
                wrapperStyle={{backgroundColor: '#FFFFFF',border: readOnly ? '0px' :'1px solid black', borderRadius: '5px'}}
                //onChange={setEditorState}
                onEditorStateChange={setEditorState}
                //onEditorStateChange={setEditorState} 
                />
                {/* <button onClick={()=>{dumpContents()}}>Dump editor contents</button>
                <button onClick={()=>{toggleReadonly()}}>toggle readonly</button> */}
                {/* <Button text="Toggle Readonly"></Button> */}
    </>
                
  )
}
export default TextEditor;