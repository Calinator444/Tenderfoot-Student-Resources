import React from 'react'

function NotFound() {
  return (


    //"overflow: auto" prop fixes the margin issue for child elements
    <div id='main-content' className='white-mainclass'>


    {/* // WHYYYYYY */}
    <h1 style={{color: 'black', margin: "50px"}}>Sorry :(</h1>
        <section>
        
        <p style={{margin: "50px"}}>We couldn't find the page you're looking for</p>
        </section>
    </div>
  )
}

export default NotFound