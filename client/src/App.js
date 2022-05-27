import { Button, Alert, Card, Form, Container, Image } from "react-bootstrap";
import Map from "./Map";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
// import CommentTest from "./CommentTest";
import VideoPlayer from "./VideoPlayer";
import Home from "./Home";
import ForumPost from "./ForumPost";
import Sidebar from "./Sidebar";
import Forum from "./Forum";
import Footer from "./reactcomponents/Footer"

import Adminnav from './reactcomponents/Adminnav'

import Mainnav from "./reactcomponents/Mainnav";
import AdminHome from "./Admin/Home";
import CommentAudit from "./Admin/CommentAudit";


import TodoList from "./TodoList"
import TestimonialBuilder from "./Admin/TestimonialBuilder";
import TestimonialList from './Testimonials/TestimonialList';


import TestimonialView from './Testimonials/TestimonialView'

import ArticleBuilder from './Admin/ArticleBuilder'
import {useSelector} from "react-redux"
import ArticleList from './Testimonials/ArticleList'
import CreateAccount from "./AccountCreation/CreateAccount";
import NotFound from "./NotFound";
import { BrowserRouter, Route, Routes, Router, Link } from "react-router-dom";
import { React, useEffect, useState } from "react";


import ArticleView from "./ArticleView";
import AccountSuccess from "./AccountCreation/AccountSuccess";
import ActivateAccount from "./AccountCreation/ActivateAccount";
import PasswordReset from "./AccountCreation/PasswordReset";



//sessionStorage.setItem("test_value", {username: 'test', password: null})
function App() {
  
  const store = useSelector(state => state)

  const [showList, setShowlist] = useState(false)
  //"setLoginStatus" is used by child elements to force useEffect to fire (Session variable changes do not cause useEffect to fire)
  const [loginStatus, setLoginStatus] = useState(false)
  const [userName, setUserName] = useState('')

  const [adminMode, setAdminMode] = useState(false)

  useEffect(()=>{
    if(store)
    {
      if(store.permissionLevel == 'admin')
      setAdminMode(true)
      else 
        setAdminMode(false)
    }
    console.log(`login status inside App.js set to: ${loginStatus}`)
      //if(loginStatus)
      //  setUserName(store.username)
      //set the default "login" state
      //const username = "guest"
      //sessionStorage.setItem("login_status", {permissionLevel: "guest", username: null, adminPriveleges: false})
      //sessionStorage.setItem("permission_level", username)
      //sessionStorage.setItem("user_name", username)
      //setAccountDetails({username: username, permissionLevel: username})
      console.log("App.js useEffect fired")
  },[loginStatus])
  return (
    //using reac-router-dom to emulate hyperlinking between webpages
    <div className="App">
      {/* <Router> */}

       {adminMode ?  
      <Adminnav setLoginStatus={setLoginStatus}/>
      
      :
      <Mainnav setLoginStatus={setLoginStatus} loginStatus={loginStatus}/>

      }
        <Routes>

        <Route path="/" element={<Home/>}>
        </Route>



        {/* ADMIN PORTAL */}
        <Route path="/Admin/TestimonialBuilder" element={<TestimonialBuilder/>}/>
        <Route path="/Admin/ArticleBuilder" element={<ArticleBuilder/>}/>
        <Route path="/Admin/Home" element={<AdminHome/>}/>


        {/* We pass the setter so that child elements can modify the parent state */}
        <Route path="/Login" element={<Login setLoginStatus={setLoginStatus}/>}/>
        <Route path="/Map" element={<Map/>}/>


        <Route path='/Videos' loginStatus={loginStatus} element={<VideoPlayer/>}/>


        
        {/* Should probably rename this to 'Articles' */}
        <Route path='/ArticleView/:title' element={<ArticleView/>}/>
        <Route exact path="/Testimonials/TestimonialList" element={<TestimonialList/>}/>




        <Route exact path='/Testimonials/:title' element={<TestimonialView/>}/>
        
        <Route exact path="/ArticleList" element={<ArticleList/>}/>
        <Route exact path="/TodoList" element={<TodoList/>}/>



        <Route path="*" element={<NotFound/>}/>

        {/* ACCOUNT CREATION */}
        <Route path="/Accounts/Create" element={<CreateAccount/>}/>
        <Route path="/Accounts/Create/Success" element={<AccountSuccess/>}/>
        <Route path="/Accounts/Activate/:activationKey" element={<ActivateAccount/>}/>
        <Route path="/Accounts/PasswordReset" element={<PasswordReset/>} />




          </Routes> 

          <Sidebar/>
        <Footer/>
    </div>


    
  );
}

export default App;
