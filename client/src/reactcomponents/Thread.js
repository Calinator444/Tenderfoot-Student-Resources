import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import {Form, Button} from 'react-bootstrap';
import Comment from './Comment';
import { render } from 'react-dom';

function Thread(props) { 


    //seperates the full response from the server into 2 seperate arrays of comments and replies respectively
    const sliceComments = (fullArray)=>{
      let tempReplies = [];
      let tempComments = [];
      for(let i = 0 ; i < fullArray.length; i++)
      {
        //splits the response from the server into 2 seperate arrays (replies and comments)

        //could this array be causing the map?
        console.log(fullArray[i].datePosted)
        tempComments.push({body: fullArray[i].body, commentID: fullArray[i].commentID, timePosted: new Date(fullArray[i].datePosted)})
        tempReplies.push({replyBody: fullArray[i].replyBody, commentID: fullArray[i].commentID})
      }

      let filteredArray = [...new Map(tempComments.map(x => [x['commentID'], x])).values()]


      return {replies: tempReplies, comments: filteredArray}



    }
    const {threadID} = props;
    const [commentBody, setCommentBody] = useState('');
    const [replyArray, setReplyArray] = useState([]);
    const [commentArray, setCommentArray] = useState([]);
    const [comments, setComments] = useState([]);
    let commentResponse = [];
      useEffect(() => {
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
      let splicedArray = sliceComments(res.data)
      const {comments, replies} = splicedArray;

      setCommentArray(comments);
      setReplyArray(replies)
      //commentResponse = res.data;


      //let thing = res.data;
      //default the reply array to prevent bugs next time useEffect fires
    });
  }, [threadID]);
  // const splitArray = ()=>{
    const postComment = ()=>{
      Axios.post("http://localhost:3001/api/addcomment", {threadID: threadID, body: commentBody}).then((res)=>{

        const splitArray = sliceComments(res.data)
        const {comments, replies} = splitArray;
        setCommentArray(comments)
        setReplyArray(replies)
        console.log(res)
      })
    }
    //need to use temporary arrays instead of state because state changes cause a re-render
    

  
     return (
    <section className="comment-wrapper">
          <div className="comment-section">
            <h2>Comments</h2>
            <Form>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Leave a Comment"
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
              

              onClick={()=>{postComment()}}
            >
              Post
            </Button>
            
            {
            commentArray.map((data) => {
              
              console.log('map function for thread fired');
              console.log(commentArray)

              const {commentID, body, timePosted} = data;
              
              const replies = replyArray.filter(x => x.commentID == commentID)
              return (
                <>
                  <Comment username="User1" body={body} commentId = {commentID} timePosted={timePosted}/>

                  {
                  
                  
                  replies.map((replyData)=>{ 
                  if(!(replyData.replyBody == null))
                  {
                  return(
                    
                  <div className="reply">
                  <h3>Username</h3>
                  <p>{replyData.replyBody}</p>
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
  )
}

export default Thread