//  Author(s): Caleb Williams
//  email: c3299204@uon.edu.au
//  date created: 7/9/21
//  description: a server intermediary based on Express and Node

//this is how we import node modules after we install them
//think of it like a java import statement


//Packages used to upload videos
//based on "Coding Shiksha's" tutorial

const {v4: uuid} = require('uuid')
const open = require('open')
const multer = require('multer')


const axios = require("axios");

const bodyParser = require("body-parser");
const mysql = require("mysql");
const express = require("express");
const app = express();
const bannedWords = ["fuck", "shit", "banana"];
const jsonParser = bodyParser.json();
const fs = require('fs')
const youtube = require("youtube-api")
const cors = require("cors");
//Fixes cors policy error
app.use(cors());
const crypto = require("crypto");


const todoQuery = "SELECT deadline, todoItemAccount.itemId, checked, description, title from TodoItem LEFT JOIN TodoItemAccount ON TodoItemAccount.itemId = todoItem.itemId LEFT JOIN accounts ON accounts.accountId = TodoItemAccount.accountId WHERE accounts.accountId =?";

const credentials = require("./credentials.json")

const commentSelectQuery =  "SELECT comments.body, datePosted, comments.commentID, replies.body AS replyBody FROM comments INNER JOIN commentThread ON commentThread.commentID = comments.commentId left JOIN replies ON replies.commentID = comments.commentID WHERE threadID = ? AND pendingModeration = 0 ORDER BY datePosted DESC";

const oAuth = youtube.authenticate({
  type: 'oauth',
  client_id: credentials.web.client_id,
  client_secret: credentials.web.client_secret,
  redirect_url: credentials.web.redirect_uris[0]

})

// const storage = multer.diskStorage({
//   destination: '/',
//   filename(req, file, cb) {
//     const newFileName = `${uuid()}-${file.originalname}`
//     cb(null,newFileName);
//   }
// })

// const uploadVideoFile = multer({
//   storage: storage
// }).single("videoFile");

//we use multer to save files locally because figuring out the directory of the file on the user's machine is a privacy violation
const upload = multer({dest: "uploads/"});


app.post('/api/uploadVideo', upload.single("videoFile"), (req, res)=>{
const {title, description} = req.body;
  console.log("upload video endpoint established")
  console.log(`file destination was set to: ${req.file.destination}`)
  //return
  const filename = req.file.path
  // if(req.file)
  //   console.log('we found a file')
  //return;
  //else
    console.log('no file?')
    console.log(`title: ${title} description: ${description}`)
    //return;


    //ignore the stuff below here
    
  //console.log(req.file.filename)
  // if(req.file){
    // const filename = req.body.videoFile;
    //const {title, description} = req.body


    // console.log(oAuth.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: 'https://www.googleapis.com/auth/youtube.upload',
    //   state: JSON.stringify({filename, title, description})
    // }))
    open(oAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/youtube.upload',
      state: JSON.stringify({filename, title, description})
    }))
  // }
  // else
  //   console.log('file not found')
})

app.get('/oauthcallback', (req, res)=>{
  // res.redirect("http://localhost:3001/home")
  //res.redirect()
  const {filename, title, description} = JSON.parse(req.query.state)

  oAuth.getToken(req.query.code, (err, tokens)=>{
    if(err)
    {
      console.log(err);
      return;
    }
    oAuth.setCredentials(tokens);

    youtube.videos.insert({
      resource: {
        snippet: {title, description},
        status: {privacyStatus: 'private'}
      },
      part: 'snippet,status', 
      media: {
        body: fs.createReadStream(filename)
      }

    }, (err, data)=>{
      console.log("Done");


      //youtube replies with a bunch of useful metadata once the video has been uploaded
      const videoId = data.data.id;


      
      const embedUrl = `https://www.youtube.com/embed/${data.data.id}`
      const thumbnail =`http://i3.ytimg.com/vi/${data.data.id}/hqdefault.jpg`
      const title = data.data.snippet.title
      const query = "insert into videos(videoLink, videoThumbnail, videoTitle) VALUES(?,?,?)";


      console.log(`title: ${title}`)
      //we can then insert the uploaded data into our database
      db.query(query, [embedUrl,thumbnail, title], (error, result)=>{
        if(error)
          console.log(error)
      })

      console.log(data)
      //process.exit();
    })
  })
})

const decrypt = (message) => {
  var crypto = require("crypto");
  var mykey = crypto.createDecipher("aes-128-cbc", "mypassword");
  var mystr = mykey.update(message, "hex", "utf8");
  mystr += mykey.final("utf8");
  return mystr;
};



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

const { convertToRaw } = require("draft-js");
const { threadId } = require('worker_threads');

//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json()

const db = mysql.createPool({
  password: "password",
  user: "root",
  database: "tenderfootDB",
  host: "localhost",
});


