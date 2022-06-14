import {useEffect, useState} from 'react';
import {Table, Row, Button, Pagination, Tabs, Tab, Col, Form} from 'react-bootstrap';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
//import {Tabs, Tab} from ""
import Axios from 'axios'


import { useNavigate } from 'react-router';
//import { response } from 'express'

//Visual studio code imported "response" for absolutely no reason    
function Home()
{


    const navigate = useNavigate()
    const [pageNumbering, setPageNumbering] = useState([])
    const [state, setState] = useState({
        activeArticleIndex: 0
        ,activeTestimonialIndex: 0
    })




    const [videoData, setVideoData] = useState([])
    const flagAccount = (active, accountId)=>{



        Axios.patch('http://localhost:3001/account/set/active', {flag: !active, accountId: accountId}).then((res)=>{
            setAccounts(res.data)
        })
    }
    const [testimonialList, setTestimonialList] = useState([])
    //const [testimonialList, setTestimonialList] = useState([])
    const [articleList, setArticleList] = useState([])
    const [accounts, setAccounts] = useState([])

    // const [activeTab, setActiveTab] = useState('commentModeration')
    const [pendingComments, setComments]= useState([]);


    const [flaggedReplies, setFlaggedReplies] = useState([])



    
    //will cause a 404 error because mapping has not been placed inside database script
    const approveComment = (id)=>{
        console.log("attempting to approve comment");

        const params = {body: 2};
        Axios.patch('http://localhost:3001/flag/comment',{commentId: id, flag: 0}).then(()=>{
            getFlaggedComments();

        })

    }


    //used to get comments flagged by the database as having inappropriate language
    const getFlaggedComments = ()=>{
    Axios.get('http://localhost:3001/api/selectUnmoderated').then((res)=>
    {
        setComments(res.data);
        console.log('unmoderated comments')
        console.log(res.data)
        //console.log("updating comment list....")
    });
    }

    const flagReply = (replyID)=>{
        Axios.patch('http://localhost:3001/flag/reply', {replyID: replyID, flag: 0, adminMode: 'adminMode'}).then((res)=>{
            if(res)
                setFlaggedReplies(res.data)
        })
    }

    useEffect(()=>{
    //const select = "SELECT * FROM comments WHERE pendingModeration = 1";



    //why is this a separate function?
    getFlaggedComments();
    Axios.get('http://localhost:3001/api/get/articles').then((res)=>{
        //might need to include index of returned data

        console.log(res.data)

        setArticleList(res.data)
        let tempArray = [];

        let callBack = (i)=>{

            return (function(i){
            setState({...state, activeArticleIndex: i})
            })
        }
        let itemIndex = 0;
        for(let i = 0; i < res.data.length; i += 3)
        {   
            //console.log(`active index was set to: ${state.activeIndex}`)
            console.log(`item index: ${itemIndex}`)




            
            //we need to store the index as a local variable, otherwise changes made to it outside the scope of this function will effect it
            let index = itemIndex
            tempArray.push(
                //uses most recent 'itemIndex value?'
                <Pagination.Item active={itemIndex == state.activeArticleIndex} onClick={()=>{setState({...state, activeArticleIndex: index})}}/*key={itemIndex}*/ /*onClick={()=>{callBack(itemIndex)}}*/>
                    {itemIndex + 1}
                </Pagination.Item>
            )
            itemIndex++;
        }

        Axios.get('http://localhost:3001/select/replies/flagged').then((res)=>{
            if(res)
                setFlaggedReplies(res.data)
            else{
                console.log('error retrieving replies')
            }
        })
        setPageNumbering(tempArray)

    })

    Axios.get('http://localhost:3001/api/get/testimonials').then((res)=>{



        console.log(res.data)
        setTestimonialList(res.data)
        console.log('getting student tesimonials')
    
    
        console.log(res.data)
    })


    Axios.get('http://localhost:3001/get/accounts').then((res)=>{
        setAccounts(res.data)
    })



    Axios.get('http://localhost:3001/api/get/videos').then((res)=>{

        console.log('video data response')
        console.log(res.data)
        setVideoData(res.data)
    })
}, [state])

return (

<div id="main-content" className='white-mainclass' style={{height: '100vh', overflowX: 'scroll'}}>
<h1>Admin Portal</h1>

{/* Will format this later */}
<Row>
<Col>

    <h3>Testimonials</h3>
    <Table striped bordered>
        <thead>
            <tr>
                <th>Testimonial title</th>
                <th>Summary</th>
                <th>Video link</th>
                <th>Link</th>
            </tr>
        </thead>



        <tbody>
            {testimonialList.map((val)=>{
                const {title, summary, videoLink} = val

                /*maybe add pagination here when it becomes necessary*/
                return(
                    <tr>
                        <td>{title}</td>
                        <td style={{minWidth: '200px'}}>{summary}</td>
                        <td>{videoLink}</td>
                        <td><span className='override-href' onClick={()=>{navigate(`/Testimonials/${title}`)}}>edit</span></td>

                    </tr>
                )
            })}

        </tbody>



        
        {/* map function */}
    </Table>
    <Button onClick={()=>{navigate('/Admin/TestimonialBuilder')}}>+ Create new testimonial</Button>
</Col>


<Col>




    
    <h3>Articles</h3>
    <Table striped bordered>
        <thead>


            <tr>
                <th>Title</th>
                <th>Summary</th>
                <th>Link</th>
            </tr>
        </thead>

        <tbody>

            {/*  */}
            {
            
            
            articleList.slice(state.activeArticleIndex * 3,(state.activeArticleIndex + 1) * 3).map((val)=>{



                const {title, summary} = val
                return(
                    <tr>
                        <td>{title}</td>
                        <td style={{minWidth: '200px'}}>{summary}</td>
                        <td onClick={()=>{navigate(`/ArticleView/${title}`)}}><span className='override-href'>edit</span></td>
                        {/* <td className='override-href' onClick={()=>{navigate(`/Testimonials/${title}`)}}>edit</td> */}
                        
                    </tr>

                   
                )


            })}
        </tbody>


        {/* map function */}
    </Table>
    <Pagination>
        {pageNumbering}
    </Pagination>

    <Button onClick={()=>{navigate('/Admin/ArticleBuilder')}}>+ Create new article</Button>
</Col>
</Row>





<Row>


    <h2>Videos</h2>
    <Table striped bordered>

        <thead>
            <tr>
                <th>Title</th>
                <th>Summary</th>
                <th>Link</th>
                <th>Action</th>
            </tr>
        </thead>


        <tbody>

            {videoData.map((val)=>{
                const {videoTitle, videoDescription, videoLink, videoID} = val
                return(
                    <tr>
                        <td>{videoTitle}</td>
                        <td>{videoDescription}</td>
                        <td>{videoLink}</td>
                        <td><span className='override-href' onClick={()=>{navigate(`/Admin/Edit/Video/${videoID}`)}}>Edit</span></td>
                    </tr>
                )
            })}
        </tbody>


        {videoData.length == 0 ?
        <p>No videos where found</p> : <></>
    }
    </Table>
</Row>





<Tabs default="commentModeration">
<Tab eventKey="commentModeration" title="Comment Moderation">
{/* <h2>Flagged Comments</h2> */}


<p>These comments have been flagged because they go against our community standards. If any comments have been placed here
    by mistake please approve them.
</p>

<Table striped bordered>
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

        const {body, commentID} = val;
        return(
            <tr>
                <td>{body}</td>
                <td><Button variant="primary" onClick={()=>{approveComment(commentID)}}>approve</Button></td>
            </tr>)
    })
}

