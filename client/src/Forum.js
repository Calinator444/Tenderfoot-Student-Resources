import React from 'react'
import Navbar from './reactcomponents/Mainnav';
import {Table} from 'react-bootstrap';
function Forum() {
  return (
    <div style={{"background-color":"white", "margin-left" : "10vw", "margin-right": "10vw"}}>

      
      <h1>Forums</h1>
        <Table striped bordered hover variant="light">
  <thead>
    <tr>
      <th>topic</th>
      <th>Date Posted</th>
      <th>Replies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Life sucks</td>
      <td>11/11/11</td>
      <td>3</td>
    </tr>
  </tbody>
</Table>



    </div>
  )
}

export default Forum