//jsonparser needs to be used 
app.post("/api/post/todo", jsonParser, (req, res)=>{
  const {title, description, accountId, date} = req.body;
  const statement = "INSERT INTO todoItem(description,title,deadline) VALUES(?,?,?)"
  const statement2 = "INSERT INTO todoItemAccount(accountId, itemId, checked) VALUES(?, ?, 0)"
  db.query(statement, [description, title, date], (err, result)=>{
    if(err)
      console.log(err)
    db.query(statement2,[accountId,result.insertId], (err2, result2)=>{
      if(err2)
        console.log(err2)
      db.query(todoQuery, [accountId],(err3, result3)=>{
        res.send(result3)
      })
      //res.send(result2)
    } )
  })
  //console.log(req.body)
})

app.get("/api/get/todo/:accountId", (req, res) => {

  const accountId = req.params.accountId;
  console.log(`accountId was set to ${accountId}`)
  const query = todoQuery;
  db.query(query, [accountId], (err, result) => {
    if (err) 
      console.log(err);
    res.send(result);


    
  });
});





//I'm planning to remove this once I've refined the query used to populate comment threads
app.get("/api/selectCommentsLegacy", (req, res) => {
  //const sqlQuery = "SELECT * FROM comment WHERE pendingModeration = 0";

  const sqlQuery =
    "SELECT comment.body, comment.commentID, replies.body AS replyBody FROM comments LEFT JOIN replies ON comments.commentID = replies.commentID";
  db.query(sqlQuery, {}, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});


//GET requests do not have bodies, we need to use queries instead
app.get("/api/selectcomments/:threadID", jsonParser, (req, res) => {
  const threadID = req.params.threadID;
  console.log('Searching for comment thread with the following ID:');
  console.log(threadID);
  const sqlQuery =
    "SELECT comments.body, replyAccount.username AS replyAccount, datePosted, accounts.username, comments.commentID, replies.body AS replyBody FROM comments INNER JOIN commentThread ON commentThread.commentID = comments.commentId left JOIN replies ON replies.commentID = comments.commentID INNER JOIN accounts ON accounts.accountId = comments.accountId left JOIN accounts AS replyAccount ON replyAccount.accountId = replies.userID WHERE threadID = ? AND pendingModeration = 0 ORDER BY datePosted DESC";
  db.query(sqlQuery, [threadID], (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});
app.post("/api/addReply", jsonParser, (req, res) =>{
  console.log("addReply request received")
  const query = "INSERT INTO replies(body, commentID, userID) VALUES(?,?,?)";
  const query2 = "SELECT replyID, body, username AS replyAccount, commentID FROM replies LEFT JOIN accounts ON accounts.accountId = replies.userID"
  const body = req.body.body;
  const id = req.body.id;
  const accountId = req.body.accountId;

  console.log(body);
  console.log(id);
  db.query(query, [body, id, accountId], (err,result)=>{
    if(err)
      {console.log(err)}
    else{
      db.query(query2, [id], (err2, result2)=>{
        res.send(result2)
      })
    }

    
  } )
  
});


app.get('/api/get/account/:username', jsonParser, (req, res)=>{
  console.log(req.params.username)

  const query = 'SELECT * FROM accounts WHERE username =  ?'
  db.query(query, [req.params.username], (error, result)=>{
    if(error)
      console.log(error)
    res.send(result)
  })

})


app.get("/api/selectUnmoderated", (req, res) => {
  const sqlQuery = "SELECT comments.commentID, username, body, pendingModeration, datePosted FROM comments INNER JOIN accountComment ON accountComment.commentID = comments.commentID INNER JOIN Accounts ON Accounts.accountId = accountComment.accountId INNER JOIN commentThread ON commentThread.commentID = comments.commentID INNER JOIN thread ON thread.threadID = commentThread.threadID WHERE pendingModeration > 0";
  db.query(sqlQuery, [], (error, result) => {
    if(error)
      console.log(err)
    else
    res.send(result);
  });
});




app.patch("/api/approveComment", jsonParser, (req, res) => {
  console.log("request received");
  console.log(req.body.body);

  const query = "UPDATE comments SET pendingModeration = 0 WHERE commentId = ?";
  const commentID = req.body.body;
  //console.log("request received");
  db.query(query, [commentID], (error, result) => {
    if (error) console.log(error);
    console.log("query complete");
  });
});
app.get("/api/get/videos", jsonParser, (req, res) => {
  const statement = "SELECT videos.videoID, thread.threadID, videoLink, videoThumbnail, videoTitle FROM videos INNER JOIN videoThread ON videoThread.videoID = videos.videoID LEFT JOIN thread ON thread.threadID = videoThread.videoID";
  db.query(statement, [], (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.post("/api/updateTestimonial", jsonParser, (req, res)=>{

  console.log("endpoint reached")

  const {textBodyId, body} = req.body;
  const statement = "UPDATE textBody SET body = ?  WHERE textBodyId = ?"

  db.query(statement, [body, textBodyId], (error, result)=>{
    if(error)
      console.log(error)
    else
      res.send(result)
  })


  

})

app.get("api/get/video/:videoId", (req, res)=>{
  const query = "SELECT * FROM videos WHERE videoId = ?"
  const videoId = req.params.videoId;

  db.query(query, [videoId], (error, result)=>{
    if(!error)
      res.send(result)

    else
      console.log("an error occurred")
  })
})
app.patch("/api/alterTodo", jsonParser, (req, res) => {
  //const itemID = req.body.body;
  const {checked, itemId, accountId} = req.body;
  const statement = "UPDATE todoItemAccount SET checked = ? WHERE itemId = ? AND accountId = ?";
  db.query(statement, [checked, itemId, accountId], (err, result) => {
    if (err) console.log(err);



    db.query(todoQuery,[accountId], (err2, result2)=>{
      res.send(result2)
    })
  });
  // console.log("altertodo fired");
  // console.log(req.body.body);
});
app.use(express.json());





//generic text bodies displayed on the site will also use this endpoint, but the 
app.get("/api/selectTestimonial/:textBodyId", jsonParser, (req, res)=>{

  const statement = "SELECT title,textBody.textBodyId ,body, videoLink, videoThumbnail FROM textBody LEFT JOIN textBodyVideo ON textBody.textBodyId = textBodyVideo.textBodyId LEFT JOIN videos ON textBodyVideo.videoId =  videos.videoId WHERE textBody.textBodyId = ?"
  //const statement = "SELECT * FROM textBody WHERE textBodyId = ?"
  db.query(statement, [req.params.textBodyId],(error, result)=>{

    if(!error)
    {
      res.send(result)
    }
    else
      console.log(error)
  })
})
app.get("/api/get/article/:title", jsonParser, (req, res)=>{
  console.log(req.params.title)
  console.log(req.params.title)
  const statement = "SELECT * FROM textBody WHERE title=?"
  db.query(statement, [req.params.title], (error, result)=>{
    
      res.send(result)
  })
})
app.post("/api/addTextBody", jsonParser, (req, res)=>{
  //testing whether or not JSON can be sent via HTTP post
  const {title, description, category, body} = req.body;
  const statement = "INSERT INTO textBody(title, body, summary, category) VALUES(?,?, ?, ?)";
  db.query(statement,[title,body,description, category ], (err, result)=>{
    if(err)
      res.send(err)
    else
      res.send(result)
  } )
  
  

}
);

//parameters: user comment
//returns: whether or not the content contained course language
app.post("/api/addcomment", jsonParser, (req, res) => {
  var pendingModeration = 0;
  const {body, threadID, accountId} = req.body 
  //var comment = req.body.body;
  //var threadID = req.body.threadID;
  // console.log(req.body.body);
  // if (hasCourseLanguage(comment)) {
  //   pendingModeration = 1;
  //   console.log("comment contained inappropriate language");
  // }
  const insertQuery =
    "INSERT INTO comments(body, pendingModeration, accountId) VALUES(?,?, ?)";
    //console.log(comment)
  const values = [body, pendingModeration, accountId];
  const insertQuery2 = "INSERT INTO commentThread VALUES(?,?)";
  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.log(err);
    } 
    else {
      console.log("running insert query 2")
      db.query(insertQuery2, [result.insertId, threadID], (secondErr, secondRes)=>{
        if(err)
           console.log(err)
           else {
             //let newComments = selectComments(threadID)
            //console.log(newComments)
             //res.send(newComments)
             db.query(commentSelectQuery,[threadID], (thirdErr, thirdRes)=>{
               if(thirdErr)
                console.log(thirdErr)
                else
                  res.send(thirdRes)
             })
             //console.log(newComments)
             console.log("query 2 successful")
           }
         });
         }
  });
  //res.send(hasCourseLanguage(comment)); //used to alert the user if the comment was negative
});

//these two should be merged into one function
app.get("/api/get/testimonials", (req, res)=>{
  const statement = "select textBodyId,title, summary from textBody WHERE category='testimonial'";
  db.query(statement,[], (error, result)=>{
    if(!error)
      res.send(result)
    else
      console.log(error)
  })

});


//probably merge these two at some poi


app.get("/api/get/articles", (req, res)=>{
  const statement = "select textBodyId,title, summary from textBody WHERE category='article'";
  db.query(statement,[], (error, result)=>{
    if(!error)
      res.send(result)
    else
      console.log(error)
  })

});


//responds with a json file containing the result of the query
app.get("/api/select/:emailAddress", (req, res) => {
  console.log("select fired");
  const selectQuery = "SELECT * FROM students WHERE emailAddress = ?";
  //const emailAddress = decrypt(req.params.emailAddress);
  emailAddress = req.params.emailAddress;
  //console.log(decrypt())
  console.log(`emaiddress received: ${emailAddress}`);

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
