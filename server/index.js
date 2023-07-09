//  Author(s): Caleb Williams
//  email: c3299204@uon.edu.au
//  date created: 7/9/21
//  description: a server intermediary based on Express and Node

//this is how we import node modules after we install them
//think of it like a java import statement


//make like a git repository and git forked lmaOOOOOOO


const nodemailer = require("nodemailer")




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tenderfoot.studentservices@gmail.com',
        pass: 'tenderPass5247'
    }
})
//based on a sample provided by 'Sleepy Shrike' on Dec 08 2019
//  https://www.codegrepper.com/code-examples/javascript/random+20+character+string+js

const createNumerickey = (length)=>{
  var str = ''
  var numbers = '0123456789'
  for (var i = 0; i < length; i++)
    str += numbers.charAt(Math.floor(Math.random() * numbers.length))
  return str
}





const {v4: uuid} = require('uuid')
const open = require('open')
const multer = require('multer')


const axios = require("axios");

const bodyParser = require("body-parser");
const mysql = require("mysql");
const express = require("express");
const app = express();
const bannedWords = ["fuck", "shit", "banana", "cunt"];
const jsonParser = bodyParser.json();
const fs = require('fs')
const youtube = require("youtube-api")
const cors = require("cors");
//Fixes cors policy error
app.use(cors());
const crypto = require("crypto");


const todoQuery = "SELECT deadline, todoItemAccount.itemId, checked, description, title from TodoItem LEFT JOIN TodoItemAccount ON TodoItemAccount.itemId = todoItem.itemId LEFT JOIN accounts ON accounts.accountId = TodoItemAccount.accountId WHERE accounts.accountId =?";

const credentials = require("./credentials.json")



//selects comments and replies for each respective comment
const commentSelectQuery =  "SELECT accounts.username, comments.body, dateAdded, datePosted, comments.commentID, replies.body AS replyBody FROM comments INNER JOIN accounts ON accounts.accountId = comments.accountId INNER JOIN commentThread ON commentThread.commentID = comments.commentId left JOIN replies ON replies.commentID = comments.commentID WHERE threadID = ? AND comments.pendingModeration = 0 ORDER BY datePosted DESC";

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
const uploadImages = multer({dest: 'images/'});






//used to upload images to the 'media library', wherein future admins can use this media to decorate articles
app.post('/api/upload/image', uploadImages.single('imageFile'), (req,res)=>{
  const statement = 'INSERT INTO mediaFile(fileDirectory) VALUES(?)'

  console.log(`req.file: ${req.file}`)

  console.log(`filename: ${req.file.filename}`);
  //console.log(`req.name: ${req.file.name}`) //name prop is undefined
  db.query(statement, [req.file.filename], (err, result)=>{
    if(err)
      console.log(err);
    else{
      db.query('SELECT * FROM mediaFile', (err2, result2)=>{
        res.send(result2);
      })
    }
  })
  //console.log(req.file.path)

  //might add some sql stuff
})

app.post('/api/uploadVideo', upload.single("videoFile"), (req, res)=>{
const {title, description, testimonialTitle} = req.body;
  console.log(`testimonialTitle: ${testimonialTitle}`)
  console.log("upload video endpoint established")
  console.log(`file destination was set to: ${req.file.destination}`)
  const filename = req.file.path

    console.log('no file?')
    console.log(`title: ${title} description: ${description}`)
    open(oAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/youtube.upload',
      state: JSON.stringify({filename, title, description})
    }))

    res.send({status: 'success'})
})

