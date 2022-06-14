import React from 'react'

function sliceComments(fullArray) {
      console.log('array inside slicedComments')
      console.log(fullArray)
      let tempReplies = [];
      let tempComments = [];
      for(let i = 0 ; i < fullArray.length; i++)
      {
        //splits the response from the server into 2 seperate arrays (replies and comments)

        //could this array be causing the map?
        console.log(`${fullArray[i].datePosted.split('T')[0]} ${fullArray[i].body}`)
        console.log(`username is: ${fullArray[i].username}`)
        tempComments.push({body: fullArray[i].body, username: fullArray[i].username, commentID: fullArray[i].commentID, timePosted: new Date(fullArray[i].datePosted)})


        if(fullArray[i].replyModeration == 0){
          tempReplies.push({replyBody: fullArray[i].replyBody, dateAdded: fullArray[i].dateAdded, replyAccount: fullArray[i].replyAccount, commentID: fullArray[i].commentID})
          console.log('removed:')
          console.log(fullArray[i])
        }
        else
        {
          console.log('removed from thread')
          console.log(fullArray[i])
        }
      }

      let filteredArray = [...new Map(tempComments.map(x => [x['commentID'], x])).values()]


      return {replies: tempReplies, comments: filteredArray}



    }


export {sliceComments}