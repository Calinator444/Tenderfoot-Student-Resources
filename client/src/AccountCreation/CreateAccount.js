import React, {useState} from 'react'
import {Form, Button, Alert, Col, Row} from 'react-bootstrap'
import Axios from 'axios';
import {useNavigate} from 'react-router-dom'
const CreateAccount = () => {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    emailAddress: '',
    username: '',
    password: '',
    confirmPassword: ''
  })


  const [errorShow, setErrorShow] = useState({
    usernameError: false,
    duplicateUsername: false,
    duplicateEmail: false,
    emailError: false,
    passwordError: false,
    confirmPasswordError: false    
  })


  const handleChange = (e)=>{

    const {value, name} = e.target
    setFormData({...formData, [name]: value})

    console.log(formData)
  }



  const createAccount = ()=>{
    //I'm passing the list of errors here as a prop because passing it using the state variable causes concurrency issues
    
    const formValid = formValidation()
    if(formValid.isValid)
    {const {username, password, emailAddress} = formData

    //data will be used to create an account
    Axios.post("http://localhost:3001/email/service", {emailAddress: emailAddress, password: password, username: username, service: 'account-creation'}).then((res)=>{

      console.log(res)
      const {affectedRows, errno, sqlMessage} = res.data


      //just because the data's valid on the front end doesn't mean everything's fine on the server side
      var errorStatus = formValid.errorList;
      console.log('errorShw inside create account')
      console.log(errorShow)
      if(errno)
      {
        switch(errno)
        {
          case 1062:
          const duplicateEmail = sqlMessage.search('unique_email') > -1
          const duplicateUsername = sqlMessage.search('unique_username') > -1
       
          errorStatus = {...errorStatus, duplicateEmail: duplicateEmail, duplicateUsername: duplicateUsername}
          setErrorShow(errorStatus)

          
          
          break;
        }
      }
      else{
        //errorStatus = {...errorStatus, duplicateEmail: false, duplicateUsername: false}
      }
      if(affectedRows)
      {
        if(affectedRows > 0)
          navigate('/Accounts/Create/Success')
      }
      //console.log(res)
    })
  
  }
  else
  {
    setErrorShow(formValid.errorList)
  }
  }
  const formValidation = ()=>{
    let formValid = true;
    const {emailAddress, username, password, confirmPassword} = formData;
    //state variables don't update until the end of the function so we nee to use a temporary variable to store errors
    let tempErrors = {...errorShow}
    let tempError = true;

    
    if(username == "")
    {
      formValid = false;
      //setErrorShow({...errorShow, usernameError: true})
      


      //the "duplicate username" 
      tempErrors = {...tempErrors, usernameError: true, duplicateUsername: false}
      //tempErrors = {...tempErrors, usernameError: true}
      //console.log(errorShow)
    }
    else {
      //tempErrors = {...tempErrors, user\}


      tempErrors = {...tempErrors, usernameError: false}
      tempError = false
    }
    console.log('initial tempErrors')
    //dafuq?
    console.log('temp errors with appendix')
    tempErrors = {...tempErrors, usernameError: tempError}
    


    const validEmail = validateEmailAddress(emailAddress)
    if(!validEmail)
    {
      formValid = false
    }
                                                                                  //if the address is invalid hide the "duplicate" error, else display the default value for the duplicate error
      tempErrors = {...tempErrors, emailError : !validEmail, duplicateEmail: (validEmail ? tempErrors.duplicateEmail:false)}
    if(password == "")
    {
      formValid = false
      console.log('password field empty')
      tempError = true;
      //setErrorShow({...errorShow, passwordError: true})
      //tempErrors = {...tempErrors, passwordError: true}
    }
    else {
      tempError = false
    }

    tempErrors = {...tempErrors, passwordError: tempError}


    if(!(password == confirmPassword))
    {

      console.log(`password: ${password} \r\n confirmPassword: ${confirmPassword}`)
      formValid = false;
      //setErrorShow({...errorShow, confirmPasswordError: true})
      
      //console.log(errorShow)

      tempError = true
    }
    else{
      tempError = false;

    }
    tempErrors = {...tempErrors, confirmPasswordError: tempError}
    console.log(formValid)
    console.log(`tempErrors has a value of`)
    console.log(tempErrors)
    //setErrorShow(tempErrors)
    //console.log(errorShow)
    return {isValid: formValid, errorList: tempErrors}

  }
  const validateEmailAddress = (address)=>
  {
    const format = /C\d{7}@uon.edu.au/i;

    return address.match(format) != null
  }
  return (

    
    <div id="main-content" className='white-mainclass' style={{overflowY: 'auto', height: '80vh'}}>


      <div className='row justify-content-center'  style={{height: '100%'}}>
      <Form className="col-md-8">
      <Row style={{height: '100%'}}>

        <Col>


          {/* Inline styling used to prototype the design */}
          <div className='sign-in-promo'>
            <h3>Become part of our community</h3>
            <ul>
              <li>Leave constructive feedback on our videos</li>
              <li>Interact with other members of the site</li>
              <li>Keep on-top of your studies with our customizeable to-do list</li>
            </ul>



          </div>
        </Col>
        <Col>
        <Form.Group>

          <Form.Label>
            Username
          </Form.Label>
          <Alert variant="danger" name="usernameError" show={errorShow.usernameError} dismissable>Please enter a username</Alert>

          <Alert variant="danger" show={errorShow.duplicateUsername} dismissable>That username is already taken</Alert>
          <Form.Control onChange={(e)=>{handleChange(e)}} name="username" placeholder="username" type='text'>
            
          </Form.Control>

        <Form.Label>
              Email address
            </Form.Label>
            <Alert variant="danger" show={errorShow.duplicateEmail} dismissable>An account with that email address has already been registered</Alert>
            <Alert variant="danger" show={errorShow.emailError} dismissable>Please enter a valid university email address</Alert>
          <Form.Control onChange={(e)=>{handleChange(e)}} name="emailAddress" placeholder="email address" type='email'>

          </Form.Control>

          </Form.Group>

          <Form.Group>
            <Form.Label>
              Password
            </Form.Label>
            <Alert variant="danger" show={errorShow.passwordError} dismissable>Please enter a password</Alert>
          <Form.Control type="password" name="password" placeholder="password" onChange={(e)=>{handleChange(e)}}>
            
          </Form.Control>


          <Form.Label>Re-type password</Form.Label>
          <Alert variant="danger" show={errorShow.confirmPasswordError} dismissable>Passwords must match</Alert>
          <Form.Control placeholder="confirm password" name='confirmPassword' onChange={(e)=>{handleChange(e)}} type='password'>


          </Form.Control >

          <Button onClick={()=>{createAccount()}}>Create Account</Button>
          {/* <Button onClick={()=>{console.log(errorShow)}}>test</Button> */}
          
        </Form.Group>
        </Col>
        </Row>
      </Form>    
      </div>
    </div>
  )
}

export default CreateAccount