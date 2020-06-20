import React, { useState, useRef, useEffect } from "react";


import { API } from "../config";

let userId = JSON.parse(localStorage.getItem("user")).user._id;
let token = JSON.parse(localStorage.getItem("user")).token;

const EventDeletion = () => {

    const [eventNumber, setEventNumber] = useState();
    const [eventDetails, setEventDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccessful, setIsSuccessful] = useState(true);

    const changeEventNumber = (event) => {
        console.log("event: ", event);
        console.log("event.target.value: ", event.target.value);
        setEventNumber(event.target.value);
    }

    const compareValues = (key, order) => {
      return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }
        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
  
        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order === "desc" ? comparison * -1 : comparison;
      };
    };

    useEffect(() => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
    
        let fetchstr =  `${API}/event/all/${userId}`;
        console.log("about to fetch: ", fetchstr, requestOptions);

        fetch(fetchstr, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            let js = JSON.parse(result);
            console.log("eventDetails: ", js);
            js.sort(compareValues("startDateTime", "asc"));
            console.log("js: ", js);
            setEventDetails(js);
            setIsSuccessful(false)
            setIsLoading(false);
            return js;
          })
          .catch((error) => {
            console.log("error", error);
            setIsSuccessful(false)
            setIsLoading(false);
          });
      }, []);


    const deleteEvent = () => {
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          //redirect: "follow",
        };
    
        let fetchstr =  `${API}/eventix/${userId}/${eventNumber}`;
        console.log("about to fetch: ", fetchstr, requestOptions);
        
        fetch(fetchstr, requestOptions);
    }


    return (
        <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        Delete an Event
        
        <br></br>
        <br></br>

        <input
            style={{ width: "400px" }}
            type="text"
            id="eventNum"
            placeholder="Event number to Delete"
            name="facebookLink"
            onChange={(event) => {
                changeEventNumber(event);
            }}
        ></input>
        <br></br>
        <br></br>
        <button
            onClick={deleteEvent}
        >
            Delete Event
        </button>
        <br></br>
        <br></br>
        </div>

    )
}

export default EventDeletion;