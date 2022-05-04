import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import React from 'react'


function TodoItem(props) {
    const {handleItemChange, checked,deadline, description, title, itemId} = props
    const D = new Date();
    //console.log(`D : ${D.getDate()}/${D.getMonth()}/${D.getFullYear()}`)
    const overDue = D > deadline && checked == 0;
    
  return (

    <tr>
        <td>{title}</td>
        <td>{description == null ? 'No description' : description}</td>
        <td style={{color: (overDue ? 'red': 'black')}}>{`${deadline.getDate()}/${deadline.getMonth()+1}/${deadline.getFullYear()}`}{overDue ? ' (OVERDUE)':''}</td>
        {console.log(deadline.getMonth())}
        <td>{checked ? <CheckCircleIcon style={{cursor: 'pointer', color: 'green'}} onClick={()=>{handleItemChange(itemId, !checked)}}/> : <CheckCircleOutlineIcon style={{cursor: 'pointer'}} onClick={()=>{handleItemChange(itemId, !checked)}}/>}</td>
    </tr>
    //previous format for submitted items
    // <div className='todo-item' style={checked ? {backgroundColor: 'green', color: 'white'}: {backgroundColor: 'white'}}>
    //    {console.log(`item was set to ${description}`)}
    //     <div className='check-wrapper'>
    //         {checked ? <CheckCircleIcon onClick={()=>{handleItemChange(itemId, !checked)}}/> : <CheckCircleOutlineIcon onClick={()=>{handleItemChange(itemId, !checked)}}/>}<div className='todo-title'>{title}</div>
    //         </div>
    //     <div className='todo-description' style={{color:(checked ? "white" : 'darkgray')}}>{description}</div>
                
    // </div>
  )
}

export default TodoItem