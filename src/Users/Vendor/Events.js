import React, { useEffect, useState } from "react";

import { API } from "../../config";
import Aux from "../../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
 
import classes from "./ControlPanel.module.css";
import { compareValues, getDates } from "./VendorFunctions";
import { Button, Popup } from "semantic-ui-react";


let vendorInfo = {};

const Events = (props) => {

    const [eventDescriptions, setEventDescriptions] = useState();//
    const [ticketDisplay, setTicketDisplay] = useState();
    const [isLoading, setIsLoading] = useState(true);//
    const [isSuccessfull, setIsSuccessfull] = useState(true);//

    const handleErrors = response => {
        console.log("Inside 'apiCore' 'handleErrors()'", response);
        if (!response.ok) {
            throw Error(response.status);
        }
        return response;
      };

    // intilializes the show property of each ticket type to "false"
    const initializeDisplays = (events) => {
        let tempObject = {};
        events.forEach((item, index) => {
        tempObject[item.eventNum] = false;
        })
        setTicketDisplay(tempObject);
    }
    
    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            localStorage.getItem(`user`) !== null
        ) {
            let tempUser = JSON.parse(localStorage.getItem("user"));
            vendorInfo.token = tempUser.token;
            vendorInfo.id = tempUser.user._id;
            //vendorInfo.name = tempUser.user.name
            //console.log("vendorInfo.name: ", tempUser.user.name)
        } else {
            //window.location.href = "/signin";
        }
    
        if (
            typeof window !== "undefined" &&
            localStorage.getItem(`events`) !== null
        ) {
            let tempEvents = JSON.parse(localStorage.getItem("events"));
            setEventDescriptions(tempEvents)
            console.log("events existed")
        } else {
            console.log("events do not exist")
        }
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + vendorInfo.token);
    
        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        let fetchstr =  `${API}/event/alluser/${vendorInfo.id}`;

        fetch(fetchstr, requestOptions)
        .then(handleErrors)
        .then((response) => response.text())
        .then((result) => {
            localStorage.setItem("events", result);
            let js = JSON.parse(result);
            console.log("eventDescriptions unordered: ", js);
            js.sort(compareValues("startDateTime", "asc"));
            console.log("eventDescriptions ordered: ", js);
            setEventDescriptions(js);
            setIsSuccessfull(true)
            setIsLoading(false);
            return js;
        })
        .catch((error) => {
            console.log("error", error);
            setIsSuccessfull(false)
            setIsLoading(false);
        });

    }, []);
  
    const editEvent = (item) => {
        if (typeof window !== "undefined") {
        console.log("JSON.stringify(item): ", JSON.stringify(item));
        localStorage.setItem("eventNum", JSON.stringify(item.eventNum));
        window.location.href = `/eventedit/?eventID=${item.eventNum}`;
        }
        // NEED TO DETERMINE WHAT HAPPENS IF THERE IS NO WINDOW
    }
  
    const eventDetail = (item) => {
        if (typeof window !== "undefined") {
        //console.log("JSON.stringify(item): ", JSON.stringify(item));
        localStorage.setItem("eventNum", JSON.stringify(item.eventNum));
        //window.location.href = `/eventedit/?eventID=${item.eventNum}`;
        }
        // NEED TO DETERMINE WHAT HAPPENS IF THERE IS NO WINDOW
    }

    const mainDisplay = () => {
        if (!isLoading && isSuccessfull && eventDescriptions.length !== 0) {
            console.log("eventDescriptions.length: ", eventDescriptions.length)
            return (
                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    {eventDescriptions.map((item, index) => {
                        let shortMonth, dayDate, longDateTime;
                        [shortMonth, dayDate, longDateTime] = getDates(item);

                        return (
                            <div key={index} 
                                style={{
                                    textAlign: "center",
                                    display: "grid",
                                    columnGap: "10px",
                                    gridTemplateColumns: "60px 20px 640px 100px 80px",
                                    paddingLeft: "20px",
                                    paddingRight: "30px"
                                    }}>
                                <div style={{ textAlign: "center"}}>
                                    <span
                                        style={{
                                        fontSize: "12px",
                                        fontWeight: "400",
                                        color: "red",
                                        }}
                                    >
                                        {shortMonth}
                                    </span>
                                    <br></br>
                                    <span style={{ fontSize: "18px", color: "black", fontWeight: "600" }}>
                                        {dayDate}
                                    </span>
                                </div>
                                <div style={{ fontSize: "12px", textAlign: "center" }}>
                                
                                    <FontAwesomeIcon
                                    color="black"
                                    size="sm"
                                    cursor="pointer"
                                    onClick={() => {
                                        //let tempDisplay = {...ticketDisplay};
                                        //tempDisplay[item.eventNum] = false;
                                        //setTicketDisplay(tempDisplay);
                                    }}
                                    icon={faChevronUp}
                                    />
                                
                                </div>
                                <div style={{textAlign: "left" }}>
                                    <button
                                        style={{
                                            fontSize: "16px",
                                            textAlign: "left",
                                            fontWeight: "600",
                                            paddingLeft: "0px",
                                            border: "none",
                                            backgroundColor: "white",
                                            cursor: "pointer",
                                            display: "inlineBlock",
                                            outline: "none",
                                        }}
                                        onClick={() => {
                                            eventDetail(item);
                                            props.clicked()}}
                                    >
                                        {item.eventTitle}
                                    </button>
                                    <div
                                        style={{
                                            fontSize: "13px",
                                            textAlign: "left", fontWeight: "500" 
                                        }}
                                    >
                                    {longDateTime}
                                    </div>
                                </div>
                                <div style={{fontSize: "16px", fontWeight: "600"}}>{item.isDraft ? <span style={{color: "blue"}}>Draft</span> : <span style={{color: "green"}}>Live</span>}</div>
                                <div
                                style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    position: "relative"
                                }}
                                > {item.isDraft ? 
                                    <FontAwesomeIcon
                                        style={{ zIndex: "100" }}
                                        color="blue"
                                        size="lg"
                                        cursor="pointer"
                                        onClick={() => editEvent(item)}
                                        icon={faEdit}
                                    /> : 
                                    <FontAwesomeIcon
                                        style={{ zIndex: "100" }}
                                        color="green"
                                        size="lg"
                                        cursor="pointer"
                                        onClick={() => editEvent(item)}
                                        icon={faEdit}
                                    />}
                                </div>
                                <br></br>
                            </div>
                        );
                    })}
                </div>
            )
        } else if (!isLoading && isSuccessfull) {
            console.log("eventDescriptions.length: zero: ", eventDescriptions.length);
            console.log("zero events");
            return (
                <div style={{ textAlign: "center", fontSize: "20px" }}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>You currently have no events.
                </div>
            )
        } else if (!isLoading && !isSuccessfull) {
            return (
                <div className={classes.SystemDownMessage}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className={classes.SummaryHeader}>
                        System error please reload/refresh this page.
                    </div>
                    
                    <br></br>
                    <div style={{textAlign: "center"}}>
                        <Button className={classes.EventsButton}
                            style={{
                                backgroundColor: "white",
                                border: "1px solid blue",
                                color: "blue",
                                padding: "0px"
                            }}
                            content="Reload Page"
                            onClick={() => {
                                window.location.reload();
                                return false;
                            }}
                        />
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                EVENTS
            </div>
            
            <div className={classes.DisplayPanel2}>
                <div className={classes.MainDisplayHeader}>
                    <div style={{ textAlign: "center" }}>Date</div>
                    <div></div>
                    <div className={classes.Expand}>Event</div>
                    <div style={{ textAlign: "center" }}>Status</div>
                    <div style={{ textAlign: "center" }}>Edit</div>
                </div>
                {mainDisplay()}
            </div>
        </div>
    )
}

export default Events;