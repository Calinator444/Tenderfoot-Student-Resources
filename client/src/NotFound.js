import React from 'react'

function NotFound() {
  return (


    //"overflow: auto" prop fixes the margin issue for child elements
    <div id='main-content' style={{backgroundColor: 'white', color: 'black', overflow: "auto"}}>


    {/* // WHYYYYYY */}
        <section>
        <h1 style={{color: 'black', margin: "50px"}}>Sorry :(</h1>
        <p style={{margin: "50px"}}>We couldn't find the page you're looking for</p>
        </section>
    </div>
  )
}

export default NotFound