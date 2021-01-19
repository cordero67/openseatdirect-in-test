import React, { useEffect, useState, Fragment } from "react";

import { API } from "../../config";
import Analytics from "../../assets/analytics.png";
import Receipt from "../../assets/receipt.png";
import ReceiptBlue from "../../assets/receiptBlue.png";
import Ticket from "../../assets/ticket.png";
import TicketBlue from "../../assets/ticketBlue.png";
import WarningModal from "./Modals/WarningModal";
import Spinner from "../../components/UI/Spinner/Spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit
} from "@fortawesome/free-solid-svg-icons";
 
import classes from "./VendorAccountOLD.module.css";
import { compareValues, getDates } from "./VendorFunctions";
import { Button } from "semantic-ui-react";

const Events = (props) => {

    const [eventDescriptions, setEventDescriptions] = useState();//
    const [isLoading, setIsLoading] = useState(false);//
    const [isSuccessfull, setIsSuccessfull] = useState(false);//

    const [showWarningModal, setShowWarningModal] = useState({
        status: false,
        type: ""
    });

    const handleErrors = response => {
        console.log("Inside 'apiCore' 'handleErrors()'", response);
        if (!response.ok) {
            throw Error(response.status);
        }
        return response;
    };

    const loadServerData = () => {
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
    }
    
    useEffect(() => {
        setIsLoading(true);
        if (
            typeof window !== "undefined" &&
            localStorage.getItem(`user`) !== null
        ) {
            loadServerData();

        } else {
            window.location.href = "/signin";
        }

    }, []);
    
    const setEventNum = (item) => {
        if (typeof window !== "undefined") {
        localStorage.setItem("eventNum", JSON.stringify(item.eventNum));
        }
        // NEED TO DETERMINE WHAT HAPPENS IF THERE IS NO WINDOW
    }

    const switchTab = (event, item) => {
        console.log("Event name: ", event.target.name)
        setIsLoading(true);
        if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {
            localStorage.setItem("eventNum", JSON.stringify(item.eventNum));

            if (localStorage.getItem(`orders`) !== null && localStorage.getItem(`events`) !== null) {
                let storedEvents = JSON.parse(localStorage.getItem("events"));
                let storedOrders = JSON.parse(localStorage.getItem("orders"));

                if (event.target.name === "analytics") {
                    setShowWarningModal({
                        status: true,
                        type: "analytics"
                    });
                } else if (event.target.name === "orders") {
                    //check if there are any orders for this event
                    let ordersExist = false;
                    storedOrders.forEach((order) => {
                        if (order.eventNum === item.eventNum) {
                            ordersExist = true;
                        }
                    })
                    
                    if (ordersExist) {
                        // switch to the historical orders tab
                        console.log("there are orders for this event");
                        props.ticketSales();
    
                    } else {
                        console.log("there are NO orders for this event");
                        setShowWarningModal({
                            status: true,
                            type: "orders"
                        });
                    }

                } else if (event.target.name === "tickets") {
                    //check if there are any orders for this event
                    let ticketsExist = false;
                    storedEvents.forEach((event) => {
                        if (event.eventNum === item.eventNum &&
                            "tickets" in event && event.tickets.length > 0) {
                            ticketsExist = true;
                        }
                    })
                    
                    if (ticketsExist) {
                        // switch to the historical orders tab
                        console.log("there are tickets for this event");
                        props.issueTickets();
                    } else {
                        console.log("there are NO tickets for this event");
                        setShowWarningModal({
                            status: true,
                            type: "tickets"
                        });
                    }
                }

            } else {
                console.log("had to reload server data")
                loadServerData();
                // data issue, please resubmit selection
            }
            
        } else {
        window.location.href = "/signin";
        }

        setIsLoading(false);
    }

    const warningModal = (
        <Fragment>
            <WarningModal
                show={showWarningModal.status}
                type={showWarningModal.type}
                close={() => {
                    setShowWarningModal({
                        status: false,
                        type: ""
                    });
                }}
            ></WarningModal>
        </Fragment>
    )

    const mainDisplay = () => {
        if (isLoading) {
            return (
                <Fragment>
                    <div style={{paddingTop: "120px"}}>
                        <Spinner/>
                    </div>
                </Fragment>
            );
        } else if (!isLoading && isSuccessfull && eventDescriptions.length !== 0) {
            console.log("eventDescriptions.length: ", eventDescriptions.length)
            return (
                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    {eventDescriptions.map((item, index) => {
                        let shortMonth, dayDate, longDateTime;
                        [shortMonth, dayDate, longDateTime] = getDates(item.startDateTime);
                        console.log("Event number: ", item.eventNum)

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
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            textAlign: "left",
                                            fontWeight: "600",
                                            paddingLeft: "0px",
                                        }}
                                    >
                                    {item.eventTitle}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "13px",
                                            textAlign: "left",
                                            fontWeight: "500" 
                                        }}
                                    >
                                    {longDateTime}
                                    </div>
                                </div>
                                <div style={{fontSize: "16px", fontWeight: "500", paddingTop: "12px"}}>
                                    {item.isDraft ?
                                        <span style={{color: "#B80000"}}>DRAFT</span> :
                                        <span style={{color: "#008F00"}}>LIVE</span>}
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
                                        name="analytics"
                                        onClick={(event) => {
                                            switchTab(event, item);
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
                                        name="orders"
                                        onClick={(event) => {
                                            switchTab(event, item);
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
                                        name="tickets"
                                        onClick={(event) => {
                                            switchTab(event, item);
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
                                            setEventNum(item);
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
        } else {
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
        }
    }

    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                My Events
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
                        <div>Past</div>
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
                {warningModal}
            </div>
        </div>
    )
}

export default Events;