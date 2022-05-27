import React, { useEffect, useState } from "react";
import "./css/App.css";
import Axios from "axios";
import Mainnav from "./reactcomponents/Mainnav";
import Comment from "./reactcomponents/Comment";
import { Form, Button } from "react-bootstrap";
import { Co2Sharp, DateRangeTwoTone } from "@mui/icons-material";
import Thread from "./reactcomponents/Thread";

function VideoPlayer() {
  const setVideoState = (videoLink, index) => {
    setCurrentVideo(videoLink);
    //setSelectedIndex(index);
    setSelectedThread(videos[index].threadID)
    setSelectedIndex(index);
    console.log("SELECTED THREAD")
    console.log(videos[index].threadID)
    
  };
  const [selectedThread,setSelectedThread] = useState(0);
  const [commentBody, setCommentBody] = useState("");
  const [replyArray, setReplyArray] = useState([])
  const [videos, setVideos] = useState([]);
  //by default the first video is selected
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(
    "https://www.youtube.com/embed/jk3SlCsF-bM"
  );

  const [commentArray, setCommentArray] = useState([]);
  const [comments, setComments] = useState([]);

  //
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/videos").then((res) => {
      // console.log(res);
      setVideos(res.data);

      console.log(res.data)


      //might cause an infinite render loop
      setSelectedThread(res.data[0].threadID)
    });


    

  }, []);
  return (
    <>
      <div style={{ display: "flex", "flex-direction": "column" }}>
        <div id="video-player" className="video-player">



          <div className="video-wrapper">
          <iframe

          //560x315 aspect ratio
            // width="853"
            // height="505"

            src={currentVideo}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          </div>
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
                    onClick={() => {
                        setVideoState(videoLink, index);
                      }}
                  >
                    <p className="video-link">{videoTitle}</p>
                    <img
                      src={videoThumbnail}
                      alt="thumbnail"
                      
                      className="preview-img"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {
        
        }
        <Thread threadID={selectedThread}/>
        {/* <footer style={{ height: "4rem" }}>
          <i>
            <p style={{ margin: "1rem" }}>&copy;University of Newcastle 2022</p>
          </i>
        </footer> */}
      </div>
    </>
  );
}

export default VideoPlayer;
