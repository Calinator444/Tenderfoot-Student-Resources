import React from 'react'

function getVideoId(videoLink) {



    console.log(`videoLink was set to: ${videoLink}`)
    
    var videoId = null
    if(videoLink.match('https://youtu.be/') != null)
      {
        console.log('match 1 occurred')
        videoId = videoLink.split('https://youtu.be/')[1]
      }

      //adding anything after he '?' causes the search to fail regardless for some reason 
      if(videoLink.match('https://www.youtube.com/watch?') != null)
      {
        console.log('match 2 occurred')
        videoId = videoLink.split('/watch?v=')[1]
        if(videoId.match('&list') != null)//when the URL the user copied was part of a playlist
          videoId = videoId.split('&list')[0]
        if(videoId.match('&ab_channel') !=null)
          videoId = videoId.split('&ab_channel')[0]
        if(videoId.match('&t='))
          videoId = videoId.split('&t=')[0]

      }
    return (videoId)
}

export {getVideoId}