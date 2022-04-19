import React, {useState} from 'react';
import Navbar from "./reactcomponents/Mainnav";
import TextEditor from './TextEditor';





function Map() {
  const [adminMode,setAdminMode] = useState(true)


  

  
  return (


    <>



    {/* Old styling options style={{"background-color": "#FFFFFF", "margin-left": "auto", "margin-right": "auto", "width" : "80vw", "text-align": "center",
    "height": "100vh"}}*/}

    <div id="main-content" className='white-mainclass'>
        

        <h1>Map</h1>


        {/* ThreadID was set manually here because existing pages created by the product owner are created manually, unlike testimonials */}
        <TextEditor threadID={4} readOnly={!adminMode} showControls={adminMode}/>
        {/* <article>

          <h2>Your first day on campus</h2>
            <p>On your first day on campus you'd do well to familiarize yourself with the layout of the campus before the first lecture.


                If you're having trouble locating a classroom the university, head over to <a href="https://use.mazemap.com/#v=1&config=UoNCampus&zlevel=2&center=151.706167,-32.891064&zoom=18&campusid=117">Maze Map</a> using your phone.
            </p>
        </article> */}

{/* 

        <section className='admin-controls'></section> */}
        <iframe width="600" height="420" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://use.mazemap.com/embed.html#v=1&config=UoNCampus&zlevel=2&center=151.706167,-32.891064&zoom=18&campusid=117&utm_medium=iframe" style={{"border": "1px solid grey"}} allow="geolocation"></iframe><br/><small><a href="https://www.mazemap.com/">Map by MazeMap</a></small>
        
    </div>
    </>
  )
}

export default Map