import React, {useEffect, useState} from 'react'
import TodoItem from './TodoItem';
import {Form, Button, Table} from 'react-bootstrap';
//import Form from 'react-bootstrap/Form'
import Axios from "axios";
import {useSelector} from "react-redux"
//import {CheckCircleIcon,CheckCircleOutlineIcon } from "@mui/icons-material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { render } from 'react-dom';

function TodoList() {
    const store = useSelector(store => store)
    const [todoList, setTodoList] = useState([])



    //set to 'true' when the user is in the process of adding a new item
    const [addMode, setAddMode] = useState(false)
    const [semst1, setSemst1] = useState([])
    const [semst2, setSemst2] = useState([])
    const [studyInterval, setStudyInterval] = useState('Semester')

    const [formState, setFormState] = useState({
        title: "",
        description: "",
        date: ""
    })
    const [selectedPeriod, setSelectedPeriod] = useState('Semester 1')

    const submitItem = ()=>{


        const {title, description, date} = formState;
        var postDescription = description == "" ? null : description
        //if (description == "")
        //    description = null;
        Axios.post("http://localhost:3001/api/post/todo", {title: title, description: postDescription, date: date, accountId : store.userId}).then((res)=>{
            setTodoList(formatTodoList(res.data))
            //formatTodoList
        })

        setAddMode(false)
    }
    const handleChange = (e)=>{
        console.log(e.target.name) 
        setFormState({...formState, [e.target.name]: e.target.value})
        console.log(formState)
    }

    const handleItemChange = (itemId, checked)=>
    {
        console.log("item change was fired")
        Axios.patch("http://localhost:3001/api/alterTodo", {itemId: itemId, accountId: store.userId, checked: checked }).then((res)=>{
        
        
        console.log(res);
        setTodoList(formatTodoList(res.data))
        })
    }



    const incrementDate = (date)=>{
        date.getDate()


        //increase by number of milliseconds in 1 day
        var newTime = date.getTime() + 86400000
        return new Date(newTime)
    }





    //a shorthand way of mapping the todoList
    const MapFilteredArray = (props)=>{


        
        const {filter} = props;
        // return <h1>map filtered array</h1>
        //

        let filteredArray = todoList.filter(value => value.period == filter)
        //console.log(array)
        //const length = array.filter(value => value.period == filter).length;
        //console.log(`array length for map is ${length}`)
        //console.log('map filtered array fired')


        return(
            filteredArray.length == 0 ? 
            <p>You have no events within this period</p>


        :
        filteredArray.map((val)=>{
            const {itemId, description, title, checked, deadline} = val
            return(
                <>
            {/* <h1>caught in filter</h1> */}
            <TodoItem deadline={deadline} itemId={itemId} handleItemChange={handleItemChange} description={description} title={title} checked={checked} />
            </>
            )
            
        }))

        
    }




    
    const determinePeriodSemester = (date)=>{

        var deadline = date
        const semester1 = new Date('2022-02-21');
        const semester1Break = new Date('2022-04-11')
        const semester1Part2 = new Date('2022-04-25')
        const semester1Exams = new Date('2022-06-06')
        const midYearBreak = new Date('2022-06-18')
        const semester2 = new Date('2022-07-18')
        const semester2Break = new Date('2022-09-07')
        const semester2Part2 = new Date('2022-10-07')
        const semester2Exams = new Date('2022-10-31')
        const endOfYear = new Date('2022-11-12')
        var period = 'default';
        //dear god... why?
        if((deadline >= semester1) && (deadline < semester1Break))
        {
            period = 'Semester 1'
        }
        else if((deadline >= semester1Break) && (deadline < semester1Part2))
        {
            period = 'Semester 1 break'
        }
        else if((deadline >= semester1Part2) && (deadline < semester1Exams))
        {
            period = 'Semester 1 part 2'
        }
        else if((deadline >= semester1Exams) && (deadline < midYearBreak))
        {
            period = 'Semester 1 exams'
        }
        else if((deadline >= midYearBreak) && (deadline < semester2))
        {
            period = 'Mid year break'
        }
        else if((deadline >= semester2) && (deadline < semester2Break))
        {
            period = 'Semester 2'
        }
        else if((deadline >= semester2Break) && (deadline < semester2Part2))
        {
            period = 'Semester 2 part break'
        }
        else if((deadline >= semester2Part2) && (deadline < semester2Exams))
        {
            period = 'Semester 2 exams'
        }
        else if(deadline > endOfYear) //upper bound is not needed because end of year is the final period)
        {
            period = 'End of year'
        }
        return period
    }


                        //key dates (Trimesters)
                    //Jan 24 - Trimester 1
                    //April 20 - Trimester 1 exams
                    //April 27 - End of Trimester 1
                    //May 9 - Trimester 2
                    //August 1- Trimester 2 exam period
                    //August 5 - End of Trimester 2
                    //August 22 - Trimester 3
                    //November 14th - Trimester 3 exams
                    //November 18th - Trimester 3 End of year
    const determinePeriodTrimester = (date)=>{

        var period;
        const trimester1 = new Date("2022-01-24")
        const trimester1Exams = new Date("2022-01-04")
        const trimester1End = new Date("2022-04-27")
        const trimester2 = new Date("2022-05-09")
        const trimester2Exams = new Date("2022-08-01")
        const trimester2End = new Date("2022-08-05")
        const trimester3 = new Date("2022-08-22")
        const trimester3Exams = new Date("2022-11-14")
        const trimester3End = new Date("2022-11-18")


        if(date >= trimester1 && date < trimester1Exams)
            period = "Trimester 1";

        if(date >= trimester1Exams && date < trimester1End)
            period = 'Trimester 1 exams'
        if(date >= trimester1End && date < trimester2)
            period = 'Trimester 1 end'
        if(date >= trimester2 && date < trimester2Exams)
            period = 'Trimester 2'
        if(date >= trimester2Exams && date < trimester2End)
            period  = 'Trimester 2 exams'
        if(date >= trimester2End && date < trimester3)
            period = 'Trimester 2 end'
        if(date >= trimester3 && date < trimester3Exams)
            period = 'Trimester 3';
        if(date >= trimester3Exams && date < trimester3End)
            period = 'Trimester 3 exams'
        if(date >= trimester3End)
            period = 'End of year'

        return period
    }


    const formatTodoList = (data)=>{
    const tempArray = []
            for(var i = 0; i < data.length; i++)
            {
                let deadline = data[i].deadline
                //console.log(data[i].deadline)
               
                deadline = deadline.split('T')[0]
                deadline = new Date(deadline)
                deadline = incrementDate(deadline)
                var period;

                if(studyInterval == 'Semester')
                    period = determinePeriodSemester(deadline)
                else if(studyInterval == 'Trimester')
                    period = determinePeriodTrimester(deadline)


                console.log(`period was set to ${period}`)
                //let dateRename = new Date(deadline)
                //we use 'increment date' because simply offsetting the day by 1 would cause errors when we have reached the final day of a month
                //incrementDate(new Date(deadline))
                //console.log(`deadline: ${deadline} title: ${data[i].title}`)



                //key dates for semester 1
                // const getMonth = deadline.getMonth() + 1;
                // const getDate = deadline.getDate();                
                let tempItem = {deadline: deadline, period: period, checked: data[i].checked, description: data[i].description, title: data[i].title, itemId: data[i].itemId}
                




                




                
                    //key dates uon
                    //FEB 21 - semester 1 
                    //April 11 - semester 1 recess
                    //April 25 - semester 1 second half
                    //june 6th - semester 1 exam period
                    //June 18th - mid-year break

                    // July 18th - semester 2 commences
                    //Sept 26 - Semsester 2 recess
                    //Oct 7 - Semester 2 resumes
                    //Oct 31 - Semester 2 exams
                    //Nov 12 - End of year break
                    //console.log('item added to semester 2')
                    //console.log(deadline.getDate())
                    tempArray.push(tempItem)
                
                //"getMonth" is always off by 1 because january counts as 0
                //console.log(`get month: ${dateRename.getMonth()} ${dateRename.getDate()} for title ${res.data[i].title}`)
                //console.log(``)
                //console.log(res.data[i].deadline)
                //console.log(`looping for item ${data.title}`)
                //var date = new Date(res.data[i].deadline)
            }
            return tempArray
    }
    useEffect(()=>{

        console.log('useEffect fired')
    if(store){
        console.log(`userID was set to ${store.userId}`)
        Axios.get(`http://localhost:3001/api/get/todo/${store.userId}`).then((res)=>{
            //console.log(res.data)
            //console.log(res)
            const tempArray = []
            // for(var i = 0; i < res.data.length; i++)
            // {

                
            //     let deadline = res.data[i].deadline
            //     console.log(res.data[i].deadline)
               
            //     deadline = deadline.split('T')[0]
            //     deadline = new Date(deadline)
            //     deadline = incrementDate(deadline)

            //     const period = determinePeriodSemester(deadline)
            //     //let dateRename = new Date(deadline)
            //     //we use 'increment date' because simply offsetting the day by 1 would cause errors when we have reached the final day of a month
            //     //incrementDate(new Date(deadline))
            //     //console.log(`deadline: ${deadline} title: ${res.data[i].title}`)



            //     //key dates for semester 1
            //     // const getMonth = deadline.getMonth() + 1;
            //     // const getDate = deadline.getDate();                
            //     let tempItem = {deadline: deadline, period: period, checked: res.data[i].checked, description: res.data[i].description, title: res.data[i].title, itemId: res.data[i].itemId}

                    



            //         //Trimester 2 events
            //         //Feb 18 - Trimester 1 census date









            //         //key dates (semesters)
            //         //FEB 21 - semester 1 
            //         //April 11 - semester 1 recess
            //         //April 25 - semester 1 second half
            //         //june 6th - semester 1 exam period
            //         //June 18th - mid-year break
            //         // July 18th - semester 2 commences
            //         //Sept 26 - Semsester 2 recess
            //         //Oct 7 - Semester 2 resumes
            //         //Oct 31 - Semester 2 exams
            //         //Nov 12 - End of year break



            //         //console.log('item added to semester 2')
            //         //console.log(deadline.getDate())
            //         tempArray.push(tempItem)
                
            //     //"getMonth" is always off by 1 because january counts as 0
            //     //console.log(`get month: ${dateRename.getMonth()} ${dateRename.getDate()} for title ${res.data[i].title}`)
            //     //console.log(``)
            //     //console.log(res.data[i].deadline)
            //     //console.log(`looping for item ${res.data.title}`)
            //     //var date = new Date(res.data[i].deadline)

            // }

            setTodoList(formatTodoList(res.data))
            //setTodoList(tempArray)
        })
    }
    },[studyInterval])
  return (
    <div id="main-content" class="white-mainclass">
        <h1>Todo list</h1>
        <Form.Label>Period within the year</Form.Label> 
        <Form.Select onChange={(e)=>{
            setSelectedPeriod(e.target.value)
        }} style={{marginBottom: '10px'}}>


            {console.log(`trimester ? ${studyInterval == 'Semester'}`)}
            {console.log(`semester ? ${studyInterval == 'Trimester'}`)}
            
            {studyInterval == 'Semester'?
                    <><option value='Semester 1'>Semester 1</option>
                <option value="Semester 1 break">Semester 1 recess</option>
                <option value="Semester 1 part 2">Semester 1 second half</option>
                <option value="Semester 1 exams">Semester 1 exam period</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 2 break">Semester 2 recess</option>
                <option value="Semester 2 part 2">Semester 2 second half</option>
                <option value="Semester 2 exams">Semester 2 exam period</option>
                <option value="End of year">End of year break</option></> : <>
                </>
            }
            {
                studyInterval == 'Trimester' ? 
                <>
                <option value='Trimester 1'>Trimester 1</option>
                <option value="Trimester 1 exams">Trimester 1 exam period</option>
                <option value="Trimester 1 end">End of trimester 1</option>                
                
                <option value="Trimester 2">Trimester 2</option>
                <option value="Trimester 2 exams">Trimester 2 exam period</option>
                <option value="Trimester 2 end">End of trimester 2</option>


                <option value="Trimester 3">Trimester 3</option>
                <option value="Trimester 3 exams">Trimester 3 exam period</option>
                <option value="End of year">End of Year</option>

                </>

                        
                :<></>

            }
        </Form.Select>


        <Form.Label>Semester format</Form.Label>
        <Form.Select onChange={(e)=>{setStudyInterval(e.target.value)}}>
            <option value='Semester'>Semesters</option>
            <option value='Trimester'>Trimesters</option>
        </Form.Select>

        <Table striped bordered hover>

            <thead>
                <tr>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Completion status</th>
                </tr>
            </thead>
            <tbody>
                <MapFilteredArray filter={selectedPeriod}/>
            </tbody>
        </Table>


        {/* <MapFilteredArray filter={selectedPeriod}/> */}
        {/* Y U NO RENDER */}
        



        {/* <h2>--Semester 1--</h2>


        {todoList.map((val)=>{

            const {deadline, checked, description, title, itemId, period} = val;
            

            // console.log(`checked has a value of ${checked}`)
            //const getDay = deadline.split('T')[0];
            //const splitDay = getDay.split('-')
            // console.log(`split day has value of ${splitDay[0]} ${splitDay[1]} ${splitDay[2]}`)
            // console.log(`third value has a value of ${splitDay[2]}`)
            // console.log(`date for ${title}`)
            // console.log(splitDay[1] + 1)
            // console.log(new Date(`${splitDay[0]}-${splitDay[1]}-${splitDay[2]}`))
            // //console.log(todoList)
            return(
                <>
                {console.log(`period was set to ${period}`)}
                <h1>{period}</h1>
                <div className='todo-item' style={checked ? {backgroundColor: 'green', color: 'white'}: {backgroundColor: 'white'}}>
                <div className='check-wrapper'>
                {checked ? <CheckCircleIcon onClick={()=>{handleItemChange(itemId, !checked)}}/> : <CheckCircleOutlineIcon onClick={()=>{handleItemChange(itemId, !checked)}}/>}<div className='todo-title'>{title}</div>
                </div>
                <div className='todo-description' style={{color:(checked ? "white" : 'darkgray')}}>{description}</div>
                
                </div>
                </>
            )
        }
        )} */}
        
        {/* <h2>Semester 1</h2>
            <MapFilteredArray filter="Semester 1"/>
        <h2>Semester 1 recess</h2>
            <MapFilteredArray filter="Semester 1 break"/>
        <h2>Semester 1 post-break</h2>
            <MapFilteredArray filter="Semester 1 part 2"/>
        <h2>Semester 1 exam period</h2>
            <MapFilteredArray filter="Semester 1 exams"/>
        <h2>Mid-year break</h2>
            <MapFilteredArray filter="Mid year break"/>
        <h2>Semester 2</h2>
            <MapFilteredArray filter="Semester 2"/>
        <h2>Semsester 2 recess</h2>
            <MapFilteredArray filter="Semester 2"/>   
        <h2>Semester 2 post-break</h2>
            <MapFilteredArray filter="Semester 2 part 2"/>
        <h2>End of year</h2>
            <MapFilteredArray filter="End of year"/> */}

        <Button style={{display: (addMode ? "none" : "inline")}} onClick={()=>{setAddMode(true)}}>Add new item</Button>
        <Form style = {{display : (addMode ? 'inline': 'none' )}}>
            {/* <h3>New item</h3> */}
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" type="text" onChange={(e)=>{handleChange(e)}} placeholder="Title"/>
            <Form.Label>Description</Form.Label>

            <Form.Control type="text" name="description" onChange ={(e)=>{handleChange(e)}} placeholder="Description (optional)"/>
            <Form.Label>Deadline</Form.Label>
            <Form.Control type="date" name="date" onChange={(e)=>{handleChange(e)}}></Form.Control>
            <Button onClick={submitItem}>Submit</Button>
        </Form>
    </div>
  )
}

export default TodoList