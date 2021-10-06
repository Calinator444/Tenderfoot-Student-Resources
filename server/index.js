//  Author(s): Caleb Williams
//  email: c3299204@uon.edu.au
//  date created: 7/9/21
//  description: a server intermediary based on Express and Node





//this is how we import node modules after we install them
//think of it like a java import statement
const axios = require('axios');
const mysql = require('mysql');
const express = require('express');
const app = express();

const cors = require('cors');


const db = mysql.createPool({
    password: "password",
    user: "root",
    database: "tenderfootDB",
    host: "localhost"
});
//fixes cors policy error
//app.use(cors);//cors prevents server from responding?
//app.use(cors);


//responds with a json file containing the result of the query
app.get("/api/select/:emailAddress", (req, res) =>{
    const selectQuery = "SELECT * FROM students WHERE emailAddress = ?";
    const emailAddress = req.params.emailAddress;
    console.log(`email address is ${emailAddress}`)
    console.log('get request received...');    
    db.query(selectQuery,emailAddress, (err, result) =>{
        if(err)
            console.log(err)
        else
            res.send(result);
    });
});


//built in method which hosts a listen server on port 3001
app.listen(3001, ()=>{
    console.log("server listening on port 3001")
});