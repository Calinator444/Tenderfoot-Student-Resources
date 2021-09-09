import logo from './logo.svg';
import books from './books.png';
//import './App.css'; commented out app.css since we're using bootstrap
//a list of the bootstrap elements we'll be using
import {Button, Alert, Card, Form, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//import {useState} from React;
import {React, useState} from 'react';




function App() {

  const [loginSuccess, setLoginSuccess] = useState(false);
  return (


    <Container>
    <div className="text-center">
	  <h1 className="justify-content-center">Tenderfoot</h1>
	  <img src={books} alt="book-stack"/>
    </div>
      <Form>
      <Form.Group className="mb-3">
      <Form.Label>Email Address</Form.Label>
      <Form.Control type="password" placeholder="C1234567@uon.edu.au"></Form.Control>
      </Form.Group>


      <Form.Group className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password"></Form.Control>
      </Form.Group>


      <Form.Group>
      <p><a href="">Forgot Password</a></p>
      </Form.Group>
      <Button type="submit">Submit</Button>
    
      </Form>
      </Container>

      
  );
}

export default App;