</tbody>





</Table>



{(pendingComments.length > 0)
        ? <p></p>
        : <p>there are no comments to display</p>
}
</Tab>



<Tab eventKey="accountModeration" title="Account moderation">
    <p>This page can be used to flag accounts which have shown any suspicious activity</p>
    <Table striped bordered>
        <thead>
            <tr>
                <th>Username</th>
                <th>Email address</th>
                <th>Active</th>
            </tr>
        </thead>

        <tbody>

            {
            
            accounts.map((val)=>{
            const {active, username, emailAddress, accountId} = val;
            
            return(

                <>
                <tr>
                    <td>{username}</td>
                    <td>{emailAddress ? emailAddress : 'no email address'}</td>
                    <td>{active ? <CheckCircleIcon style={{color: 'green'}} onClick={()=>{flagAccount(active, accountId)}}/> : <CheckCircleOutlineIcon onClick={()=>{flagAccount(active, accountId)}}/>}</td>
                </tr>
                </>
                
            )}
            )
            }
            {/* map array here */}
        </tbody>

    </Table>
    
</Tab>
<Tab eventKey='replyModeration' title='Flagged replies'>
    <Table striped bordered>
        <thead>
            <tr>
                <th>
                    Body
                </th>
                <th>Action</th>
            </tr>
        </thead>

        

        
        <tbody>
            {flaggedReplies.map((val)=>{
                
                return(
                <tr>
                    <td>{val.body}</td>
                    <td><Button variant='primary' onClick={()=>{flagReply(val.replyID)}}>Approve</Button></td>{/*add a callback here later*/}
                </tr>)
            })}          
        </tbody>
        
        
        {flaggedReplies.length > 0 ? <p></p>:
        <p>There are no replies to display</p>}

        
    </Table>
</Tab>
</Tabs>
</div>
)

}

export default Home;