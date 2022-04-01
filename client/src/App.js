import { Button, Alert, Card, Form, Container, Image } from "react-bootstrap";
import MapTest from "./maptest";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import CommentTest from "./CommentTest";
import VideoPlayer from "./VideoPlayer";
import Home from "./Home";
import ForumPost from "./ForumPost";
import Sidebar from "./Sidebar";
import Forum from "./Forum";
import adminHome from "./Admin/Home";
import CommentAudit from "./Admin/CommentAudit";
import ArticleBuilder from "./Admin/ArticleBuilder";
import TestimonialList from './Testimonials/TestimonialList';

import NotFound from "./NotFound";
import { Route, Link } from "react-router-dom";
import { React, useEffect, useState } from "react";


import TestimonialView from "./TestimonialView";

function App() {
  return (
    //using reac-router-dom to emulate hyperlinking between webpages
    <div className="App">
      <Route exact path="/Home" component={Home} />
      <Route exact path="/Login" component={Login} />

      <Route exact path="/comment/test" component={CommentTest} />
      


      <Route exact path="/Forum" component={Forum}/>
      <Route exact path="/Map" component={MapTest}/>
      <Route exact path="/Videos" component={VideoPlayer} />
      <Route exact path="/ForumPost/:value" component={ForumPost}/>
      <Route exact path="/NotFound" component={NotFound}/>




      {/* Testimonials */}
      
      <Route exact path="/TestimonialView" component={TestimonialView}/>
      <Route exact path='/Testimonials/TestimonialList' component={TestimonialList}/>


      
      {/* admin portal */}
      <Route exact path="/Admin/Home" component={adminHome} />
      <Route exact path="/Admin/CommentAudit" component={CommentAudit}/>
      <Route exact path="/Admin/ArticleBuilder" component={ArticleBuilder}/>
    </div>
  );
}

export default App;
