import React from 'react'
import {Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
function Tile(props) {

    const {description, title, link, backgroundImage, btnDisabled} = props;
  return (
    <div className="tile" style={{backgroundImage : `url(${backgroundImage})`}}>

            <h2>{title}</h2>
            <p>{props.children}</p>

            <LinkContainer to={link ? link : "#" }>
              <Button variant={btnDisabled ? "dark":"primary"}>Click here</Button>
            </LinkContainer>
    </div>
    
  )
}

export default Tile