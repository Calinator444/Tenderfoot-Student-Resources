//Author: Caleb
//Purpose: a segment for the site that allows users with existing accounts to reset their passwords
//Date created: May 2022




import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import {Form, Button, Alert} from 'react-bootstrap'
import Axios from 'axios'

function PasswordReset() {


  const store = useSelector(state => state)


  const [success, setSuccess] = useState(false)
  const [errorState, setErrorState] = useState({
    confirmPasswordMatch: false,
    oldPasswordMatch: false,
    oldPasswordNotMatch: false,//indicates the old password the user entered does not match the record in the database
    oldPasswordIdentical: false,//indicates that the new password is the same as the old one
    oldPasswordEmpty: false,
    newPasswordEmpty: false
  })

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const clientSideValidation = ()=>{

    const {newPassword, oldPassword, confirmPassword} = formData;
    var getErrorState = {...errorState}

    //check for empty fields
    //if(oldPassword == '')

    const oldPasswordEmpty = oldPassword == ''
    const newPasswordEmpty = newPassword == ''
    const confirmPasswordMatch = !(newPassword == confirmPassword)
    

    //the two final errors need to be reset here because if client side validation fails
    getErrorState = {...getErrorState, oldPasswordEmpty: oldPasswordEmpty,
    newPasswordEmpty: newPasswordEmpty, confirmPasswordMatch: confirmPasswordMatch, oldPasswordIdentical: false, oldPasswordNotMatch: false}
    console.log(`oldPassword: ${oldPassword}`)
    console.log(getErrorState)
    //setErrorState(getErrorState)
    console.log(`${oldPasswordEmpty} ${newPasswordEmpty} ${confirmPasswordMatch}`)
    //'errors' prop ondicates that a field was not properly filled out on the client side and validation has failed
    return {errors: !(oldPasswordEmpty || newPasswordEmpty || confirmPasswordMatch), errorStatus: getErrorState}
      
    // if(!(newPassword == confirmPassword))

  }

  const attemptPasswordChange = ()=>{
    
    const clientSideValid = clientSideValidation()
    console.log(`client side valid: ${clientSideValid.errors}`)
    const {oldPassword, newPassword} = formData;
    if(!clientSideValid.errors)
    {
      console.log('client side was not valid')
      setErrorState(clientSideValid.errorStatus)
      setSuccess(false)
      return}
    else{
    //now we perform server side validation

      var errorList = {...clientSideValid.errorStatus}


     console.log(store.userId)
     Axios.get(`http://localhost:3001/api/get/password/${store.userId}`).then((res)=>{
      const {password} = res.data[0]
      //console.log(res.data)

      const oldPasswordNotMatch = password != oldPassword
      const oldPasswordIdentical = password == newPassword
      //const
      errorList = {...errorList, oldPasswordNotMatch: oldPasswordNotMatch, oldPasswordIdentical: oldPasswordIdentical}
      

      if(oldPasswordNotMatch || oldPasswordIdentical)
        {
        setSuccess(false)
        setErrorState(errorList)
        return;
      }
      else
      {
        //if validation passes we reset the password
        Axios.patch('http://localhost:3001/api/reset/password', {accountId: store.userId, password: newPassword }).then((res)=>{
          console.log(res)
          const {affectedRows} = res.data
          if(affectedRows)
          {
            if(affectedRows > 0)
              setSuccess(true)
          }
          
        })
      }

     })}
  }


  const handleChange = (e)=>{



    const {name, value} = e.target
    setFormData({...formData, [name]:value})

    //console.log({...formData, [name]:value})
  }



  return (
    <div id="main-content" className="white-mainclass">
      <Form>




        <Alert variant="success" show={success}>Your password has been updated!</Alert>
        <Form.Label>Enter your current password</Form.Label>
        <Alert variant="danger" show={errorState.oldPasswordNotMatch}>Incorrect password</Alert>
        
        <Alert variant="danger" show={errorState.oldPasswordEmpty}>Please enter your old password</Alert>
        <Form.Control type="password" onChange={(e)=>{handleChange(e)}} name="oldPassword" placeholder='Password'>
        </Form.Control>



        <Form.Label>New password</Form.Label>
        <Alert variant="danger" show={errorState.oldPasswordIdentical}>New password cannot be your existing password</Alert> 
        <Alert variant="danger" show={errorState.newPasswordEmpty}>Please enter a new password</Alert>
        <Form.Control name="newPassword" onChange={(e)=>{handleChange(e)}} placeholder="Password" type="password" >

        </Form.Control>

        
        <Form.Label>Confirm new password</Form.Label>
        <Alert variant="danger" show={errorState.confirmPasswordMatch}>The password you entered does not match the password you entered above</Alert>
        <Form.Control type='password' name="confirmPassword" onChange={(e)=>{handleChange(e)}} placeholder='Confirm password'>

        </Form.Control>
        <Button onClick={()=>{attemptPasswordChange()}}>Reset Password</Button>
      </Form>
    </div>
  )
}

export default PasswordReset