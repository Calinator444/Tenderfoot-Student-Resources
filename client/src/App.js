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

import Mainnav from "./reactcomponents/Mainnav";
import adminHome from "./Admin/Home";
import CommentAudit from "./Admin/CommentAudit";
import TestimonialBuilder from "./Admin/TestimonialBuilder";
import TestimonialList from './Testimonials/TestimonialList';

import ArticleBuilder from './Admin/ArticleBuilder'

import ArticleList from './Testimonials/ArticleList'

import NotFound from "./NotFound";
import { BrowserRouter, Route, Routes, Router, Link } from "react-router-dom";
import { React, useEffect, useState } from "react";


import ArticleView from "./ArticleView";

function App() {
  return (
    //using reac-router-dom to emulate hyperlinking between webpages
    <div className="App">
      {/* <Router> */}


      <Mainnav/>
        <Routes>

        <Route path="/" element={<Home/>}>
        </Route>



        {/* ADMIN PORTAL */}
        <Route path="/Admin/TestimonialBuilder" element={<TestimonialBuilder/>}/>
        <Route path="/Admin/ArticleBuilder" element={<ArticleBuilder/>}/>





        <Route path="/Login" element={<Login/>}/>
        <Route path="/Map" element={<Map/>}/>


        <Route path='/Videos' element={<VideoPlayer/>}/>

        <Route path='/ArticleView/:title' element={<ArticleView/>}/>
        <Route exact path="/Testimonials/TestimonialList" element={<TestimonialList/>}/>
        
        <Route exact path="/ArticleList" element={<ArticleList/>}/>
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
    </div>
  );
}

export default App;
