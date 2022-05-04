import React, { useEffect, useState } from "react";
import "./css/App.css";
import * as mui from "@mui/icons-material";
import SidebarData from "./SidebarData";
import Mainnav from "./reactcomponents/Mainnav";
import Logo from "./resources/books.png" 
import ListGeneric from "./Testimonials/ListGeneric"
import Axios from "axios"
import ArticleList from "./Testimonials/ArticleList"
import {Reducer} from "./index"
import {useSelector, useDispatch, ReactReduxContext} from "react-redux"

import tileContents, { TileContents } from "./TileContents"
//any non-javascript items we import need 
import todoImage from "./resources/todo.jpg"

import placeHolder from "./resources/placeholder.png"
import Tile from "./reactcomponents/Tile";

import {Button, Form} from "react-bootstrap";
{
  //elements of the ui update automatically whenver state variables are changed
}

function Home() {
  const store = useSelector(state => state)

  const dispatch = useDispatch()
  const [articles, setArticles] = useState([]);

  useEffect(() => {


    //dispatch({type: 'login', payload: {username: 'Caleb'}})
    //let store = useSelector(state => state.username)
    console.log(store)
    Axios.get("http://localhost:3001/api/get/articles").then((res)=>{
      setArticles(res.data)
    
    })
  }, []);



  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <div className="root">
      <Form.Select>
            <option value='test'></option>
        </Form.Select>
      {/* <div
        id="sidebar-main"
        className={sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}
      >
        <ul className="checklist">w
          <SidebarData />
        </ul>
        <button
          type="button"
          onClick={() => {
            setSidebarExpanded(!sidebarExpanded);
          }}
        >
          Dismiss
        </button>

        <mui.CheckCircle />
      </div> */}

      {
        //side menu is collapsed by defaults
      }
              {/* <header style={{backgroundColor: "rgb(122 122 122)"}}> <img width="300px" src={Logo} alt="book-logo" /> </header> */}
  
      <div
        id="main-content"
        // className={sidebarExpanded ? "main-collapsed" : "main-expanded"}
      >
            <h1>Home</h1>
        {/* wrapper class is used for grid layout */}

        <Button onClick={()=>{
          console.log(store)
        }}>Test button</Button>

        
        {/* tile list */}
        <div class="tile-wrapper">

          {TileContents.map((val)=>{
              const {body, title, backgroundImage, link} = val

              return (
                <Tile title={title} backgroundImage={backgroundImage} link={link}>{body}</Tile>
              )


          })}
          {/* <Tile backgroundImage={todoImage} title="todo-list">Keep track of all the work you'll need to get done before the semester gets too busy. You can do so using the todo list we've built for you.</Tile> */}


          {/* <Tile backgroundImage={placeHolder} title="placeholder1">placeholder text</Tile>
          <Tile backgroundImage={placeHolder} title="placeholder2">placeholder text</Tile>
          <Tile backgroundImage={placeHolder} title="placeholder3">placeholder text</Tile>
          <Tile backgroundImage={placeHolder} title="placeholder4">placeholder text</Tile>
          <Tile backgroundImage={placeHolder} title="placeholder5">placeholder text</Tile> */}
          </div>
          {/* <div className="tile" style={{backgroundImage : `url(${todoImage})`}}>

            <h2>todo-list</h2>
            <p>Keep track of all the work you'll need to get done before the semester gets too busy. You can do so using the todo list we've built for you.</p>
            <Button variant="light">Click here</Button>
          </div> */}
      </div>


      <div>
        
        <div className='article-wrapper-full'>
          <h2>Articles</h2>
          <ListGeneric dataset={articles} gridOverride/>
        </div>

      </div>
    </div>
  );
}

export default Home;
