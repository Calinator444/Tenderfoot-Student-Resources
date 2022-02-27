import { Button, Alert, Card, Form, Container, Image } from "react-bootstrap";
import MapTest from "./maptest.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import CommentTest from "./CommentTest";
import VideoPlayer from "./VideoPlayer";
import Home from "./Home";
import Sidebar from "./Sidebar";
import Forum from "./Forum";
import adminHome from "./Admin/Home";
import { Route, Link } from "react-router-dom";
import { React, useEffect, useState } from "react";

function App() {
  return (
    //using reac-router-dom to emulate hyperlinking between webpages
    <div className="App">
      <Route exact path="/Home" component={Home} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Admin/Home" component={adminHome} />
      <Route exact path="/comment/test" component={CommentTest} />

      <Route exact path="/Forum" component={Forum}/>
      <Route exact path="/Map" component={MapTest}/>
      <Route exact path="/Videos" component={VideoPlayer} />
    </div>
  );
}

export default App;
