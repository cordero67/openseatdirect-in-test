import React, { useState, useRef, useEffect } from "react";


import { API } from "../config";


const EventDeletion = () => {

    const [eventNumber, setEventNumber] = useState();

    const changeEventNumber = (event) => {
        console.log("event: ", event);
        console.log("event.target.value: ", event.target.value);
        setEventNumber(event.target.value);
        
    }

    const deleteEvent = () => {

        let tempUser = JSON.parse(localStorage.getItem("user"));
        const userId = tempUser.user._id;
        const token = tempUser.token;
        let apiurl = `${API}/eventix/${userId}/${eventNumber}`;
        console.log("apiurl: ", apiurl);
        fetch(apiurl, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        })


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