import { RemoveFromQueue } from "@mui/icons-material";
import React, {useRef, useState} from "react";
import {Form, Button} from 'react-bootstrap'

import Axios from 'axios';

function Comment(props) {
  const { username, body, commentId } = props;
  const [replyContent, setReplyContent] = useState('')
  const replyRef = useRef(null);


  const postReply = (commentID) => {

    // console.log(commentID);
    // console.log(replyContent);
    // const body = {commentID: commentID, body: replyContent};
    Axios.post("http://localhost:3001/api/addReply", 
    {id: commentID, body: replyContent})
    // {body: JSON.stringify(body)});
  }
  return (
    <>
    <div className="user-comment">
      <h4>{username}</h4>
      <p>{body}</p>
      <div className="comment-actions">
        <span>Report</span>
        <span onClick={()=>{

          
          replyRef.current.style.display="block";
        }}>Reply</span>
      </div>
    </div>

    <div style={{display: 'none'}} ref={replyRef}>
    <Form>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={"Replying to "+username}
                onChange={(e) => {
                  setReplyContent(e.target.value);
                }}
              />
            </Form>

      <Button className="replyButton"onClick={()=>{
        postReply(commentId)
      }}>Post</Button>
      <Button  className="replyButton">Cancel</Button>
      </div>
      
      </>
  );
}

export default Comment;
