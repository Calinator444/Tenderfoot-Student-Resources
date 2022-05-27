import React from 'react'



export function formatDate(time) {
    
  const getHours = time.getHours()
  const date = {
    day: time.getDate(),
    month: time.getMonth() + 1,//"getMonth" is offset by 1 in javascript for absolutely no reason
    year: time.getFullYear(),
  }
  const {day, month, year} = date;
    //, minutes, hour, meridian} 
    
  return `${day}/${month}/${year}`

}




export function formatTime(date)
{



  let getHours = date.getHours()
  if(getHours == 0)
    getHours += 12
  //const mins = date.getMinutes()
  const time = {
    minutes: date.getMinutes(),
    hour: (getHours > 12 ? getHours - 12 : getHours),
    meridian: (getHours > 12 ? 'pm' : 'am')//ternary operator confuses javascript into thinking I'm trying to parse a value pair
  }
  const {minutes, hour, meridian} = time
  
  return `${hour}:${minutes < 10 ? '0': ''}${minutes}${meridian}`;

  //stub
}






//returns the difference between 'date' and today's date as an integer (difference of '1' would imply the date was yesterday)
export function compareDates(date) {
    const currentDate = new Date();
    const dateArgument = new Date(`${date.getMonth() +1 }/${date.getDate()}/${date.getFullYear()}`)//we need to apply an offset here because the date from the database is incorrect by 1 month
    const currentDateFormatted = new Date(`${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`)
    //console.log(dateArgument);
    //console.log(currentDateFormatted)
    const difference = Math.abs(currentDateFormatted - dateArgument);
    //console.log(`data for comment: ${body}`)
    //console.log(`Difference in millisecons${difference}`)
    const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24)); 
    //console.log(`Difference in days${daysDifference}`)
    

    return daysDifference;

}



//export {compareDates, formatDate}
//export default dateArithmethic
