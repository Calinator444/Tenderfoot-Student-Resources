import { RemoveFromQueue } from "@mui/icons-material";
import React, {useRef, useState, useEffect} from "react";
import {Form, Button} from 'react-bootstrap'

import { useSelector } from "react-redux";

import Axios from 'axios';
function Comment(props) {
  const {replySetter} = props
  const store = useSelector(state => state)
  
  const [middleStatement, setMiddleStatement] = useState('');
  const { username, body, commentId, timePosted } = props;
  const [replyContent, setReplyContent] = useState('')
  const replyRef = useRef(null);
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

  const postReply = (commentID) => {

    // console.log(commentID);
    // console.log(replyContent);
    // const body = {commentID: commentID, body: replyContent};
    Axios.post("http://localhost:3001/api/addReply", 
    {id: commentID, body: replyContent, accountId: store.userId}).then((res)=>{
      console.log(res.data)
      const mapping = res.data.map(({ body: replyBody, commentID,replyAccount }) => ({replyBody,commentID, replyAccount}));
      replySetter(mapping)
//console.log(transformed);
    })
    // {body: JSON.stringify(body)});
  }


  const compareDates = (date)=>
  {

    const currentDate = new Date();
    const dateArgument = new Date(`${date.getMonth() +1 }/${date.getDate()}/${date.getFullYear()}`)//we need to apply an offset here because the date from the database is incorrect by 1 month
    const currentDateFormatted = new Date(`${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`)
    console.log(dateArgument);
    console.log(currentDateFormatted)
    const difference = Math.abs(currentDateFormatted - dateArgument);
    console.log(`data for comment: ${body}`)
    console.log(`Difference in millisecons${difference}`)
    const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24)); 
    console.log(`Difference in days${daysDifference}`)


    return daysDifference;

  }


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
        
        <span>Report</span>
        <span onClick={()=>{

        
          replyRef.current.style.display="block";
        }}>Reply</span>
        </div>
        </section>
      
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
      <Button className="replyButton">Cancel</Button>
      </div>
      
      </>
  );
}

export default Comment;
