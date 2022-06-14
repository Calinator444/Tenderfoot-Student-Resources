//navbar is created as a react component so that it does not to be re-configured on each page
//every time changes are made


//logo here is a generic variable name, it could be anything else, so long as it is referenced correctly later

import {LinkContainer} from "react-router-bootstrap"
import {Link} from 'react-router';

import logo from '../resources/books.png'
import React, {useState, useEffect} from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {useSelector, useDispatch} from "react-redux"


import { useNavigate } from "react-router";
import axios from "axios";

function Mainnav(props) {


const navigate = useNavigate()
const dispatch = useDispatch()

const {loginStatus, setLoginStatus} = props

const [loggedIn, setLoggedIn] = useState(false)
const store = useSelector(state => state)
const logout = ()=>{
  dispatch({type: "logout", payload: {}})
  setLoginStatus(false)
  navigate('/')
}
const [userInfo, setUserInfo] = useState({
  username: "guest",
  permissionLevel: "guest"
})

  useEffect(()=>{
    if(store)
    {
      if(store.username)
        setLoggedIn(true)
      else
        setLoggedIn(false)
    }
    else
      setLoggedIn(false)
      
    console.log("useEffect inside mainnav fired")

    
    console.log(`loginstatus has a value of ${loginStatus}`)
    if(store)
    {
      let userInf = {...loginStatus, permissionLevel: store.permissionLevel, username: store.username}
      setUserInfo(userInf)
    }
  },[loginStatus])
return(
<Navbar bg="dark" expand="lg" variant="dark">
  <Container>
    <Navbar.Brand><img src={logo} height="60" width="60"/></Navbar.Brand>
    <LinkContainer to="/">
    <Navbar.Brand href="#home">Tenderfoot</Navbar.Brand>
    </LinkContainer>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse>
      <Nav className="me-auto">
        <LinkContainer to="/">
          <Nav.Link href="#link">Home</Nav.Link>
        </LinkContainer>


        <LinkContainer to="/ArticleView/Maze%20map">
          <Nav.Link>Map</Nav.Link>
        </LinkContainer>
        {/* <Nav.Link href="#link">Forums</Nav.Link> */}


        <LinkContainer to='/Videos'>
        <Nav.Link>How-to-videos</Nav.Link>
        </LinkContainer>


         <NavDropdown  style={{ display: (userInfo.permissionLevel == "admin") ? 'inline' : 'none'}} title="Admin Controls">

            

          <LinkContainer to="/Admin/TestimonialBuilder">
            <NavDropdown.Item>Testimonial Builder</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/Admin/ArticleBuilder">
            <NavDropdown.Item>ArticleBuilder</NavDropdown.Item>
          </LinkContainer>

        </NavDropdown> 
        {/* <NavDropdown title='Account'> */}
        {


        loginStatus ?
        <NavDropdown title={store.username == "admin" ? "Logout": store.username}>
          <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          <LinkContainer to="Accounts/PasswordReset">
            <NavDropdown.Item>Reset password</NavDropdown.Item>
          </LinkContainer>
        </NavDropdown>
        // <LinkContainer to="/Login">
        //   <Nav.Link>Login</Nav.Link>
        // </LinkContainer>
        :
        <LinkContainer to="/Login">
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
      }
        {/* </NavDropdown> */}




      { loggedIn ?
      <LinkContainer to="/TodoList">
        <Nav.Link>Todo-list</Nav.Link>
      </LinkContainer> :<></>}
      </Nav>
    </Navbar.Collapse>



    
  </Container>
</Navbar>


);

}

export default Mainnav;