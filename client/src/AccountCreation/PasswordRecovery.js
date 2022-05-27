import React, {useState} from 'react'
import {Form} from 'react-bootstrap'

function PasswordRecovery() {
const [formData, setFormData] = useState({
      verificationCode: '',
      password: '',
      confirmPassword: ''
    })

  return (

    


    <div id="main-content">  


      <Form>
        <Form.Label>
        verification code
        </Form.Label>
        <Form.Control type='text' name='verificationCode'>
        </Form.Control>
        <Form.Label>
          New password
        </Form.Label>
        <Form.Control type='password' placeholder='' name='password'>
        </Form.Control>
        <Form.Label>Confirm new password</Form.Label>
        <Form.Control type='password' name='confirmPassword'>
        </Form.Control>

      </Form>
    </div>
  )
}

export default PasswordRecovery