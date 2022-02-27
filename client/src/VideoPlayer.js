import React, { useEffect, useState } from "react";
import "./css/App.css";
import Axios from "axios";
import Mainnav from "./reactcomponents/Mainnav";
import Comment from "./reactcomponents/Comment";
import { Form, Button } from "react-bootstrap";
import { DateRangeTwoTone } from "@mui/icons-material";

function VideoPlayer() {
  const setVideoState = (videoLink, index) => {
    setCurrentVideo(videoLink);
    setSelectedIndex(index);
  };
  const [commentBody, setCommentBody] = useState("");
  const [replyArray, setReplyArray] = useState([])
  const [videos, setVideos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(
    "https://www.youtube.com/embed/jk3SlCsF-bM"
  );

  const [commentArray, setCommentArray] = useState([]);
  const [comments, setComments] = useState([]);

  const addComment = (body) => {
    Axios.post("http://localhost:3001/api/get/videos", { body: body });
  };
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/videos").then((res) => {
      // console.log(res);
      setVideos(res.data);
      console.log(videos);
    });


    //returns the replies and comments for this thread using an inner join
    Axios.get("http://localhost:3001/api/selectcomments").then((res) => {
      setComments(res.data);
      let thing = res.data;
      
      for(let i = 0 ; i < thing.length; i++)
      {
        console.log(thing[i].body);
        //splits the response from the server into 2 seperate arrays (replies and comments)
        commentArray.push({body: thing[i].body, commentID: thing[i].commentID})
        replyArray.push({replyBody: thing[i].replyBody, commentID: thing[i].commentID})
      }

      // for (let i = 0; i < 0 )

      // console.log(miniArray.filter((val)=>{return val.id == 1}))
      // console.log([...new Set(miniArray.map(x => ({
      //   body: x.body,
      //   id: x.id
      // })
      
      // ))])
      // setCommentArray([...new Set(commentArray.map(x => ({
      //    body: x.body,
      //    id: x.id
      //  })
      
      //  ))])

       let filteredArray = [...new Map(commentArray.map(x => [x['commentID'], x])).values()]

      console.log('FILTERED ARRAY:')
       console.log(filteredArray)
      setCommentArray(filteredArray);

      //  console.log('FILTERED ARRAY')
      //  console.log(filteredArray)
      //  setCommentArray(filteredArray)
       console.log('COMMENTS: ')
       console.log(commentArray)
       console.log('REPLIES: ')
       console.log(replyArray)
      //return only objects in the array with a unique commentID
    });
  }, []);
  return (
    <>
      <Mainnav />
      <div style={{ display: "flex", "flex-direction": "column" }}>
        <div id="main-content" className="video-player">
          <iframe
            width="560"
            height="315"
            src={currentVideo}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>

          <div
            className="video-list"
            style={{ "justify-content": "space-between" }}
          >
            <ul>
              {videos.map((item, index) => {
                const { videoLink, videoThumbnail, videoTitle } = item;
                return (
                  <li
                    className={
                      selectedIndex == index ? "highlighted" : "listed"
                    }
                  >
                    <p className="video-link">{videoTitle}</p>
                    <img
                      src={videoThumbnail}
                      alt="thumbnail"
                      onClick={() => {
                        setVideoState(videoLink, index);
                      }}
                      className="preview-img"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <section className="comment-wrapper">
          <div className="comment-section">
            <h2>Comments</h2>
            <Form>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Leave a Comment"
                onChange={(val) => {
                  setCommentBody(val);
                  console.log(val);
                }}
              />
            </Form>
            <Button
              // all elements in the comment section have a default margin of 1rem, but this looks strange when applied to this button
              style={{ "margin-top": "0rem" }}
              type="submit"
              variant="primary"
            >
              Post
            </Button>

            {commentArray.map((data) => {

              const {commentID, body} = data;
              const replies = replyArray.filter(x => x.commentID == commentID)
              return (
                <>
                  <Comment username="User1" body={body} commentId = {commentID}/>

                  {
                  
                  
                  replies.map((replyData)=>{ 
                    console.log(replyData.replyBody)
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
        <footer style={{ height: "4rem" }}>
          <i>
            <p style={{ margin: "1rem" }}>&copy;University of Newcastle 2022</p>
          </i>
        </footer>
      </div>
    </>
  );
}

export default VideoPlayer;
