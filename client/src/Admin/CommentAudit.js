import React,{useEffect, useState} from 'react'
import {Table, Button} from 'react-bootstrap'

import Axios from "axios";

function CommentAudit() {

  const [data, setData] = useState([])


  const approveComment = (commentId)=>{
    console.log("attempting to approve comment with ID "+commentId)
    Axios.patch("http://localhost:3001/api/approveComment", {body: commentId})

  }

  useEffect(()=>{
    Axios.get("http://localhost:3001/api/selectUnmoderated").then((res)=>{
      console.log(res)
      setData(res.data)
    })
  },[])
  return (
      <div id='main-content' className='main-white'>
      <h1 stlye={{color: "black"}}>Audit comments</h1>
      <p>Any comments that have been flagged by the user or system will appear here. </p>
      <Table>
        <thead>
          <tr>
            <th>comment body</th>
            <th>author</th>
            <th>thread</th>
            <th>date posted</th>
            <th>commentID</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>

        {data.map((val)=>{
          // these values are case sensitive
          const {body, username, datePosted, commentID } = val;

          const posted = new Date(val.datePosted);
          const postConversion = posted.toLocaleString();
          return(
            
            <tr>
              <td>{body}</td>
              <td>{username}</td>
              <td></td>
              <td>{postConversion}</td>
              <td>{commentID}</td>
              <td><Button variant="primary" onClick={()=>{approveComment(commentID)}}>Approve</Button></td>
            </tr>
            
            );


        }        
        )}
          
          {/* <tr> waw
            <td>test body</td>
            <td>author name</td>
            <td>thread topic</td>
            <td>11/11/11</td>
          </tr> */}
        </tbody>

      </Table>
    </div>
  )
}

export default CommentAudit