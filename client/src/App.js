import { Button, Alert, Card, Form, Container, Image } from "react-bootstrap";
import Map from "./Map";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
// import CommentTest from "./CommentTest";
import VideoPlayer from "./VideoPlayer";
import Home from "./Home";
import ForumPost from "./ForumPost";
import Sidebar from "./Sidebar";
import Forum from "./Forum";
import Footer from "./reactcomponents/Footer"



import Mainnav from "./reactcomponents/Mainnav";
import adminHome from "./Admin/Home";
import CommentAudit from "./Admin/CommentAudit";


import TodoList from "./TodoList"
import TestimonialBuilder from "./Admin/TestimonialBuilder";
import TestimonialList from './Testimonials/TestimonialList';

import ArticleBuilder from './Admin/ArticleBuilder'
import {useSelector} from "react-redux"
import ArticleList from './Testimonials/ArticleList'

import NotFound from "./NotFound";
import { BrowserRouter, Route, Routes, Router, Link } from "react-router-dom";
import { React, useEffect, useState } from "react";


import ArticleView from "./ArticleView";



//sessionStorage.setItem("test_value", {username: 'test', password: null})
function App() {
  const store = useSelector(state => state)


  const [showList, setShowlist] = useState(false)
  //"setLoginStatus" is used by child elements to force useEffect to fire (Session variable changes do not cause useEffect to fire)
  const [loginStatus, setLoginStatus] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(()=>{

    console.log(`login status inside App.js set to: ${loginStatus}`)
      //if(loginStatus)
      //  setUserName(store.username)
      //set the default "login" state
      //const username = "guest"
      //sessionStorage.setItem("login_status", {permissionLevel: "guest", username: null, adminPriveleges: false})
      //sessionStorage.setItem("permission_level", username)
      //sessionStorage.setItem("user_name", username)
      //setAccountDetails({username: username, permissionLevel: username})
      console.log("App.js useEffect fired")
  },[loginStatus])
  return (
    //using reac-router-dom to emulate hyperlinking between webpages
    <div className="App">
      {/* <Router> */}


      <Mainnav setLoginStatus={setLoginStatus} loginStatus={loginStatus}/>
        <Routes>

        <Route path="/" element={<Home/>}>
        </Route>



        {/* ADMIN PORTAL */}
        <Route path="/Admin/TestimonialBuilder" element={<TestimonialBuilder/>}/>
        <Route path="/Admin/ArticleBuilder" element={<ArticleBuilder/>}/>





        <Route path="/Login" element={<Login setLoginStatus={setLoginStatus}/>}/>
        <Route path="/Map" element={<Map/>}/>


        <Route path='/Videos' loginStatus={loginStatus} element={<VideoPlayer/>}/>

        <Route path='/ArticleView/:title' element={<ArticleView/>}/>
        <Route exact path="/Testimonials/TestimonialList" element={<TestimonialList/>}/>
        
        <Route exact path="/ArticleList" element={<ArticleList/>}/>
        <Route exact path="/TodoList" element={<TodoList/>}/>
        <Route path="*" element={<NotFound/>}/>


          {/* 
          ##V6 ROUTING METHODS##




          Routes for old version of react-router-dom
          (It took me like 2 hours to fix this, react-router-dom v6 has a slightly different structure than it's predecessors for some reason)

          <Route path="/Home" component={Home} />
          <Route exact path="/Login" component={Login} />

          <Route exact path="/comment/test" component={CommentTest} />
          


          <Route exact path="/Forum" component={Forum}/>
          <Route exact path="/Map" component={MapTest}/>
          <Route exact path="/Videos" component={VideoPlayer} />
          <Route exact path="/ForumPost/:value" component={ForumPost}/>
          <Route exact path="/NotFound" component={NotFound}/> */}




          {/* Testimonials */}
          
          {/* 
          
          
          OUTDATED WHEN USING V6

          <Route exact path='/Testimonials/TestimonialList' component={TestimonialList}/> */}


          
          {/* admin portal */}
          {/* 
          OUTDATED WHEN USING v6
          
          <Route exact path="/Admin/Home" component={adminHome} />
          <Route exact path="/Admin/CommentAudit" component={CommentAudit}/>
        <Route exact path="/Admin/ArticleBuilder" component={ArticleBuilder}/>*/}
          </Routes> 
        {/* </Router> */}

          <Sidebar/>
        <Footer/>
    </div>


    
  );
}

export default App;
