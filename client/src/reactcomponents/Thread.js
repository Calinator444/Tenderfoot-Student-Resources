import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import {Form, Button, Modal} from 'react-bootstrap';
import Comment from './Comment';
import { compareDates, formatDate, formatTime } from '../Functions/dateArithmethic';


import {useSelector} from 'react-redux';
import { render } from 'react-dom';
import { FormatIndentDecrease } from '@mui/icons-material';

function Thread(props) { 
    const store = useSelector(state => state)

    //seperates the full response from the server into 2 seperate arrays of comments and replies respectively

    const sliceComments = (fullArray)=>{
      console.log('array inside slicedComments')
      console.log(fullArray)
      let tempReplies = [];
      let tempComments = [];
      for(let i = 0 ; i < fullArray.length; i++)
      {
        //splits the response from the server into 2 seperate arrays (replies and comments)

        //could this array be causing the map?
        console.log(`${fullArray[i].datePosted.split('T')[0]} ${fullArray[i].body}`)
        console.log(`username is: ${fullArray[i].username}`)
        tempComments.push({body: fullArray[i].body, username: fullArray[i].username, commentID: fullArray[i].commentID, timePosted: new Date(fullArray[i].datePosted)})
        tempReplies.push({replyBody: fullArray[i].replyBody, dateAdded: fullArray[i].dateAdded, replyAccount: fullArray[i].replyAccount, commentID: fullArray[i].commentID})
      }

      let filteredArray = [...new Map(tempComments.map(x => [x['commentID'], x])).values()]


      return {replies: tempReplies, comments: filteredArray}



    }




    const flagComment = (commentId)=>{
      Axios.patch("http://localhost:3001/flag/comment", {commentId: commentId }).then((res)=>{
      

      })
    }
    const {threadID} = props;
    const [commentBody, setCommentBody] = useState('');
    const [replyArray, setReplyArray] = useState([]);
    const [commentArray, setCommentArray] = useState([]);
    const [comments, setComments] = useState([]);
    const [flaggedError, setFlaggedError] = useState(false) //used to display the modal which appears whenever a comment gets flagged by the system

    const [userDetails, setUserDetails] = useState({})


    const [loggedIn, setLoggedIn] = useState(false)
    let commentResponse = [];
      useEffect(() => {
      //if(store.username)
      //  console.log("username was defined")
      Axios.get(`http://localhost:3001/api/selectcomments/${threadID}`).then((res) => {
      let commentResponse = res.data
      // let tempReplies = [];
      // let tempComments = [];

      // for(let i = 0 ; i < commentResponse.length; i++)
      // {
      //   //splits the response from the server into 2 seperate arrays (replies and comments)

      //   //could this array be causing the map?
      //   tempComments.push({body: commentResponse[i].body, commentID: commentResponse[i].commentID})
      //   tempReplies.push({replyBody: commentResponse[i].replyBody, commentID: commentResponse[i].commentID})
      // }

      // let filteredArray = [...new Map(tempComments.map(x => [x['commentID'], x])).values()]
      // console.log("splitArray called")
      console.log('rest was set to...')
      console.log(res)


      
      //will attaching a header affect this
      let splicedArray = sliceComments(res.data)
      const {comments, replies} = splicedArray;

      setCommentArray(comments);
      setReplyArray(replies)
      //console.log(store.username == undefined)


      //if username is undefined, login is set to false
      setLoggedIn(!(store == null))

      if(!(store == null))
      {
        const {userId} = store;
        setUserDetails({
          accountName: store.username,
          userId : userId
        })
      }
      console.log(`loggedIn was set to ${loggedIn}`)
      //commentResponse = res.data;


      //let thing = res.data;
      //default the reply array to prevent bugs next time useEffect fires
    });
  }, [threadID]);
  // const splitArray = ()=>{
    const postComment = ()=>{

      if(store != null)
      {Axios.post(`http://localhost:3001/api/addcomment`, {threadID: threadID, body: commentBody, accountId : store.userId}).then((res)=>{
        console.log(res.data)
        const splitArray = sliceComments(res.data.updatedComments)
        const {comments, replies} = splitArray;


        console.log('UPDATED VALUES SET TO:')
        console.log(res.data.updatedComments)
        console.log(comments)
        console.log(replies)
        setCommentArray(comments)
        setReplyArray(replies)
        console.log(res)
      })}
    }
    //need to use temporary arrays instead of state because state changes cause a re-render
    

  
     return (
       <>


       <Modal show={flaggedError}>
        <Modal.Header closeButton>
          <Modal.Title>Your comment has been removed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your comment was automatically flagged by our system, likely because it contained inappropriate language. An administrator will inspect your comment for details.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setFlaggedError(false)}}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
    <section className="comment-wrapper">
          <div className="comment-section">
            <h2>Comments</h2>
            <Form>
              <Form.Control
                as="textarea"
                rows={3}
                disabled={!loggedIn}
                placeholder={loggedIn ? "Leave a comment": "You must be logged in to comment"} 
                onChange={(e) => {
                  setCommentBody(e.target.value);
                }}
              />
            </Form>
            <Button
              // all elements in the comment section have a default margin of 1rem, but this looks strange when applied to this button
              style={{ "margin-top": "0rem" }}
              type="submit"
              variant="primary"
              disabled={(!loggedIn || commentBody == '')}

              onClick={()=>{postComment()}}
            >
              Post
            </Button>
            
            {
            commentArray.map((data) => {
              
              console.log('map function for thread fired');
              console.log(commentArray)

              const {commentID, body, timePosted, username} = data;
              
              const replies = replyArray.filter(x => x.commentID == commentID)
              return (
                <>
                  <Comment username={username} body={body} replySetter = {setReplyArray} commentId = {commentID} timePosted={timePosted}/>

                  {
                  
                  
                  replies.map((replyData)=>{ 

                    const {replyAccount, replyBody, dateAdded} = replyData
                    console.log(`replyAccount was set to ${replyAccount}`)
                  if(!(replyBody == null))
                  {

                  var dateString;
                  
                  const date = new Date (dateAdded)


                  switch(compareDates(date)){
                    case 0:
                    dateString = 'Today'
                    break;
                    case 1:
                    dateString = 'Yesterday'
                    break;
                    default:
                    dateString = formatDate(date)
                    break;
        



                  }
                  return(
                    
                  <div className="reply">
                  <h3>{replyAccount}</h3>
                  <p>{replyBody}</p>

                  <div className='comment-lower'>



                    <div className='time-posted'>
                    {
                    
                    `Published ${dateString} at ${formatTime(date)}`}

                  


                      </div>
                      <div className='comment-actions'>
                        <span>Report</span>
                      </div>  
                    </div>
                  </div>
                  )
                  }
                  
                  }
                  )}
                  
                  
                </>
              );
            })}
          </div>
        </section>
        </>
  )
}

export default Thread