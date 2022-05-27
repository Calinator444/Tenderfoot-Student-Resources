//Author: Caleb Williams
//Purpose: A sement for the site that allows users to either log in or reset their password if they've forgotten it and previously registered.
//Date Created: November 2021



import books from "./resources/books.png";
import loginprofile from "./resources/loginprofile.png";
//a list of the bootstrap elements we'll be using
import { Button, Alert, Card, Form, Container, Image, Tabs, Tab, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import Axios from "axios";
import { React, useEffect, useState, NavBar } from "react";
import {useNavigate} from 'react-router-dom'






function Login(props) {


  
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [passwordChangeData, setPasswordChangeData] = useState('')
  const {setLoginStatus} = props;
  const navigate = useNavigate()

  const handleCancel = ()=>{
    var errorList = {...errorState}
    var formValues = {...resetFormData}
    Object.keys(errorList).forEach(key=>{
      errorList[key] = false;
    })

    Object.keys(errorList).forEach(key=>{
      errorList[key] = '';
    })
    //setErrorState(...e)


    setErrorState(errorList)
    setResetFormData(formValues)
    setMode('login')
    setResetStep(1)
  }


  const verifyOtpCode = ()=>{
    const errorList = {...errorState}
    const {requestCode} = passwordChangeData
    const {recoveryKey} = resetFormData
    const otpCodeMatch = requestCode == recoveryKey
    setErrorState({...errorList, otpCodeMatch: !otpCodeMatch})


    console.log(`OTP code passed validation: ${otpCodeMatch}`)
    if(otpCodeMatch)
    setResetStep(3);
    return otpCodeMatch;//result can be used to determine whether form passed validation
    
  }


  const sendRecoveryKey=()=>{
    console.log('send recovery key fired')
    Axios.post("http://localhost:3001/email/service", {service: 'otp-reset', emailAddress: resetFormData.emailAddress }).then((res)=>{
      const{requestCode} = res.data
      if(requestCode){
        
        //setRequestCode(requestCode)  
        setPasswordChangeData(res.data)
        //causes step 3 to activate?
        setResetStep(2)
        //console.log(requestCode)
      }
      else{
        if(res.data.length < 1)
          setErrorState({...errorState, emailError: true})
      }

      
    
    //console.log(res.data)
    })
  }


    
  const finalisePasswordChange = ()=>{
    const {newPassword, confirmNewPassword} = resetFormData;
    var errorList = {...errorState}
    const confirmPasswordMatch = newPassword == confirmNewPassword;
    errorList = {...errorList, confirmPasswordMatch: confirmPasswordMatch }
    const {accountId} = passwordChangeData

    console.log(`passwords match: ${confirmPasswordMatch}`)
    if(confirmPasswordMatch)
    {
      Axios.patch('http://localhost:3001/api/reset/password', {password: newPassword, accountId: accountId}).then((res)=>{
        const {affectedRows} = res.data
        console.log(`affectedRows: ${affectedRows}`)
        if(affectedRows)
        {
          setResetStep(1);
          setMode("login")


          setPasswordChangeSuccess(true)
        }
        else
          console.log(res)
      })
    }
    //return false
  }



  
  const redirectCreateAccount = ()=>{
    //const navigate = useNavigate()
    navigate("/Accounts/Create")
  }


  const [errorState, setErrorState] = useState({
    emailError: false,  //the error that displays when the 'email' field is empty
    otpCodeMatch: false,
    confirmPasswordMatch: false
  })
  const [mode, setMode] = useState('login')
  const store = useDispatch(state => state)
  const dispatch = useDispatch();
  //userName and password are kept in variables which update whenever the form details are altered
  const [userName, setUserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [loginAttempt, setLoginAttempt] = useState(0);
  const [resetStep, setResetStep] = useState(1)
  
  const encryptData = (message) => {
    var crypto = require("crypto");
    var mykey = crypto.createCipher("aes-128-cbc", "mypassword"); //create cypher deprecated but still works?
    var mystr = mykey.update(message, "utf8", "hex");
    mystr += mykey.final("hex");
    //console.log(mystr); //34feb914c099df25794bf9ccb85bea72}
    return mystr;
  };

//I should re-factor the other form components to use this method of storage


//form data for password reset
const [resetFormData, setResetFormData] = useState({
  recoveryKey: '',
  emailAddress: '',
  newEmailAddress: '',
  confirmNewEmailAddress: '',
  newPassword: '',
  confirmNewPassword: ''
})
//form data for "password recovery" segment
  const handleChange = (e)=>{
  const {name, value} = e.target
  setResetFormData({...resetFormData, [name]: value})
  console.log(resetFormData)
}
  useEffect(()=>{


    setPasswordChangeSuccess(false);
    //changeHandler(2)
  },[])

  const attemptLogin = () => {
    setPasswordChangeSuccess(false);
    Axios.get(`http://localhost:3001/api/get/account/${userName}`).then((res)=>{
      //console.log(res)
      //console.log(window.loggedStatus)


      //if a user attempts to log in and validation fails we don't want that error just sitting there
      
      if(res.data.length > 0)
      {

        const {adminPrivileges,username, password, accountId } = res.data[0]

        

        if(password == passWord)
        {console.log(`${passWord} == ${password}`)
        //console.log(adminPriveleges)
        //window.loggedStatus = {username:username, adminPriveleges: adminPriveleges}
        console.log(`adminPrivieleges was set to: ${adminPrivileges}`)


        //sessionStorage.setItem("permission_level", "admin")
        //sessionStorage.setItem("user_name", username)
        //setLoginState({username: username, permissionLevel: adminPriveleges})
        console.log(sessionStorage.getItem("permission_level"))
        var adminLevel = (adminPrivileges == 1) ? "admin" : "standard"
        console.log(adminPrivileges)

        //can't read payload?
        dispatch({type: "login", payload: {username: username, permissionLevel: adminLevel, userId: accountId}})


        //
        setLoginStatus(true)
        if(adminLevel == 'admin')
          navigate('/Admin/Home')

        else if(adminLevel == 'standard'){

          //root directory is the home page
          navigate('/')}


        //might remove this later? 
        //users now get redirected to home page after logging in rather than remaining here
        //similar to an app like facebook

        //setLoginStatus(true)
        //setLoginAttempt(3)
      }
        else {
          setLoginAttempt(1)
        }
      }
      else
        {console.log("errro response from server")
        setLoginAttempt(2)}
    })


  };
  return (
    <div id='main-content' className="white-mainclass" style={{overflowY: 'auto'}}>
    {/* <Container> */}



    <Tabs activeKey={mode}>
    <Tab title="Login" eventKey="login" disabled>
            {/* <h1 style={{marginLeft : '0px', textAlign: 'center'}}>Login</h1> */}

      <div className="text-center">
        <Image src={loginprofile} alt="profile" style={{margin: '50px'}} roundedCircle />
      </div>
      <div className="row justify-content-center">


        <Form.Group className="col-md-10" style={{textAlign: 'center'}}>
        {
          //displays error message based on login attempt success
          (() => {
            switch (loginAttempt) {
              case 1:
                return (
                  <Alert variant="danger">
                    Password does not match username
                  </Alert>
                );
              case 2:
                return (
                  <Alert variant="danger">
                    No account exists with that name
                  </Alert>
                );
              case 3:
                return (
                  <Alert variant="success">
                    We found an entry with that username and password
                  </Alert>
                );
              default:
                break;
            }
          })()
        }
          </Form.Group>
        <Form className="col-md-4">
          <Form.Group>


            <Alert variant="success" show={passwordChangeSuccess}>You've successfully changed your password! You should be able to log in now</Alert>
            <Form.Label>Username</Form.Label>
            <Form.Control
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              placeholder="Username"
            ></Form.Control>
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password"
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <p>
              <a className='override-href' onClick={()=>{setMode('recoverPassword');setResetStep(1);}}>Forgot Password</a>
            </p>
          </Form.Group>
          <Button onClick={attemptLogin}>Log in</Button> {/*<Button variant="secondary" onClick={()=>{redirectCreateAccount()}}>Create account</Button>*/}

          <Form.Group>
          <Form.Text className="text-muted">are you new here? if so you should <a className='override-href' style={{color: '#0d6efd'}} onClick={()=>{redirectCreateAccount()}}>create an account</a></Form.Text>
          </Form.Group>
          {/* <a onClick={()=>{setMode('recoverPassword')}}>test</a>
          <a onClick={()=>{console.log(mode)}}>logMode</a> */}
        </Form>
        
      </div>
      </Tab>


      {/* Password recovery for users who cannot login */}
      <Tab title="Password recovery" eventKey="recoverPassword" disabled>
        { (()=>
        {


        switch(resetStep)
        {
          case 1:
            return(

              <>
              <Form>
              <Form.Group>

              <Alert variant="danger" show={errorState.emailError}>We couldn't find any accounts registered with that email</Alert>
                <Form.Text className='text-muted'>Please enter the email you registered with</Form.Text>
              </Form.Group>
                <Form.Label>
                    Email Address
                </Form.Label>
                <Form.Control type="email" name="emailAddress" placeholder="Email address" onChange={(e)=>{handleChange(e)}}/>
              </Form>
              
              <Button onClick={()=>{
                sendRecoveryKey()
              }}>Send recovery email
              </Button> <Button onClick={()=>{handleCancel()}} variant="secondary">Cancel</Button>
              </>)
              case 2:
                return(
                  <>
                  <Form>
                    <Form.Text className="text-muted">We've sent you a verificaton code, please check your emails. If you can't find it check your spam folder.</Form.Text>
                    <Alert variant="danger" show={errorState.otpCodeMatch}>Verification code doesn't match</Alert>
                    <Form.Label>
                      Verification code
                    </Form.Label>

                    {/* uses old values for reasons beyond my understanding? */}
                    <Form.Control type='text' name='recoveryKey' onChange={(e)=>{handleChange(e)}} placeholder='Verification code'/>
                   </Form>
                   <Button onClick={()=>{verifyOtpCode()}}>Submit</Button> <Button variant='secondary' onClick={()=>{handleCancel()}}>Cancel</Button>
                   </>
                )
              case 3:
                console.log('case3')
                return(
                  <>
                  <Form>
                    <Form.Group>
                      <Form.Text className="text-muted">
                        Enter a new password
                      </Form.Text>  
                    </Form.Group>
                    <Form.Label>
                      Password
                    </Form.Label>
                    <Form.Control type='password' name="newPassword" onChange={(e)=>{handleChange(e)}} placeholder="Password" >
                      
                    </Form.Control>
                    <Form.Label>
                      Confirm password
                    </Form.Label>
                    <Form.Control type='password' name="confirmNewPassword" onChange={(e)=>{handleChange(e)}} placeholder='Password'>

                    </Form.Control>
                  </Form>
                   <Button onClick={()=>{finalisePasswordChange()}}>Change password</Button> <Button variant="secondary" onClick={()=>{handleCancel()}}>Cancel</Button>
                   </>)
                  default:
                    console.log('default')
                    break;
                 
            }
        })()
        
      }
      </Tab>
      </Tabs>
    </div>
  );
}

export default Login;
