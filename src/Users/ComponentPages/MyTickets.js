import React, { useEffect, useState } from "react";
import Spinner from "../../components/UI/Spinner/Spinner";

import { API } from "../../config";
import classes from "./MyTickets.module.css";

const MyTickets = () => {
    const [display, setDisplay] = useState("spinner"); // defines panel displayed: main, spinner, connection

    const [orders,setOrders] = useState([]);
    const [events,setEvents] = useState([]);
    
    const handleErrors = response => {
        if (!response.ok) {
            console.log("error in 'handleErrors()'");
            throw Error(response.status);
        }
        return response;
    };
    
    // LOOKS GOOD
    useEffect(() => {
        let tempUser;
        if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {
        tempUser = JSON.parse(localStorage.getItem("user"));
        }

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${tempUser.token}`);
        
        let url = `${API}/tixorder/get_wallet/${tempUser.user._id}`
        let fetcharg ={
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(url, fetcharg )
        .then(handleErrors)
        .then((response) => response.text())
        .then((result) => {
            let js = JSON.parse(result);
            setOrders(js);
            console.log("result: ", js)
            console.log("result.length: ", js.length)
            setDisplay("main")
            createEventArray(js)
        })
        .catch((error) => {
            // need to handle this error
            setDisplay("connection")
            console.log("error", error);
        });

    }, []);

    const createEventArray = (orders) => {
        let tempArray = []; // an array of tickets within each eventNum
        let tempEvents = []; // an array of just the eventNum's
        orders.map(order => {
            if (tempEvents.includes(order.eventNum)) {
                console.log("Event already exist")
            } else {
                console.log("NEW Event");
                tempEvents.push(order.eventNum);
                let tempElement = {
                    eventNum: order.eventNum,
                    eventTitle: order.eventId.eventTitle,
                    startDateTime: order.eventId.startDateTime,
                    tickets: []
                }
                tempArray.push(tempElement);
            }
        })
        orders.map(order => {
            let position = tempEvents.indexOf(order.eventNum);
            order.qrTickets.map(ticket => {
                tempArray[position].tickets.push(ticket)
            })
        });
        console.log("tempArray: ", tempArray);
        console.log("tempEvents: ", tempEvents);
        setEvents(tempArray);
    }



    
  // LOOKS GOOD
  // defines and sets "loadingSpinner" view status
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div className={classes.Spinner}>
          <Spinner></Spinner>;
        </div>
      );
    } else {
      return null;
    }
  }

    const orderItems = () => {
    if (display === "main") {
        return (
        <div>
            {orders.map((order, index) => {
            return (
                <div style={{paddingBottom: "10px"}} key={index}>
                    <div style={{fontWeight: "600"}}>
                        Order number: {order.eventId.eventTitle}
                    </div>
                    {order.qrTickets.map(ticket => {
                        console.log("ticket: ", ticket)
                        return (
                            <div>
                            <div>{ticket.uuid}:{" "}{ticket.dbPrice}</div>
                            </div>
                        )
                    })}
                </div>
            );
            })}
        </div>
        );
    } else return null
    };

    const eventItems = () => {
    if (display === "main") {
        return (
        <div>
            {events.map((event, index) => {
            return (
                <div style={{paddingBottom: "10px"}} key={index}>
                    <div style={{fontWeight: "600"}}>
                        <button
                            onClick={() => {
                                window.location.href = `/ed/?eventID=${event.eventNum}`;
                            }}
                        >
                        <span style={{color: "blue"}}>{event.eventTitle}</span>
                        </button>
                        <br></br>
                        {event.startDateTime}
                    </div>
                    {event.tickets.map((ticket, index) => {
                        console.log("ticket: ", ticket)
                        return (
                            <div>
                                <div>ticket {index + 1}: {ticket.uuid}</div>
                            </div>
                        )
                    })}
                </div>
            );
            })}
        </div>
        );
    } else return null
    };


  // LOOKS GOOD
  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (display === "main") {
        return (
            <div>
                <div className={classes.DisplayPanel}>
                    <div style={{fontSize: "24px"}}>Orders</div>
                    <br></br>
                    {orderItems()}
                    <br></br>
                    <div style={{fontSize: "24px"}}>Events</div>
                    <br></br>
                    {eventItems()}
                </div>
            </div>
        )
    } else return null
  };


  // LOOKS GOOD
  // defines and sets "connectionStatus" view status
  const connectionStatus = (condition) => {
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
            <div className={classes.ConnectionText}>
                <br></br>
                There is a problem with the OSD Server in retrieving your tickets. Please try again later.
            </div>
        </div>
      )
    } else return null;
  }

    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                My Tickets
            </div>
            {loadingSpinner()}
            {mainDisplay()}
            {connectionStatus()}
        </div>
    )
}

export default MyTickets;