//backup of app file 5/10/2021

import logo from './logo.svg';
import books from './books.png';
import loginprofile from './loginprofile.png'
//import './App.css'; commented out app.css since we're using bootstrap
//a list of the bootstrap elements we'll be using
import {Button, Alert, Card, Form, Container, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


//a piece of middleware for postingS requests to the server
import Axios from 'axios';
//import {useState} from React;
import {React, useEffect, useState} from 'react';


function App() {

  const [loginSuccess, setLoginSuccess] = useState(false);

  //userName and password are kept in variables which update whenever the form details are altered
  const [userName, setUserName] = useState('');
  const [passWord, setPassword] = useState('');
  const [loginAttempt,setLoginAttempt] = useState(0)
  const attemptLogin  = ()=>{
  //console.log('attempting login');
  axios.get(`http://localhost:3001/api/select/${userName}`, {'Access-Control-Allow-Origin': '*'})
  .then((res)=>{
    console.log("axios.get fired")
    if(res.data.length > 0)
    {
    //console.log(res.data[0].pWord);
      var password = res.data[0].pWord;//pword cannot be invoked when res.data is stored in a variable
      if(password.localeCompare(passWord) == 0)
      {
        console.log("login successful");
        setLoginAttempt(0)
      }
      else
      {
        console.log("password does not match username");
        setLoginAttempt(1)
      }
    //console.log(password.localeCompare(passWord) == 0);//primitives can be compared using "==" presumably
    }
    else
    {
      setLoginAttempt(2)
      console.log("that username does not eist")
    }
    console.log("axios request complete")
  })
}
  
  //use effect is a hook that runs as soon as a the code does
  useEffect(()=>{
  console.log(loginAttempt);
  }, []);
  return (

    <Container>
    <div className="text-center">
	  <h1>Login</h1>
	  <Image src={loginprofile} alt="book-stack" roundedCircle/>
    </div>
      <div className="row justify-content-center">
      {
      //return(<Alert variant="success">default return statement</Alert>)
      (()=>{switch(loginAttempt) {
        case 0:
          return;
        case 1:
          return(<Alert variant="success">Password does not match username</Alert>) 
        case 2:
          return(<Alert variant="success">No account exists with that name</Alert>)
        default:
          break;
      }}
      ) ()
      }
      <Form className="col-md-4">
      <Form.Group>
      <Form.Label>Username</Form.Label>
      <Form.Control onChange={(e)=>{setUserName(e.target.value)}} placeholder="Username"></Form.Control>
      <Form.Text className="text-muted">
      Your username is the email you registered with
      </Form.Text>
      </Form.Group>


      <Form.Group>
      <Form.Label>Password</Form.Label>
      <Form.Control onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password"></Form.Control>
      </Form.Group>

      
      <Form.Group>
      <p><a href="">Forgot Password</a></p>
      </Form.Group>
      <Button onClick={attemptLogin}>Submit</Button>

      </Form>
      </div>
      </Container>
  
    );

    }

export default App;
