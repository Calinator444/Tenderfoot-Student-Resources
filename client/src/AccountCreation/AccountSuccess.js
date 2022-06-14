import React, {useEffect} from 'react'
import {useParams} from "react-router-dom"



//maybe bundle this into one file

function AccountSuccess() {
const {activationKey} = useParams()
  return (
    <div id="main-content" className='white-mainclass' style={{height: '100vh', overflowX: 'scroll'}}>
        <h2>Success</h2>
        <p>You've successfully created an account! <br/>
        In order to use your account you need to do the following: 
         
        <ol>
            <li>Log into your student hotmail account (you can find the link to do so through <a href="myuon.newcastle.edu.au">myUON</a>)</li>
            <li>Search for an email from "tenderfoot.studentservices@gmail.com"</li>
            <li>Click the link provided</li>
            <li>Log in with the username and password you registered with</li>
        </ol>
        <i>We hope you enjoy the site!</i>
        </p>
    </div>
  )
}

export default AccountSuccess