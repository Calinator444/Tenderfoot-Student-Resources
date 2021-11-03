import {useEffect, useState} from 'react';
import {Table, Button} from 'react-bootstrap';
import Axios from 'axios'
//import { response } from 'express'

//Visual studio code imported "response" for absolutely no reason

    
function Home()
{


    const [pendingComments, setComments]= useState([]);
    //will cause a 404 error because mapping has not been placed inside database script
    const approveComment = (id)=>{
        console.log("attempting to approve comment");

        const params = {body: 2};
        Axios.post('http://localhost:3001/api/approveComment',{ body: JSON.stringify(id) })

        getFlaggedComments();
    }


    //used to get comments flagged by the database as having inappropriate language
    const getFlaggedComments = ()=>{
    Axios.get('http://localhost:3001/api/selectModerated').then((res)=>
    {
        setComments(res.data);
        console.log("updating comment list....")
    });
    }



    useEffect(()=>{
    //const select = "SELECT * FROM comments WHERE pendingModeration = 1";
    getFlaggedComments();
}, [])

return (

<div>
<h1>Flagged Comments</h1>


<p>These comments have been flagged because they go against our community standards. If any comments have been placed here
    by mistake please approve them.
</p>

<Table>
<thead>
    <tr>
        <th>
            comment body
        </th>
    </tr>
</thead>
<tbody>
{
    pendingComments.map( (val)=>
    {
        return(
            <tr>
                <td>{val.innerContent}</td>
                <td><Button variant="primary" onClick={()=>{approveComment(val.id)}}>approve</Button></td>
            </tr>)
    })
}

</tbody>





</Table>

{/* brace is only there to allow for comments

<Table>
    <thead>
        <tr>
        <th>Header</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Content</td>
        <td><Button/></td></tr>
    </tbody>
</Table>
*/}


{(pendingComments.length > 0)
        ? <p></p>
        : <p>there are no comments to display</p>
}

</div>
)

}

export default Home;