//it's hard to explain why this works, when the front end selects videos that have a thread attached it knows that those videos are meant
//to be show in the video player
app.post('/api/upload/video/thread', upload.single("videoFile"), (req, res)=>{
  const {videoTitle, videoLink, videoThumbnail, videoDescription} = req.body

  //this is a terrible way to do this... but the presentation is due in 3 days so... rip


  var params;
  var query
  if(req.file)
  {
    query = 'INSERT INTO videos(videoTitle) VALUES(?)';
    params = [videoTitle]
  }
  else
  {
    query = 'INSERT INTO videos(videoLink, videoThumbnail, videoTitle) VALUES(?,?,?)'
    params = [videoLink, videoThumbnail, videoTitle]
  }

    db.query(query, params, (err, result)=>{
      if(!err){


        db.query('INSERT INTO thread(threadID) VALUES(null)',(err2, result2)=>{
        if(!err2)
        {
          db.query('INSERT INTO videoThread(threadID, videoID) VALUES(?,?)',[result2.insertId, result.insertId],(err3, result3)=>{
            if(!err3){
            if(req.file)
            {
                const filename = req.file.path  
                const title = videoTitle
                const description = videoDescription
                open(oAuth.generateAuthUrl({
                  access_type: 'offline',
                  scope: 'https://www.googleapis.com/auth/youtube.upload',
                  state: JSON.stringify({filename, title, description})
                }))
                 //res.send(result3)
            }
            res.send(result3)
          } else(console.log(err3))

           
          }) 
        }
        else  console.log(err2)
      }
      )}
      else
      {
        console.log(err)
      }
      })
    })
    // else if(videoLink)
    // {
    //   db.query('')
    // }

  



app.get('/get/media', (req, res)=>{
  db.query('SELECT * FROM mediaFile ORDER BY dateAdded DESC', (err, result)=>{
    if(err)
      console.log(err)
    else
      res.send(result)  
})
})


app.post('/update/testimonial/link', jsonParser, (req, res)=>{
  const {videoLink, videoThumbnail, videoId} = req.body
  db.query('UPDATE videos SET videoLink= ?, videoThumbnail = ? WHERE videoId = ?', [videoLink, videoThumbnail, videoId],(err,result)=>{
    if(err)
    {
      console.log(err)
      res.send(err)
    }
    else
    {
      res.send(result)
    }

  } )

})

app.post('/update/testimonial', upload.single('videoFile'),jsonParser, (req,res)=>{
  const {textBodyId, videoTitle, videoDescription} = req.body;
      const description = videoDescription
      
      const title = req.body.videoTitle
      console.log(`File was set to: ${req.file}`)
      const filename = req.file.path  
      open(oAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/youtube.upload',
      state: JSON.stringify({filename, title, description})
    }))
    //a response confirms that the endpoint was met
    res.send({status: 'success'})



})


//app.patch('update/testimonial/video')

app.post('/api/uploadTestimonial', upload.single("videoFile"),jsonParser, (req, res)=>{
const {title, description, previewImage, testimonialTitle, testimonialBody, videoLink, videoThumbnail} = req.body;


  db.query("INSERT INTO textBody(body, title, category, previewImage) VALUES(?,?,'testimonial', ?)", [testimonialBody, testimonialTitle, previewImage],(err, result)=>{
    if(err)
      {

        //res.send must come before console log?
        res.send(err)
        console.log(err)
        return
        //console.log('error occurred in text body')
        //console.log(err)
        //res.send(err)
        //return
      }
      else {
      //we don't have the link for the video yet so we simply insert the title
      //we can re-use the title in the callback query 

      var params;
      var query;
      if(videoLink)
      { 
        query = 'INSERT INTO videos(videoTitle, videoThumbnail, videoLink) VALUES(?,?,?)'
        params = [title.trim(),videoThumbnail, videoLink]
      }
      else{
        query = "INSERT INTO videos(videoTitle) VALUES(?)"
        params = [title.trim()]
      }
      db.query(query, params, (err2, result2)=>{
        if(err2)
          console.log(err2)
        else
        {


          //textBodyVideo is used to assosciate written articles with videos. For instance, testimonials often contain written content as well as multimedia

          db.query('INSERT INTO textBodyVideo(textBodyId, videoId) VALUES(?,?)', [result.insertId, result2.insertId], (err3, result3)=>{
            if(err3){

              console.log(err3)
            }
            else 
            {
              res.send(result3)
              console.log('Testimonial uploaded! were golden!')
              if(!videoLink){
                const filename = req.file.path
  // if(req.file)
  //   console.log('we found a file')
  //return;
  //else
    // console.log('no file?')
    //console.log(`title: ${title} description: ${description}`)

            open(oAuth.generateAuthUrl({
              access_type: 'offline',
              scope: 'https://www.googleapis.com/auth/youtube.upload',
              state: JSON.stringify({filename, title, description})
            }))}
            //res.send(result3)
            }
          })
        }



      })

      }
  })
  //console.log(req.body)
  //console.log(`testimonial title: ${testimonialTitle}`)

  //console.log("upload video endpoint established")
  //console.log(`file destination was set to: ${req.file.destination}`)
  //return


})



