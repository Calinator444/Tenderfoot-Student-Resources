import React, { useEffect, useState } from "react";
import Axios from "axios";
import * as mui from "@mui/icons-material";

function SidebarData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/todo").then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  }, []);

  //change the completion status of an item in the database.
  const setDbCompleted = (itemID, completionStatus) => {
    Axios.post("http://localhost:3001/api/alterTodo", {
      body: JSON.stringify(itemID),
    });
  };

  const setCompleted = (id, itemDescription, completed, index) => {
    //console.log(id);

    // Axios.post("http://localhost:3001/api/approveComment", {
    //   body: JSON.stringify(id),
    // });

    let arrayStart = data.slice(0, index);

    //may result in an "index out of bounds" error if the user only has one item to complete

    let arrayEnd = data.slice(index + 1);
    console.log(arrayStart);
    console.log(arrayEnd);
    const alterCompletion = completed ? false : true;

    setDbCompleted(id, alterCompletion);

    //concatenate the start and end of the initial array so that all the items appear in the correct order
    let newArray = [
      ...arrayStart,
      { id: id, itemDescription: itemDescription, completed: alterCompletion },
      ...arrayEnd,
    ];

    //let newPeople = data.filter((obj) => obj.id !== id);
    //ellipsis notation copies all the objects from the array

    // let newArray = [
    //   ...newPeople,
    //   {
    //     id: id,
    //     itemDescription: itemDescription,
    //     completed: alterCompletion,
    //   },
    // ];
    console.log(newArray);
    setData(newArray);
  };
  return (
    <>
      {data.map((val, index) => {
        const { itemDescription, id, completed } = val;
        console.log(index);
        return (
          <li className={completed ? "completed" : "incomplete"} key={id}>
            {console.log(
              "item with id:" + id + "has completion status of :" + completed
            )}

            <p className="listItem">{itemDescription}</p>

            <button
              style={{
                padding: 0,
                border: "none",
                background: "none",
                color: "white",
              }}
              className="checkbox"
              onClick={() => {
                setCompleted(id, itemDescription, completed, index);
              }}
            >
              <mui.CheckCircle />
            </button>
          </li>
        );
      })}
    </>
  );
}
export default SidebarData;
