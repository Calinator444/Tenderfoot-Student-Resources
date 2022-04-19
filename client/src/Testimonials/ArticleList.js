import React, {useEffect, useState} from 'react'
import ListGeneric from './ListGeneric'
import Axios from "axios"

import Mainnav from '../reactcomponents/Mainnav'

function ArticleList() {
    const [data, setData] = useState([])
    useEffect(()=>{
    Axios.get("http://localhost:3001/api/get/articles").then((res)=>{
        setData(res.data)
})
},[])


    

  return(
   <>
        <Mainnav/>
        <div className='white-mainclass' id="main-content">


            <ListGeneric dataset={data}/>

        </div>
    </>
  )
}

export default ArticleList