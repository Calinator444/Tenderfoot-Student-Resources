//  Author(s): Caleb Williams
//  email: c3299204@uon.edu.au
//  date created: 7/9/21
//  description: a server intermediary based on Express and Node





//this is how we import node modules after we install them
//think of it like a java import statement


const crypto = require('crypto');


const decrypt = (message)=>{
    var crypto = require('crypto');
    var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update(message, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr;
    //console.log(mystr); //abc
}

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
    const emailAddress = decrypt(req.params.emailAddress);
    //console.log(decrypt())
    console.log(`email address is ${emailAddress}`)
    console.log(new Date().getTime());
    //let mins = timenow.getMinutes();
    //let hrs = timenow.getHours();
    let hrs = new Date().getHours();
    let mins = new Date().getMinutes();
    console.log('get request received at '+hrs+':'+mins);    
    db.query(selectQuery,emailAddress, (err, result) =>{
        if(err)
            console.log(err)
        else
            res.send(result);
    });
});


app.put("api/put/:password")

//built in method which hosts a listen server on port 3001
app.listen(3001, ()=>{
    console.log("server listening on port 3001")
});