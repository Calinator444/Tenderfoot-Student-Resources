/* Date Created: 24/05/2022

  Author: Caleb Williams
  Purpose: I noticed a lot of the links the admin would need to acces were only available on the home page, meaning as soon as the user navigated away
  away they would no longer be able to access different parts of the site


*/

import {LinkContainer} from "react-router-bootstrap"
import {Link} from 'react-router';

import logo from '../resources/books.png'
import React, {useState, useEffect} from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {useSelector, useDispatch} from "react-redux"


import { useNavigate } from "react-router";
import axios from "axios";

function Adminnav(props) {

const {setLoginStatus} = props

const navigate = useNavigate()
const dispatch = useDispatch()

const logout = ()=>{
  dispatch({type: "logout", payload: {}})
  console.log("logout fired")
  setLoginStatus(false)
  navigate('/')
}
return(

<div> 


<Navbar bg="dark" expand="lg" variant="dark">
  <Container>
    <LinkContainer to='/Admin/Home'>
      <Navbar.Brand><img src={logo} height="60" width="60"/></Navbar.Brand>
    </LinkContainer>

    <Navbar.Brand>Tenderfoot-Admin</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />


    <Navbar.Collapse>
      <Nav className='me-auto'>
        <LinkContainer to='/'>
          <Nav.Link>Landing Page</Nav.Link>

        </LinkContainer>


        <LinkContainer to='/Admin/Home'>
          <Nav.Link>Home</Nav.Link>
        </LinkContainer>


          <NavDropdown title="Admin Tools">

            

          <LinkContainer to="/Admin/TestimonialBuilder">
            <NavDropdown.Item>Testimonial Builder</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/Admin/ArticleBuilder">
            <NavDropdown.Item>Article Builder</NavDropdown.Item>
          </LinkContainer>

        </NavDropdown> 
        
        <Nav.Link onClick={()=>{logout()}}>
          Logout
        </Nav.Link>

      </Nav>
    </Navbar.Collapse>

  </Container>
</Navbar> 
</div>

);

}

export default Adminnav;