app.post('/email/service', jsonParser, (req, res)=>{

  const {username, password, service, emailAddress} = req.body



  //'mailSettings' needs to be defined outside of the switch structure or else we get an annoying error
  let mailSettings = {}

  
  switch(service)
  {
    case 'account-creation':
      const query = "INSERT INTO Accounts(emailAddress, username, password, active, adminPrivileges) VALUES(?,?,?,0,0)"
      const query2 = "INSERT INTO accountActivation(accountId, activationKey) VALUES(?,?)"
      const key = generateAcivationKey();
      console.log(key)
      mailSettings = {
      from: 'tenderfoot.studentservices@gmail.com',
      to: emailAddress,
      subject: 'Account activation',
      text: "You've successfully registered an for tenderfoot under the username "+username+
      '\r\nto activate your account click the link below\r\n'+
      'http://localhost:3000/Accounts/Activate/'+key
      }
      db.query(query, [emailAddress, username, password], (error, result)=>{
        if(error)
          {
            console.log("an error occured")
            //can be used to inform the client-side of duplicate table entries
            res.send(error)
            console.log(error)
            //return //ensures function does not continue executing
          }
        else {
          console.log("else clause fired?")
          db.query(query2, [result.insertId, key], (error2, result2)=>{
            if(error2){
              console.log('error occured with query 2')
            }
              //console.log(error2)
            else  {

            
            transporter.sendMail(mailSettings, (emailErr, inf)=>{
                if(emailErr)
                  console.log(emailErr)
              })

              res.send(result2)
            }
          })
      }
      });
      break; 
      case "otp-reset":

      //if the foreign key constraint fails it means that the corresponding account doesn't exist
      console.log(`email address: ${emailAddress}`)
      const statement = 'SELECT * FROM accounts WHERE emailAddress = ?'

      //deletes any existing change requests before creating a new one
      //DELETE FROM passwordChangeRequest WHERE accountId = ?
      const statement2 = 'DELETE FROM passwordChangeRequest WHERE accountId = ?;INSERT INTO passwordChangeRequest(requestCode, accountId) VALUES(?,?)'
      db.query(statement, [emailAddress], (err, result)=>{
        console.log(result.length)
        if(result.length == 0){
          console.log('result field was empty, sending to front end')
          res.send(result)//send result to front end if password does not match any records
          return
        }
        let key= createNumerickey(10)
        console.log(`AccountId for result was ${result[0].accountId}`)


        let accountId = result[0].accountId
        db.query(statement2, [accountId, key, accountId], (err2, result2)=>{
          if(err2)
            console.log(err2)
            //console.log(err2)
          else
          {

            let mailSettings = {
              from: 'tenderfoot.studentservices@gmail.com',
              to: emailAddress,
              subject: 'Verification code',
              text: 'Please use the verification code below to continue with your password reset\r\n'+key
            }
            transporter.sendMail(mailSettings, (emailErr, inf)=>{
              if(emailErr)
                console.log(emailErr)
            })
            res.send({requestCode: key, accountId: accountId})
          }

        })

        //res.send(result)
      })
      break;

  }
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
        status: {privacyStatus: 'unlisted'}
      },
      part: 'snippet,status', 
      media: {
        body: fs.createReadStream(filename)
      }

    }, (err, data)=>{
      console.log("Done");
      console.log(data)

      //youtube replies with a bunch of useful metadata once the video has been uploaded
      const videoId = data.data.id;


      //links used to embed videos      
      const embedUrl = `https://www.youtube.com/embed/${data.data.id}`
      const thumbnail =`http://i3.ytimg.com/vi/${data.data.id}/hqdefault.jpg`
      const title = data.data.snippet.title
      ///const query = "insert into videos(videoLink, videoThumbnail, videoTitle) VALUES(?,?,?)";
      const query = 'UPDATE videos SET videoLink = ?, videoThumbnail = ? WHERE videoTitle = ?'

      console.log(`title: ${title}`)
      //we can then insert the uploaded data into our database
      db.query(query, [embedUrl,thumbnail, title], (error, result)=>{
        if(error)
          console.log(error)
        console.log(result)
      })

      console.log(data)
      //process.exit();
    })
  })
})


