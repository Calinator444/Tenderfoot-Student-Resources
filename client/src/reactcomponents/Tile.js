import React from 'react'
import {Button} from 'react-bootstrap'
function Tile(props) {

    const {description, title, link, backgroundImage} = props;
  return (
    <div className="tile" style={{backgroundImage : `url(${backgroundImage})`}}>

            <h2>{title}</h2>
            <p>{props.children}</p>
            <Button variant="dark">Click here</Button>
    </div>
    
  )
}

export default Tile