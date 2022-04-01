import React,{useEffect, useState} from 'react';

import TextEditor from './TextEditor';
import {Button, Form} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
function TestimonialView() {
  const location = useLocation();

  const {testimonialId} = location.state;
  const [readOnly, setReadOnly] = useState(false)
  const [adminPrivileges, setAdminPrivileges] = useState(true)
  useEffect(
    ()=>{
      console.log(`testimonialId : ${testimonialId}`)
    },[]
  )
  return (

    <div id="main-content" className='white-mainclass'>
    <h1>Testimonials viewer</h1>

    {/* The intention here is that you will be able to pass in the id of the article using the threadID prop and
    the TextEditor will pull the corresponding article from the database (I was tired when I coded this) */}
    <TextEditor readOnly={readOnly} threadID={testimonialId}/>



    <section className='admin-tools' style={{display: adminPrivileges ? 'display: block': 'display : none'}}>

    <Form>
    <Form.Group>
      <Form.Control type="text"></Form.Control>
      <Button onClick={()=>{
        setReadOnly(readOnly ? false : true)
      }} text="Edit article">Toggle Editing mode</Button>

    </Form.Group>
    </Form>
    </section>
    </div>
  )
}

export default TestimonialView