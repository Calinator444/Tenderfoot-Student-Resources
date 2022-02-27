import React from 'react';
import Navbar from "./reactcomponents/Mainnav";

function maptest() {
  return (


    <>
    <Navbar />
    <div style={{"background-color": "#FFFFFF", "margin-left": "auto", "margin-right": "auto", "width" : "80vw", "text-align": "center",
    "height": "100vh"}}>
        

        <h1>Your first day on campus</h1>
        <article>


            <p>On your first day on campus you'd do well to familiarize yourself with the layout of the campus before the first lecture.


                If you're having trouble locating a classroom the university, head over to <a href="https://use.mazemap.com/#v=1&config=UoNCampus&zlevel=2&center=151.706167,-32.891064&zoom=18&campusid=117">Maze Map</a> using your phone.
            </p>
        </article>

        {/* What the dog doin? */}
        <iframe width="600" height="420" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://use.mazemap.com/embed.html#v=1&config=UoNCampus&zlevel=2&center=151.706167,-32.891064&zoom=18&campusid=117&utm_medium=iframe" style={{"border": "1px solid grey"}} allow="geolocation"></iframe><br/><small><a href="https://www.mazemap.com/">Map by MazeMap</a></small>
        
    </div>
    </>
  )
}

export default maptest