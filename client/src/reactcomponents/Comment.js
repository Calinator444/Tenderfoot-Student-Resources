import { RemoveFromQueue } from "@mui/icons-material";
import React, {useRef, useState, useEffect} from "react";

import { sliceComments } from "../Functions/threadActions";
import {Form, Button} from 'react-bootstrap'

import { useSelector } from "react-redux";

import Axios from 'axios';
import {compareDates} from '../Functions/dateArithmethic'
function Comment(props) {
  //const {replySetter} = props
  const store = useSelector(state => state)
  
  const [middleStatement, setMiddleStatement] = useState('');
  //threadID prop is used when a 
  const { username, body, commentId, timePosted, commentSetter, replySetter, threadID, setModalState} = props;
  const [replyContent, setReplyContent] = useState('')




  const replyRef = useRef(null);
  const replyBox = useRef(null)




  // compareDates(timePosted)
  const getHours = timePosted.getHours()
  const date = {
    day: timePosted.getDate(),
    month: timePosted.getMonth() + 1,//"getMonth" is offset by 1 in javascript for absolutely no reason
    year: timePosted.getFullYear(),
    minutes: timePosted.getMinutes(),
    hour: (getHours > 12 ? getHours - 12 : getHours),
    meridian: (getHours > 12 ? 'pm' : 'am')//ternary operator confuses javascript into thinking I'm trying to parse a value pair
  }

  
  const {day, month, year, minutes, hour, meridian} = date;

  //we use a ternary operator to figure out whether minutes is a single digit number
  //if it is the time will display incorrectly since the leading '0' is missing, so we chuck one in
  //const middle = compareDates() > 0 ? :
  //const dateString = `Posted: ${day}/${month}/${year} at ${hour}:${minutes < 10 ? "0" : ""}${minutes}`
  // const convertMysqlDate = (sqlDate)=>{
  //   const splitArray = sqlDate.split('T');
  //   const daySplit = splitArray[0].split('-')



  //   const year = daySplit[2];

  // }




  const flagComment = (thisCommentId)=>{
  Axios.patch("http://localhost:3001/flag/comment", {commentId: thisCommentId, flag: 1, threadID: threadID}).then((res)=>{
      //replies & comment query
      if(res)
      {
        
        console.log('response: ')
        console.log(res)
        console.log(res.data)
        const response = sliceComments(res.data)
        const {replies, comments} = response;
        console.log(replies)
        console.log(comments)
        commentSetter(comments)
        replySetter(replies)
        setModalState({title: 'Comment reported', message: 'The comment will be inspected by an administrator. If it is deemed acceptable be approved.', show: true})
        //setReplyContent(replies)
        //const mapping = res.data.map(({ body: replyBody, commentID,replyAccount,dateAdded }) => ({replyBody,commentID, replyAccount, dateAdded}));
        //replySetter(mapping)

      }

  })
  }
  const postReply = (commentID) => {

    // console.log(commentID);
    // console.log(replyContent);
    // const body = {commentID: commentID, body: replyContent};
    Axios.post("http://localhost:3001/api/addReply", 
    {id: commentID, body: replyContent, accountId: store.userId}).then((res)=>{


      console.log('post reply data')
      console.log(res.data)


      if(res.data.affectedRows == 0)
        setModalState({title: 'Your comment has been flagged', message: 'Your comments has been flagged for a moderator to inspect. It likely contained coarse language', show: true})
      const mapping = res.data.map(({ body: replyBody, commentID,replyAccount,dateAdded, replyID }) => ({replyBody,commentID, replyAccount, dateAdded, replyID}));
      replySetter(mapping)
//console.log(transformed);
    })
    replyRef.current.style.display="none"
    resetReply();
    // {body: JSON.stringify(body)});
  }

  const resetReply = ()=>{
    replyBox.current.value = ''
  }
  // const compareDates = (date)=>
  // {

  //   const currentDate = new Date();
  //   const dateArgument = new Date(`${date.getMonth() +1 }/${date.getDate()}/${date.getFullYear()}`)//we need to apply an offset here because the date from the database is incorrect by 1 month
  //   const currentDateFormatted = new Date(`${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`)
  //   console.log(dateArgument);
  //   console.log(currentDateFormatted)
  //   const difference = Math.abs(currentDateFormatted - dateArgument);
  //   console.log(`data for comment: ${body}`)
  //   console.log(`Difference in millisecons${difference}`)
  //   const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24)); 
  //   console.log(`Difference in days${daysDifference}`)


  //   return daysDifference;

  // }


  useEffect(()=>{
    console.log("useEffect fired")
    
    const difference = compareDates(timePosted)
    switch(difference)
    {
      case 0: setMiddleStatement('Today') 

      break;
      case 1:
      setMiddleStatement('Yesterday')
      break;
      default:
      setMiddleStatement(`${day}/${month}/${year}`)
    }
  },[timePosted])
  return (
    
    <>
    <div className="user-comment">
      <h4>{username}</h4>
      <p>{body}</p>
      <section className="comment-lower">
      
        <div className="time-posted">{`Posted: ${middleStatement} at ${hour}:${minutes < 10 ? "0" : ""}${minutes}${meridian}`}</div>
        <div className="comment-actions">
        {/* does nothing rn */}
        <span onClick={()=>{flagComment(commentId)}}>Report</span>



        {store != null ? 
        <span onClick={()=>{

        
          replyRef.current.style.display="block";
        }}>Reply</span>
        :
        ''
        }
        </div>
        </section>
      
    </div>

    <div style={{display: 'none'}} ref={replyRef}>
    <Form>
              <Form.Control
                as="textarea"
                rows={3}
                ref={replyBox}
                placeholder={"Replying to "+username}
                onChange={(e) => {
                  setReplyContent(e.target.value);
                }}
              />
            </Form>

      <Button className="replyButton"onClick={()=>{
        postReply(commentId)
      }}>Post</Button>
      <Button className="replyButton" onClick={()=>{replyRef.current.style.display="none";resetReply()}}>Cancel</Button>
      </div>
      
      </>
  );
}

export default Comment;
