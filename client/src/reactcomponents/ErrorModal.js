import React from 'react'
import {Modal, Button} from 'react-bootstrap'

function ErrorModal(props) {

    const {setErrorMessage, errorMessage} = props

  return (


    <>        <Modal show={errorMessage.show}>
        <Modal.Header closeButton>
          <Modal.Title>{errorMessage.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setErrorMessage({...errorMessage, show: false})}}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
</>
  )
}

export default ErrorModal