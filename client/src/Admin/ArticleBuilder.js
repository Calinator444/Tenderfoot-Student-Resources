//used for building student testimonials
import {Form, Tooltip} from 'react-bootstrap'
import TextEditor from '../TextEditor';
import React, {useState, useEffect, useRef} from 'react'


function ArticleBuilder() {

    useEffect(()=>{

        console.log("correct page loaded")
    }, [])

  return (


    // style attribute ignored?
    <div id='main-content' style={{backgroundColor:"white", padding: '12px'}}>


      <Form>
        <Form.Group className='mb-3'>
          <Form.Label>
            Title
          </Form.Label>
          <Form.Control type="text">

          </Form.Control>



          <Form.Text className="text-muted">
            The name that will appear when this article is listed
          </Form.Text>
        </Form.Group>
      </Form>


      {/* This is a text editor, the readOnly state would never change because this information is never displayed to regualr site visitors */}
      <TextEditor style={{border: '1px solid black'}} readOnly={false}/>
      </div>
  )
}

export default ArticleBuilder