import React from 'react'
import {Form, Button} from 'react-bootstrap';
import Navbar from './reactcomponents/Mainnav';
import Thread from './reactcomponents/Thread';
import {useParams} from 'react-router-dom';
import Mainnav from './reactcomponents/Mainnav';
function ForumPost() {


    let {value} = useParams();
    console.log(value);
  return (<>
    <Mainnav/>
    <div className='forumPost'>
    <h1>Topic</h1>
    <p>Author: blabla   <i>posted 11/1/21</i></p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat mollitia consequatur debitis sequi rem nam maxime perspiciatis illo pariatur iure inventore at ducimus omnis, eaque eveniet architecto aperiam cupiditate tenetur?</p>
    </div>

    <Thread threadID={3}/>

  </>
  )
}

export default ForumPost