//  Author(s): Caleb Williams
//  email: c3299204@uon.edu.au
//  date created: 7/9/21
//  description: a server intermediary based on Express and Node





//this is how we import node modules after we install them
//think of it like a java import statement

const mysql = require('mysql');
const express = require('express')
const app = express();


const db = mysql.createPool({
    password: "password",
    user: "root",
    database: "tenderfootDB",
    host: "localhost"
});


app.get("/api/select", (req, res) =>{
    const selectQuery = "SELECT * FROM students";
    
    //res.send('hell world')
    //result of the database query is mapped to "result"
    //if an error occurs it is logged
    db.query(selectQuery,{}, (err, result) =>{
        if(err)
            console.log(err)
        else
            res.send(result);
    });
});



app.listen(3001, ()=>{
    console.log("server listening on port 3001")
});