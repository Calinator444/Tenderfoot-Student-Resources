//navbar is created as a react component so that it does not to be re-configured on each page
//every time changes are made


//logo here is a generic variable name, it could be anything else, so long as it is referenced correctly later

import {LinkContainer} from "react-router-bootstrap"
import {Link} from 'react-router';

import logo from '../resources/books.png'
import React, {useState, useEffect} from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {useSelector, useDispatch} from "react-redux"
import axios from "axios";

function Mainnav(props) {
const dispatch = useDispatch()

const {loginStatus, setLoginStatus} = props


const store = useSelector(state => state)
const logout = ()=>{
  dispatch({type: "logout", payload: {}})
  console.log("logout fired")
  setLoginStatus(false)
}
const [userInfo, setUserInfo] = useState({
  username: "guest",
  permissionLevel: "guest"
})

  useEffect(()=>{

    console.log("useEffect inside mainnav fired")


    console.log(`loginstatus has a value of ${loginStatus}`)
    if(store)
    {
      console.log("if statement fired")


      console.log(`permission level inside store: ${store.permissionLevel}`)
      let userInf = {...loginStatus, permissionLevel: store.permissionLevel, username: store.username}
      setUserInfo(userInf)
      console.log(`permission level: ${store.permissionLevel}`)
    }
    console.log('useEffect inside Mainnav fired')
    //setAccountDetails({username: username, permissions: permissions})

    //const {username, permissionLevel} = getValue;

    //console.log(`username: ${getValue}`)

//     if(window.loggedStatus == null)
//     {
      
//   console.log('logStatus has been set')
// }
// else
//   console.log('else statement')
//     console.log(window.loggedStatus)


    console.log(userInfo.permissionLevel)
  },[loginStatus])
return(
<Navbar bg="dark" expand="lg" variant="dark">
  <Container>
    <Navbar.Brand><img src={logo} height="60" width="60"/></Navbar.Brand>
    <LinkContainer to="/">
    <Navbar.Brand href="#home">Tenderfoot {(userInfo.permisisonLevel == "admin") ?  "asda" : false}</Navbar.Brand>
    </LinkContainer>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse>
      <Nav className="me-auto">
        <LinkContainer to="/">
          <Nav.Link href="#link">Home</Nav.Link>
        </LinkContainer>
        <Nav.Link href="Map">Map</Nav.Link>
        {/* <Nav.Link href="#link">Forums</Nav.Link> */}


        <LinkContainer to='/Videos'>
        <Nav.Link>How-to-videos</Nav.Link>
        </LinkContainer>


        {console.log(`permission level was set to: ${userInfo.permissionLevel}`)}
         <NavDropdown  style={{ display: (userInfo.permissionLevel == "admin") ? 'inline' : 'none'}} title="Admin Controls">

            

          <LinkContainer to="/Admin/TestimonialBuilder">
            <NavDropdown.Item>Testimonial Builder</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/Admin/ArtileBuilder">
            <NavDropdown.Item>ArticleBuilder</NavDropdown.Item>
          </LinkContainer>

        </NavDropdown> 
        {/* <NavDropdown title='Account'> */}
        {


        loginStatus ?
        <NavDropdown title={store.username}>
          <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
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
      <LinkContainer to="/TodoList">
        <Nav.Link>Todo-list</Nav.Link>
      </LinkContainer>
      </Nav>
    </Navbar.Collapse>



    
  </Container>
</Navbar>


);

}

export default Mainnav;