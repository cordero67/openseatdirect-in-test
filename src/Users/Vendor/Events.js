import React, { useEffect, useState } from "react";

import { API } from "../../config";
import Analytics from "../../assets/analytics.png";
import Receipt from "../../assets/receipt.png";
import ReceiptBlue from "../../assets/receiptBlue.png";
import Ticket from "../../assets/ticket.png";
import Edit from "../../assets/edit.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faEdit,
  faTicketAlternative
} from "@fortawesome/free-solid-svg-icons";
 
import classes from "./VendorAccountOLD.module.css";
import { compareValues, getDates } from "./VendorFunctions";
import { Button } from "semantic-ui-react";

const Events = (props) => {

    const [eventDescriptions, setEventDescriptions] = useState();//
    const [isLoading, setIsLoading] = useState(false);//
    const [isSuccessfull, setIsSuccessfull] = useState(false);//

    const handleErrors = response => {
        console.log("Inside 'apiCore' 'handleErrors()'", response);
        if (!response.ok) {
            throw Error(response.status);
        }
        return response;
    };
    
    useEffect(() => {
        setIsLoading(true);
        if (
            typeof window !== "undefined" &&
            localStorage.getItem(`user`) !== null
        ) {
            let tempUser = JSON.parse(localStorage.getItem("user"));
            let vendorToken = tempUser.token;
            let vendorId = tempUser.user._id;
            console.log("Got user");

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + vendorToken);
        
            let requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };
    
            // retrieves event information
            let fetchstr =  `${API}/event/alluser/${vendorId}`;
    
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
                setIsSuccessfull(true);
                setIsLoading(false);
                return js;
            })
            .catch((error) => {
                console.log("error", error);
                setIsSuccessfull(false);
                setIsLoading(false);
            });

            // retrieves order information
            fetchstr = `${API}/order/${vendorId}`;

            fetch(fetchstr, requestOptions)
            .then(handleErrors)
            .then((response) => response.text())
            .then((result) => {
                localStorage.setItem("orders", result);
            })
            .catch((error) => {
                console.log("error in order information retrieval", error);
            });

        } else {
            window.location.href = "/signin";
        }

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
                    {eventDescriptions.map((item, index) => {
                        let shortMonth, dayDate, longDateTime;
                        [shortMonth, dayDate, longDateTime] = getDates(item.startDateTime);

                        return (
                            <div key={index} 
                                style={{
                                    textAlign: "center",
                                    display: "grid",
                                    columnGap: "5px",
                                    gridTemplateColumns: "60px 500px 80px 80px 80px 80px 80px",
                                    paddingTop: "15px",
                                    paddingBottom: "5px",
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
                                <div style={{textAlign: "left"}}>
                                    <button
                                        style={{
                                            fontSize: "16px",
                                            textAlign: "left",
                                            color: "blue",
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
                                            props.clicked()
                                        }}
                                    >
                                        {item.eventTitle}
                                    </button>
                                    <div
                                        style={{
                                            fontSize: "13px",
                                            textAlign: "left",
                                            fontWeight: "600" 
                                        }}
                                    >
                                    {longDateTime}
                                    </div>
                                </div>
                                <div style={{fontSize: "16px", fontWeight: "600", paddingTop: "12px"}}>
                                    {item.isDraft ?
                                        <span style={{color: "red"}}>Draft</span> :
                                        <span style={{color: "green"}}>Live</span>}
                                </div>
                                <button
                                    style={{
                                        fontSize: "16px",
                                        textAlign: "left",
                                        color: "blue",
                                        fontWeight: "600",
                                        width: "50px",
                                        paddingLeft: "25px",
                                        border: "none",
                                        backgroundColor: "white",
                                        cursor: "pointer",
                                        display: "inlineBlock",
                                        outline: "none",
                                    }}
                                >
                                    <img
                                        src={Analytics}
                                        color="blue"
                                        alt="OpenSeatDirect Logo"
                                        style={{width: "100%"}}
                                        cursor="pointer"
                                        onClick={() => {
                                            props.salesAnalytics();
                                        }}
                                    />
                                </button>
                                <button
                                    style={{
                                        fontSize: "16px",
                                        textAlign: "left",
                                        color: "blue",
                                        fontWeight: "600",
                                        width: "60px",
                                        paddingLeft: "30px",
                                        border: "none",
                                        backgroundColor: "white",
                                        cursor: "pointer",
                                        display: "inlineBlock",
                                        outline: "none",
                                    }}
                                >
                                    <img
                                        src={Receipt}
                                        color="blue"
                                        alt="OpenSeatDirect Logo"
                                        style={{width: "80%"}}
                                        cursor="pointer"
                                        onClick={() => {
                                            props.historicalOrders();
                                        }}
                                    />
                                </button>
                                <button
                                    style={{
                                        fontSize: "16px",
                                        textAlign: "left",
                                        color: "blue",
                                        fontWeight: "600",
                                        width: "50px",
                                        paddingLeft: "25px",
                                        border: "none",
                                        backgroundColor: "white",
                                        cursor: "pointer",
                                        display: "inlineBlock",
                                        outline: "none",
                                    }}
                                >
                                    <img
                                        src={Ticket}
                                        color="blue"
                                        alt="OpenSeatDirect Logo"
                                        style={{width: "140%"}}
                                        cursor="pointer"
                                        onClick={() => {
                                            props.issueTickets();
                                        }}
                                    />
                                </button>
                                <div
                                    style={{
                                        color: "blue",
                                        width: "60px",
                                        fontSize: "22px",
                                        textAlign: "center",
                                        position: "relative",
                                        paddingTop: "10px",
                                        paddingLeft: "30px"
                                    }}
                                >
                                    <FontAwesomeIcon
                                    color="blue"
                                    size="sm"
                                    cursor="pointer"
                                    onClick={() => {
                                        props.editEvent();
                                    }}
                                    icon={faEdit}
                                    />
                                </div>
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
                MY EVENTS
            </div>
            <div className={classes.DisplayPanel2}>
                <div className={classes.MainDisplayHeader2}>
                    <div style={{ textAlign: "center" }}>Date</div>
                    <div className={classes.Expand}>Event</div>
                    <div style={{ textAlign: "center" }}>
                        <div>Event</div>
                        <div>Status</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div>Sales</div>
                        <div>Analytics</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div>Historical</div>
                        <div>Orders</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div>Issue</div>
                        <div>Tickets</div>
                     </div>
                    <div style={{ textAlign: "center" }}>
                        <div>Edit</div>
                        <div>Event</div>
                    </div>
                </div>
                {mainDisplay()}
            </div>
        </div>
    )
}

export default Events;