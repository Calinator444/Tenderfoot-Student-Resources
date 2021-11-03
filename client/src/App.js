//import logo from './logo.svg';
//import books from './books.png';
//import loginprofile from './loginprofile.png'
//import './App.css'; commented out app.css since we're using bootstrap
//a list of the bootstrap elements we'll be using
import {Button, Alert, Card, Form, Container, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import axios from 'axios';

import Login from './Login';
import Home from './Home';

import adminHome from './Admin/Home';
import {Route, Link} from 'react-router-dom';

//a piece of middleware for postingS requests to the server
//import Axios from 'axios';
//import {useState} from React;
import {React, useEffect, useState} from 'react';


function App() {

  return(
    //using reac-router-dom to emulate hyperlinking between webpages
    <div className="App">
    <Route exact path="/Home" component={Home} />
    <Route exact path="/Login" component={Login} />
    <Route exact path="/Admin/Home" component={adminHome}/>
    </div>
    );

    }

export default App;