const generateAcivationKey = ()=>{
  const length = 20 //the length will nee to be updated in the database if this key is to be valid
  var key = crypto.randomBytes(20).toString('hex');

  return key
}
const decrypt = (message) => {

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
const { devNull } = require("os")
const { off } = require("process")

//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json()


const db = mysql.createPool({
  password: "password",
  user: "root",
  database: "TenderfootDB",
  host: "localhost",
  multipleStatements: true
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



//password reset options
app.get("/api/get/password/:userID", (req, res)=>{
  const statement = 'SELECT password FROM accounts WHERE accountId = ?'
  db.query(statement, req.params.userID, (err, result)=>{
    if(err)
      console.log(err)
    res.send(result)
  })
})


app.patch("/api/reset/password", jsonParser, (req, res)=>{
  const {accountId, password} = req.body
  const statement = 'UPDATE accounts SET password = ? WHERE accountId = ?'
  db.query(statement, [password, accountId], (err, result)=>{
    if(err)
      console.log(err)
    res.send(result)
  })
})



app.get('/get/accounts', (req, res)=>{
  db.query('SELECT * FROM Accounts', (error, result)=>{
    if(!error)
      res.send(result)
  })

})


//the front end sends a flag for the account and the corresponding database entry is updated
app.patch('/account/set/active', jsonParser, (req, res)=>{
  const {flag, accountId} = req.body
  //console.log(`${flag} ${accountId}`)
  db.query('UPDATE accounts SET active = ? WHERE accountId = ?', [flag, accountId], (err, result)=>{
    if(err)
    {
      console.log(err)
      console.log('statement 1 threw an error')
    }
    else{
      db.query('SELECT * FROM accounts', [], (err2, result2)=>{
        if(err2)
          console.log('err2 also occurred')
        res.send(result2)
      })
    }
  })
})


//activate accounts using two factor authentication
app.patch("/Account/Activate", jsonParser, (req, res)=>{
  const {activationKey} = req.body
  const statement = "UPDATE accounts INNER JOIN accountActivation ON accounts.accountId = accountActivation.accountId SET accounts.active = 1 WHERE (accountActivation.activationKey = ?)"
  db.query(statement, [activationKey], (err, result)=>{
    if(err)
      console.log(err)
    else{
      res.send(result)
    //We need to remove the account activation link so people cannot use it to re-activate their accounts if they get blocked
    db.query("DELETE FROM accountActivation WHERE activationKey = ?",[activationKey], (err2, result2)=>{
      if(err)
        console.log(err)
    })
    }
    
  })

})



app.get('/select/replies/flagged', (req,res)=>{
  db.query('select * from replies WHERE pendingModeration = 1', (err, result)=>
  {
    if(err)
      console.log(err)
    else
      res.send(result)
  }
  )}
)

//GET requests do not have bodies, we need to use queries instead
app.get("/api/selectcomments/:threadID", jsonParser, (req, res) => {
  const threadID = req.params.threadID;
  console.log('Searching for comment thread with the following ID:');
  console.log(threadID);
  const sqlQuery =
    "SELECT replies.pendingModeration AS replyModeration, comments.body, replies.replyID, dateAdded, replyAccount.username AS replyAccount, datePosted, accounts.username, comments.commentID, replies.body AS replyBody FROM comments INNER JOIN commentThread ON commentThread.commentID = comments.commentId left JOIN replies ON replies.commentID = comments.commentID INNER JOIN accounts ON accounts.accountId = comments.accountId left JOIN accounts AS replyAccount ON replyAccount.accountId = replies.userID WHERE threadID = ? AND comments.pendingModeration = 0 ORDER BY datePosted DESC";
  db.query(sqlQuery, [threadID], (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});
app.post("/api/addReply", jsonParser, (req, res) =>{
  console.log("addReply request received")

  //const pendingModeration = hasCourseLanguage(req.vody.bodt)
  const query = "INSERT INTO replies(body, commentID, userID, pendingModeration) VALUES(?,?,?, ?)";

  //dateAdded refers to the date of the reply
  const query2 = "SELECT replies.pendingModeration AS replyModeration, replyID, dateAdded, body, username AS replyAccount, commentID FROM replies LEFT JOIN accounts ON accounts.accountId = replies.userID WHERE pendingModeration = 0 ORDER BY dateAdded DESC"
  const body = req.body.body;
  const id = req.body.id;
  const accountId = req.body.accountId;

  console.log(body);
  console.log(id);
  const pendingModeration = hasCourseLanguage(body)
  db.query(query, [body, id, accountId, pendingModeration], (err,result)=>{
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

  const query = 'SELECT * FROM accounts WHERE username =  ? AND active = 1'
  db.query(query, [req.params.username], (error, result)=>{
    if(error)
      console.log(error)
    res.send(result)
  })

})


app.get("/api/selectUnmoderated", (req, res) => {
  const sqlQuery = "SELECT comments.commentID, body, username FROM comments INNER JOIN accounts ON accounts.accountId = comments.accountId WHERE pendingModeration = 1";
  db.query(sqlQuery, [], (error, result) => {
    if(error)
      console.log(err)
    else
      res.send(result);
  });
});


//add flag reply as well



app.patch('/flag/reply', jsonParser, (req,res)=>{
  const {replyID, flag, adminMode} = req.body;
  console.log(`${replyID}, ${flag}`)
  db.query('UPDATE replies SET pendingModeration = ? WHERE replyID = ?', [flag, replyID], (err, result)=>{
    if(err)
      console.log(err)
    else
    {



      const query = adminMode ? 'SELECT * FROM replies WHERE pendingModeration = 1' : "SELECT replyID, dateAdded, body, username AS replyAccount, commentID FROM replies LEFT JOIN accounts ON accounts.accountId = replies.userID WHERE pendingModeration = 0 ORDER BY dateAdded DESC"
      db.query(query, (err2, result2)=>{
        res.send(result2)
      })
    }
  })
})

app.patch("/flag/comment", jsonParser, (req, res) => {
  console.log("request received");
  //console.log(req.body.body);
  const {commentId, flag, threadID} = req.body
  console.log(`${flag} ${commentId}`)
  const query = "UPDATE comments SET pendingModeration = ? WHERE commentId = ?";
  const commentID = req.body.commentId;
  //console.log("request received");
  db.query(query, [flag,commentId], (error, result) => {
    if (error) console.log(error);
      //console.log("query complete");
    else
    {
      db.query(commentSelectQuery, [threadID], (err2, result2)=>{
        res.send(result2)
      })
    }
  });
});


app.get("/api/get/videos", jsonParser, (req, res) => {
  const statement = "SELECT videos.videoID, videoDescription, thread.threadID, videoLink, videoThumbnail, videoTitle FROM videos INNER JOIN videoThread ON videoThread.videoID = videos.videoID LEFT JOIN thread ON thread.threadID = videoThread.threadID";
  db.query(statement, [], (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});



app.patch('/update/video', jsonParser, (req, res)=>{
  const {videoThumbnail, videoLink, videoTitle, videoDescription, videoId} = req.body
  var params;
  var query;

  if(videoLink)
  {
    query = 'UPDATE videos SET videoThumbnail = ?, videoLink = ?, videoTitle = ?, videoDescription = ? WHERE videoId = ?'

    params = [videoThumbnail, videoLink, videoTitle, videoDescription, videoId]
  }
  else {
    query = 'UPDATE videos SET videoDescription = ?, videoTitle = ? WHERE videoId = ?'
    console.log(`VideoID: ${videoId}`)
    params = [videoDescription, videoTitle, videoId]
  }
  db.query(query, params,(err, result)=>{
    if(err)
      console.log(err)
    res.send(result)
  }
  )
})
//doesn't update title? 
app.post("/api/updateTestimonial", jsonParser, (req, res)=>{




  const{body, textBodyId, description, title, previewImage} = req.body
  console.log(`previewImage; ${previewImage}`)
    console.log(`description: ${description} title; ${title}`)

  console.log("endpoint reached")
  console.log(body)

  //const {textBodyId, body} = req.body;
  const statement = "UPDATE textBody SET body = ?, summary = ?, title = ?, previewImage = ?  WHERE textBodyId = ?"

  db.query(statement, [body, description, title, previewImage, textBodyId], (error, result)=>{
    if(error)
      console.log(error)
    else
      res.send(result)
  })

})

app.get("/api/get/video/:videoId", (req, res)=>{


  //const videoId = req.params.videoId
  const query = "SELECT * FROM videos WHERE videoID = ?"

  const videoId = req.params.videoId;
  console.log(`video ID: ${videoId}`)
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
app.get("/api/get/textBody/:title", jsonParser, (req, res)=>{

  //const statement = "SELECT title,textBody.textBodyId ,body, videoLink, videoThumbnail FROM textBody LEFT JOIN textBodyVideo ON textBody.textBodyId = textBodyVideo.textBodyId LEFT JOIN videos ON textBodyVideo.videoId =  videos.videoId WHERE textBody.title = ?"
  const statement = "SELECT threadID, textBody.textBodyId, body, title, summary, previewImage FROM textBody INNER JOIN textBodyThread ON textBodyThread.textBodyId = textBody.textBodyId WHERE title=?"


  //const statement = "SELECT * FROM textBody WHERE textBodyId = ?"
  db.query(statement, [req.params.title],(error, result)=>{

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
  const {title, description, previewImage, category, body} = req.body;
  console.log(`${previewImage}`)
  const statement = "INSERT INTO textBody(title, body, summary, category, previewImage) VALUES(?,?, ? ,'article', ?)";
  db.query(statement,[title,body,description, previewImage ], (err, result)=>{
    if(err){
      res.send(err)
      console.log(err)
    }
    else
      {db.query('INSERT INTO thread(threadID) VALUES(null)',(err2, result2)=>{
        if(!err2)
        {
          db.query('INSERT INTO textBodyThread(threadID, textBodyId) VALUES(?,?)', [result2.insertId, result.insertId], (err3, result3)=>{
            if(err3)
              console.log(err3)
          })
        }
      })
      res.send(result)
    }
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


  if(hasCourseLanguage(body))
  {
    pendingModeration = 1
  }
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
                  res.send({updatedComments: [...thirdRes], pendingModeration: pendingModeration})
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
  const statement = 'SELECT textBody.textBodyId, date, title, summary, previewImage, videoLink FROM textBody INNER JOIN textBodyVideo ON textBodyVideo.textBodyId = textBody.textBodyId INNER JOIN videos ON videos.videoId = textBodyVideo.videoId'
;
  db.query(statement,[], (error, result)=>{
    if(!error)
      res.send(result)
    else
      console.log(error)
  })

});


app.get("/api/get/testimonial/:testimonialTitle", (req, res)=>{

    const testimonialTitle = req.params.testimonialTitle
    
    const statement = "SELECT videoLink, videos.videoId, previewImage, summary, textBody.textBodyId, videoDescription, videoTitle, title,body FROM videos INNER JOIN textBodyVideo ON textBodyVideo.videoId = videos.videoId INNER JOIN textBody ON textBody.textBodyId = textBodyVideo.textBodyId WHERE title=?"
    db.query(statement, [testimonialTitle], (err, result)=>{
      if(err)
        console.log(err)
      res.send(result)
    })






    //db.query()
})



//probably merge these two at some poi


app.get("/api/get/articles", (req, res)=>{
  const statement = "select textBodyId,title,date, previewImage, summary from textBody WHERE category='article'";
  db.query(statement,[], (error, result)=>{
    if(!error)
      res.send(result)
    else
      console.log(error)
  })

});



//gets the full list of images uploaded to the server
app.get('/get/images', (req, res)=>{

  //stub
  return;
})

app.post('/upload/media', upload.single('imageFile'), (req,res)=>{
  const filename = req.file.name;

  //idk why I didn't name it 'mediaFiles'
  db.query('INSERT INTO mediaFile(fileDirectory) VALUES(?)', [filename], (err, result)=>{
    if(err)
    {
      console.log(err)
      return;
    }
    else {
      db.query('SELECT * FROM mediaFile ORDER BY dateAdded DESC', [], (err2, result2)=>{
          res.send(result2)
      })
    }
  })


})




app.patch('/articles/delete', (req, res)=>{
  db.query('DELETE FROM textBody WHERE textBodyId = ?', [])



});

//used to display files on the web page 
app.get('/images/:fileName',(req,res)=>{



  
  const fileName = req.params.fileName
  var stream = fs.createReadStream(`images/${fileName}`)
  stream.on('error', ()=>{console.log('an error occurred');return})
  stream.on('open', ()=>{
    stream.pipe(res)



  })
})


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
