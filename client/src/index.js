import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {createStore} from "redux"
import { BrowserRouter } from "react-router-dom";
import { BreakfastDiningOutlined, StarTwoTone } from "@mui/icons-material";
import {Provider, connect} from 'react-redux'
//const Container = connect()(App)





// const mapStateToProps = state => {
//   return {
//     count: state
//   }
// }


//const Container = connect(mapStateToProps)(Contents)

const Contents = ()=>{

}

// const mapDispatchToProps = dispatch =>{
//   return {
//     handleIncrementClick: ()=>dispatch({type: 'INCREMENT'}),
//     handleDecrementClick: ()=> dispatch({type: 'DECREMENT'})

//   }
// }

const Reducer = function(state = {}, action){
  switch(action.type)
  {
    //replaces all the attributes in the states with the new ones, otherwise maintains old values
    case "login":
    console.log('"login" occurred')
    console.log(action.payload)
    return {...state, ...action.payload}
    case "logout":
    console.log("logout case")
    return {}; 
    default:
    console.log("default fired")
    break;
  }
}
const store = createStore(Reducer) 

//const Container = connect(Reducer)(Contents)
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
  ,
  document.getElementById("root")
);

reportWebVitals();
