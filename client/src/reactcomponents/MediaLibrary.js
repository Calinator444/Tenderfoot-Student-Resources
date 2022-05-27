
import React, {useEffect, useRef, useState} from 'react'
import {Button, Form, Row, Col} from 'react-bootstrap'
import Axios from 'axios'
import { ContactSupportOutlined, LocalConvenienceStoreOutlined } from '@mui/icons-material'

function MediaLibrary() {

    const [file, setFile] = useState('')
    
    

    const mouseLeaveEvent = (e)=>{
      e.target.firstChild.innerHTML= 'Click to copy link'
    }

    const handleClick = (fileDirectory, e)=>{
      //const {e, }

      navigator.clipboard.writeText(`http://localhost:3001/images/${fileDirectory}`)
      console.log(e.target.firstChild.innerHTML)
      
      e.target.firstChild.innerHTML = 'Link copied!'
    }
    
    const fileUpload = ()=>{



      if(!file == '')
      {
      const formData = new FormData()
      formData.enctype="multipart/form-data"
      formData.append('imageFile', file)
      Axios.post('http://localhost:3001/api/upload/image', formData).then((res)=>{
        setImageList(res.data)


      }) //try attaching the file this time you dultz


      setFile('')
      }
    }
    const [imageList, setImageList] = useState([])
    //can be used to dynamically update the size of each tile
    const tileSize = 200
    useEffect(()=>{
        console.log('useEffect fired in media library')
        Axios.get('http://localhost:3001/get/media').then((res)=>{
            setImageList(res.data)
            console.log('image list:')
            console.log(res.data)
        })
    }, [])





  const returnProperDimensions = (fileDirectory)=>{
    //const {fileDirectory} = val



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
            customWidth = tileSize
            customHeight = customWidth * scaleFactor
          }
          else if(width > height)
          {
            console.log('widht greater than height')
            scaleFactor = width / height
            customHeight = tileSize
            customWidth = customHeight * scaleFactor

          }
          else if(width == height){
            console.log('width == height')
            customHeight = tileSize
            customWidth = tileSize
          }
          return `${customWidth}px ${customHeight}px`

  }
  return (
    <div style={{marginTop: '50px'}}>


        {/* set the file to the background image */}




            <Form.Label>Media Library</Form.Label>



            <Form.Group>
            <Row className='justify-content-md-center'>

              <Col xs={4}>
                <Form.Control type='file' onChange={(e)=>{setFile(e.target.files[0])}} accept='.jpg,.png'></Form.Control>
              </Col>
              <Col xs={4}>
                <Button onClick={()=>{fileUpload()}}>Upload File</Button>
              </Col>
            </Row>
            </Form.Group>


            <div className='media-container'>
        {imageList.map((val)=>{
           const {fileDirectory} = val




          return(
          
          <>
          <div style={{backgroundImage: `url(http://localhost:3001/images/${fileDirectory})`, backgroundSize: returnProperDimensions(fileDirectory), backgroundPositionY: "50%", backgroundPositionX: '50%', width: '200px', height: `${tileSize}px`}}>
            <div className='link-container' onMouseLeave={(e)=>{mouseLeaveEvent(e)}} onClick={(e)=>{handleClick(fileDirectory, e) }}><span onClick={(e)=>{e.target.innerHTML = 'Link copied!'}}>Click to copy link</span></div>
          </div>
          </>
          
          )


        })}
      </div>


    </div>
  )
}

export default MediaLibrary