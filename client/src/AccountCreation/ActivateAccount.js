import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router'
import Axios from 'axios'

function ActivateAccount() {
    const {activationKey} = useParams();

    const [message, setMessage] = useState({message: '',
    title: ''

    })
    useEffect(()=>{
        Axios.patch("http://localhost:3001/Account/Activate", {activationKey: activationKey}).then((res)=>{

            console.log(res.data.affectedRows)
            switch(res.data.affectedRows)
            {
                case 1:
                setMessage({title: 'Your Account has been successfully updated!',
                message: 'feel free to log in at the link at the top of the screen'
                
                })
                break;
                default:
                setMessage({
                    title: 'Error',
                    message: 'This link has expired'
                })
                break;
            }
        })
    },[])
  return (
    <div id="main-content" className='white-mainclass' style={{overflowY: 'scroll', height: '100vh'}}>

        <h2>
            {message.title}
        </h2>
        <p>{message.message}</p>
    </div>
  )
}

export default ActivateAccount