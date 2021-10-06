import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';


function navbar() {

return(
<Navbar>
    <Container>
       <Navbar.Brand>Tenderfoot</Navbar.Brand> 
        <Navbar.Collapse>
        
        <Nav className="me-auto">
            <Nav.Link>Home</Nav.Link>
            <Nav.Link>Map</Nav.Link>

        </Nav>            
        </Navbar.Collapse>
    </Container>
</Navbar>


);

}

export default navbar;