


//returns appropriate scale settings for a thumbail image
const scaleThumbnail = (fileDirectory, size)=>{
          let img = new Image()
          img.src = `http://localhost:3001/images/${fileDirectory}`



          const {height, width} = img

          console.log(`height: ${height} width: ${width}`)
          const largestSize = height > width ? 'height' : 'width'

          const dimensions = [height,width]//X, Y
          const aspectRatio = height / width;




          const smallestIndex = 0;
          const largestIndex = 0;

          var scaleFactor;
          var customHeight;
          var customWidth;


          if(height > width)
          {
            console.log('height greater than width')
            scaleFactor = height/width
            customWidth = size
            customHeight = customWidth * scaleFactor
          }
          else if(width > height)
          {
            console.log('widht greater than height')
            scaleFactor = width / height
            customHeight = size
            customWidth = customHeight * scaleFactor

          }
          else if(width == height){
            console.log('width == height')
            customHeight = size
            customWidth = size
          }
          return `${customWidth}px ${customHeight}px`


}



export {scaleThumbnail}