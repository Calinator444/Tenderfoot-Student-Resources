//  Author(s): Caleb Williams
//  email: c3299204@uon.edu.au
//  date created: 7/9/21
//  description: a server intermediary based on Express and Node

//this is how we import node modules after we install them
//think of it like a java import statement

const crypto = require("crypto");

const decrypt = (message) => {
  var crypto = require("crypto");
  var mykey = crypto.createDecipher("aes-128-cbc", "mypassword");
  var mystr = mykey.update(message, "hex", "utf8");
  mystr += mykey.final("utf8");
  return mystr;
};

const axios = require("axios");

const bodyParser = require("body-parser");
const mysql = require("mysql");
const express = require("express");
const app = express();
const bannedWords = ["fuck", "shit", "banana"];

function hasCourseLanguage(word) {
  var courseLanguage = false;
  bannedWords.forEach((element) => {
    if (word.match(element)) {
      //console.log('derogatory language found');
      courseLanguage = true;
    }
  });
  //console.log('no derogatory language found');
  return courseLanguage;
  //onsole.log('true')})
}
const cors = require("cors");
const { copyFileSync } = require("fs");

const jsonParser = bodyParser.json();
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json()

const db = mysql.createPool({
  password: "password",
  user: "root",
  database: "tenderfootDB",
  host: "localhost",
});

//Fixes cors policy error
app.use(cors());

app.get("/api/todo", (req, res) => {
  const query = "SELECT * FROM todoList";
  console.log("get request received");
  db.query(query, {}, (err, result) => {
    console.log('sending "todolist" contents...');
    if (err) console.log(err);
    else res.send(result);
  });
});



app.post("/api/addReply", jsonParser, (req, res) =>{
  console.log("addReply request received")
  const query = "INSERT INTO replies(body, commentID) VALUES(?,?)";
  const body = req.body.body;
  const id = req.body.id;

  console.log(body);
  console.log(id);
  db.query(query, [body, id], (err,res)=>{
    if(err)
      console.log(err)
  } )
  
});

app.get("/api/selectcomments", (req, res) => {
  //const sqlQuery = "SELECT * FROM comment WHERE pendingModeration = 0";

  const sqlQuery =
    "SELECT comment.body, comment.commentID, replies.body AS replyBody FROM comment LEFT JOIN replies ON comment.commentID = replies.commentID";
  db.query(sqlQuery, {}, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.get("/api/selectModerated", (req, res) => {
  const sqlQuery = "SELECT * FROM comments WHERE pendingModeration = 1";
  db.query(sqlQuery, [], (error, result) => {
    res.send(result);
  });
});

app.post("/api/approveComment", jsonParser, (req, res) => {
  console.log("request received");
  console.log(req.body.body);

  const query = "UPDATE comments SET pendingModeration = 0 WHERE id = ?";
  const commentID = req.body.body;
  //console.log("request received");
  db.query(query, [commentID], (error, result) => {
    if (error) console.log(error);
    console.log("query complete");
  });
});
app.get("/api/get/videos", jsonParser, (req, res) => {
  const statement = "SELECT * FROM videos";
  db.query(statement, [], (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});
app.post("/api/alterTodo", jsonParser, (req, res) => {
  const itemID = req.body.body;

  const statement = "UPDATE TABLE todoList SET completed = 1 WHERE id = ?";

  db.query(statement, [itemID], (error, result) => {
    if (error) console.log(error);
  });
  // console.log("altertodo fired");
  // console.log(req.body.body);
});
app.use(express.json());

//parameters: user comment
//returns: whether or not the content contained course language
app.post("/api/addcomment", jsonParser, async (req, res) => {
  var pendingModeration = 0;
  var comment = req.body.body;
  console.log(req.body.body);
  if (hasCourseLanguage(comment)) {
    pendingModeration = 1;
    console.log("comment contained inappropriate language");
  }
  const insertQuery =
    "INSERT INTO comment(body, pendingModeration) VALUES(?,?)";
  const values = [comment, pendingModeration];
  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.log(err);
    } else console.log(req.body.body + " added");
  });
  res.send(hasCourseLanguage(comment)); //used to alert the user if the comment was negative
});

//responds with a json file containing the result of the query
app.get("/api/select/:emailAddress", (req, res) => {
  console.log("select fired");
  const selectQuery = "SELECT * FROM students WHERE emailAddress = ?";
  //const emailAddress = decrypt(req.params.emailAddress);
  emailAddress = req.params.emailAddress;
  //console.log(decrypt())
  console.log(`email address received: ${emailAddress}`);

  emailAddress = decrypt(emailAddress);
  console.log(`email address decrypted: ${emailAddress}`);
  //console.log(new Date().getTime());
  let hrs = new Date().getHours();
  let mins = new Date().getMinutes();
  //console.log('get request received at '+hrs+':'+mins);
  db.query(selectQuery, emailAddress, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

//app.put("api/put/:password")
//built in method which hosts a listen server on port 3001
app.listen(3001, () => {
  console.log("server listening on port 3001");
});
