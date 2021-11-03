//navbar is created as a react component so that it does not to be re-configured on each page
//every time changes are made


import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';


function Mainnav() {

return(
<Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand href="#home">Tenderfoot</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse>
      <Nav className="me-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#link">Map</Nav.Link>
        <Nav.Link href="#link">Forums</Nav.Link>
        <Nav.Link href="#link">How-to-videos</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


);

}

export default Mainnav;