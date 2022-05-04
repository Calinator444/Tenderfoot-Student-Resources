//import logo from "./logo.svg";
import books from "./resources/books.png";
import loginprofile from "./resources/loginprofile.png";
//a list of the bootstrap elements we'll be using
import { Button, Alert, Card, Form, Container, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
//import { useHistory } from "react-router-dom";
import Axios from "axios";
import { React, useEffect, useState, NavBar } from "react";
import { ContactSupportOutlined } from "@mui/icons-material";

function Login(props) {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const {setLoginStatus} = props;
  const store = useDispatch(state => state)
  const dispatch = useDispatch();
  //userName and password are kept in variables which update whenever the form details are altered
  const [userName, setUserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [loginAttempt, setLoginAttempt] = useState(0);

  
  const encryptData = (message) => {
    var crypto = require("crypto");
    var mykey = crypto.createCipher("aes-128-cbc", "mypassword"); //create cypher deprecated but still works?
    var mystr = mykey.update(message, "utf8", "hex");
    mystr += mykey.final("hex");
    //console.log(mystr); //34feb914c099df25794bf9ccb85bea72}
    return mystr;
  };

  useEffect(()=>{
    //changeHandler(2)
  },[])

  const attemptLogin = () => {
    Axios.get(`http://localhost:3001/api/get/account/${userName}`).then((res)=>{
      //console.log(res)
      //console.log(window.loggedStatus)

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
        setLoginStatus(true)
        setLoginAttempt(3)}
        else {
          setLoginAttempt(1)
        }
      }
      else
        {console.log("errro response from server")
        setLoginAttempt(2)}
    })


    //DEPRECATED
    //console.log('attempting login');
    //var loginAttempt = encrypt(userName);

    // console.log(`http://localhost:3001/api/select/${encryptData(userName)}`);
    // axios
    //   .get(`http://localhost:3001/api/select/${encryptData(userName)}`)
    //   .then((res) => {
    //     console.log("axios.get fired");
    //     if (res.data.length > 0) {
    //       //console.log(res.data[0].pWord);
    //       var password = res.data[0].pWord; //pword cannot be invoked when res.data is stored in a variable
    //       if (password.localeCompare(passWord) == 0) {
    //         //console.log("login successful");
    //         //history.push('/Home')
    //         setLoginAttempt(3);
    //       } else {
    //         console.log("password does not match username");
    //         setLoginAttempt(1);
    //       }
    //       //console.log(password.localeCompare(passWord) == 0);//primitives can be compared using "==" presumably
    //     } else {
    //       setLoginAttempt(2);
    //       console.log("that username does not eist");
    //     }
    //     //console.log("axios request complete")
    //   });
  };

  //let history = useHistory();
  return (
    <div id='main-content' className="white-mainclass" style={{overflowY: 'auto'}}>
    {/* <Container> */}
            <h1 style={{marginLeft : '0px', textAlign: 'center'}}>Login</h1>

      <div className="text-center">
        <Image src={loginprofile} alt="profile" roundedCircle />
      </div>
      <div className="row justify-content-center">
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
        <Form className="col-md-4">
          <Form.Group>
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
              <a href="">Forgot Password</a>
            </p>
          </Form.Group>
          <Button onClick={attemptLogin}>Log in</Button>
        </Form>
      </div>
    {/* </Container> */}
    </div>
  );
}

export default Login;
