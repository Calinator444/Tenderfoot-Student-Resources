//navbar is created as a react component so that it does not to be re-configured on each page
//every time changes are made


//logo here is a generic variable name, it could be anything else, so long as it is referenced correctly later

import {LinkContainer} from "react-router-bootstrap"
import {Link} from 'react-router';
import logo from '../resources/books.png'
import React, {useState, useEffect} from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';


function Mainnav() {

  
  window.loggedStatus = {
    permissionLevel: "guest",
    username: null,
    adminPriveleges: false
  }
  const [adminMode, setAdminMode] = useState(true);
  useEffect(()=>{
    console.log(window.loggedStatus)
  },[])
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
        <Nav.Link href="Map">Map</Nav.Link>
        {/* <Nav.Link href="#link">Forums</Nav.Link> */}
        <Nav.Link href="videos">How-to-videos</Nav.Link>
        <NavDropdown style={{display: adminMode? 'inline' : 'none'}} title="Admin Controls">



          <LinkContainer to="/Admin/TestimonialBuilder">
            <NavDropdown.Item href="Admin/ArticleBuilder">Testimonial Builder</NavDropdown.Item>
          </LinkContainer>

        </NavDropdown>


      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


);

}

export default Mainnav;