import React, { useEffect, useState } from "react";

import { API } from "../../config";
import Aux from "../../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
 
import classes from "./VendorAccountOLD.module.css";
import { compareValues, getDate } from "./VendorFunctions";
import { Button, Popup } from "semantic-ui-react";


let vendorInfo = {};

let ordersArray = [
    {
        event: "OSD Launch Party",
        firstName: "Robert",
        lastName: "Montgomery",
        email: "robertmontgomery@openseatdirect.com",
        orderDate: "Sep 19, 2020",
        tickets: 4,
        amount: 24.50
    },
    {
        event: "Hoboken Sack Race",
        firstName: "Michael",
        lastName: "Trautman",
        email: "sally@ailf.com",
        orderDate: "Sep 19, 2020",
        tickets: "2",
        amount: "45.00"
    }
]

const Orders = (props) => {

    const [ticketOrders, setTicketOrders] = useState();//
    const [orderDisplay, setOrderDisplay] = useState();
    const [isLoading, setIsLoading] = useState(true);//
    const [isSuccessfull, setIsSuccessfull] = useState(true);//

    const handleErrors = response => {
        console.log("Inside 'apiCore' 'handleErrors()'", response);
        if (!response.ok) {
            throw Error(response.status);
        }
        return response;
      };
    
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
            localStorage.getItem(`orders`) !== null
          ) {
            let tempOrders = JSON.parse(localStorage.getItem("orders"));
            setTicketOrders(tempOrders)
            console.log("orders existed")
          } else {
            console.log("orders do not exist")
          }
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + vendorInfo.token);
    
        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        let fetchstr = `${API}/order/${vendorInfo.id}`;

        fetch(fetchstr, requestOptions)
            .then(handleErrors)
            .then((response) => response.text())
            .then((result) => {
                localStorage.setItem("orders", result);
                let js = JSON.parse(result);
                console.log("ticket orders unordered: ", js);
                js.sort(compareValues("startDateTime", "asc"));
                console.log("ticket orders ordered: ", js);
                setTicketOrders(js);
                //initializeDisplays(js);
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

    const mainDisplay = () => {
        console.log("ticketOrders: ", ticketOrders)
        if (!isLoading && isSuccessfull && ticketOrders.length !== 0) {
            console.log("SUCCESS")
        //if (false) {
            return (
                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    {ticketOrders.map((item, index) => {
                        let shortDateTime;
                        console.log("item: ", item);
                        [shortDateTime] = getDate(item);
                        console.log("shortDateTime: ", shortDateTime)

                        return (
                            <div key={index} 
                                style={{
                                    textAlign: "center",
                                    display: "grid",
                                    columnGap: "10px",
                                    gridTemplateColumns: "200px 100px 100px 280px 100px 60px 100px",
                                    paddingLeft: "30px",
                                    paddingRight: "30px"
                                    }}>
                                <div style={{textAlign: "left"}}>{item.eventTitle}</div>
                                <div style={{textAlign: "left"}}>{item.order_firstName}</div>
                                <div style={{textAlign: "left"}}>{item.order_lastName}</div>
                                <div style={{textAlign: "left"}}>{item.order_email}</div>
                                <div style={{textAlign: "left"}}>{shortDateTime}</div>
                                <div>{item.order_numTickets}</div>
                                <div style={{textAlign: "right", paddingRight: "20px"}}>{item.order_totalAmount.toFixed(2)}</div>
                                <br></br>
                            </div>
                        );
                    })}
                </div>
            )
        } else if (!isLoading && isSuccessfull) {
            console.log("ticketOrders.length: zero: ", ticketOrders.length);
            console.log("zero events");
            return (
                <div style={{ textAlign: "center", fontSize: "20px" }}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>You currently have no ticket orders.
                </div>
            )
        } else if (!isLoading && !isSuccessfull) {
            return (
                <div className={classes.SystemDownMessage}>
                    <br></br>
                    <br></br>
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
                ORDERS
            </div>
            
            <div className={classes.DisplayPanel2}>
                <div className={classes.OrdersHeader}>
                    <div style={{ textAlign: "left" }}>Event</div>
                    <div>First</div>
                    <div>Last</div>
                    <div className={classes.Expand}>Customer email</div>
                    <div>Order Date</div>
                    <div style={{ textAlign: "center" }}>Tickets</div>
                    <div style={{ textAlign: "center" }}>Amount</div>
                </div>
                {mainDisplay()}
            </div>
        </div>
    )
}

export default Orders;