//navbar is created as a react component so that it does not to be re-configured on each page
//every time changes are made


//logo here is a generic variable name, it could be anything else, so long as it is referenced correctly later
import logo from '../resources/books.png'
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';


function Mainnav() {

return(
<Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand><img src={logo} height="60" width="60"/></Navbar.Brand>
    <Navbar.Brand href="#home">Tenderfoot</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse>
      <Nav className="me-auto">
        <Nav.Link href="#link">Home</Nav.Link>
        <Nav.Link href="Map">Map</Nav.Link>
        <Nav.Link href="#link">Forums</Nav.Link>
        <Nav.Link href="videos">How-to-videos</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


);

}

export default Mainnav;