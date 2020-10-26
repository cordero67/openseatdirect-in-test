import React, { useEffect, useState } from "react";

import { API } from "../../config";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import EventsModal from "./Modals/EventsModal";
import OrderModal from "./Modals/OrderModal";

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

const EventDashboard = (props) => {

    const [eventDescription, setEventDescription] = useState({
      tickets: []
    });//
    const [allEvents, setAllEvents] = useState([]);//
    const [showEventModal, setShowEventModal] = useState(true);//
    const [orderDetails, setOrderDetails] = useState([
      {
        ticketType: "General Admission",
        numTickets: 2,
        totalAmount: 20,
        paymentType: "Cash"
      },
      {
        ticketType: "Assigned Seating",
        numTickets: "1",
        totalAmount: 20,
        paymentType: "cashApp"
      },
    ]);//
    const [ticketDisplay, setTicketDisplay] = useState();
    const [isLoading, setIsLoading] = useState(false);//
    const [isSuccessfull, setIsSuccessfull] = useState(true);//

    const handleErrors = response => {
        console.log("Inside 'apiCore' 'handleErrors()'", response);
        if (!response.ok) {
            throw Error(response.status);
        }
        return response;
      };

      /*
    // intilializes the show property of each ticket type to "false"
    const initializeDisplays = (events) => {
        let tempObject = {};
        events.forEach((item, index) => {
        tempObject[item.eventNum] = false;
        })
        setTicketDisplay(tempObject);
    }
*/

 
    useEffect(() => {

      if (localStorage.getItem(`eventNum`) !== null) {
        let tempEventNum = JSON.parse(localStorage.getItem("eventNum"));
        let tempEvents = JSON.parse(localStorage.getItem("events"));
        let tempEventPosition;
        let tempEventNumbers = [];
        tempEvents.forEach((event, index) => {
          tempEventNumbers.push({eventNum: event.eventNum, eventTitle: event.eventTtile});
          if(event.eventNum === tempEventNum) {
            console.log("Found a match: ", event);
            setEventDescription(event);
          }
        })
        setAllEvents(tempEventNumbers);
        console.log("All Events: ", tempEventNumbers)
      }
      else {
        console.log("Did not find a valid event to edit")
      }


         /*

         
      if (localStorage.getItem(`editEvent`) !== null) {
        let tempEvent = JSON.parse(localStorage.getItem("editEvent"));
        loadEventInfo(tempEvent);
        console.log("found a valid event to edit")
      }
      else {
        console.log("Did not find a valid event to edit")
      }




        */
        }, []);

        /*
  
        const editEvent = (item) => {
          if (typeof window !== "undefined") {
            console.log("JSON.stringify(item): ", JSON.stringify(item));
            localStorage.setItem("editEvent", JSON.stringify(item));
            window.location.href = `/eventedit/?eventID=${item.eventNum}`;
          }
          // NEED TO DETERMINE WHAT HAPPENS IF THERE IS NO WINDOW
        }
        */

        
  
    const editEvent = (item) => {
      window.location.href = `/eventedit/?eventID=${eventDescription.eventNum}`;
      }

    const mainDisplay = () => {
        //if (!isLoading && isSuccessfull) {
            return (
              <div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Details</div>
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>Sun, Dec 27, 2020 7:00 PM</div>
                    
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>{eventDescription.startDateTime}</div>
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>{eventDescription.eventNum}</div>
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>{eventDescription.locationVenueName}</div>
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>Event Status: Live</div>


                <button
                                        style={{
                                            fontSize: "14px",
                                            textAlign: "left",
                                            fontWeight: "400",
                                            paddingLeft: "30px",
                                            backgroundColor: "white",
                                            color: "blue",
                                            border: "none",
                                            cursor: "pointer",
                                            display: "inlineBlock",
                                            outline: "none",
                                        }}
                                        onClick={() => {
                                          
                                          window.location.href = `/eventedit/?eventID=${eventDescription.eventNum}`}}
                                    >
                                        Edit Event
                                    </button>
                <br></br>
                <br></br>

                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Sales by Ticket Type</div>

                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>
                      {eventDescription.tickets.map((ticket,index) => {
                        return <div>{ticket.ticketName}</div>
                      })}
                    </div>
                    <br></br>
                    <br></br>
                

                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Sales by Payment Type</div>
                <br></br>
                <br></br>
                
                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Current Ticket Promotions</div>
                <br></br>
                <br></br>

                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Manual Ticket Order</div>
                <br></br>
                <div style={{fontWeight: "600", paddingLeft: "30px"}}>Recipient:</div>
                <div style={{display: "grid", gridGap: "4%", gridTemplateColumns: "48% 48%", paddingLeft: "30px", paddingRight: "30px"}}>
                  <div className="form-group">
                    <br></br>
                    <label styles={{ fontSize: "16px" }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <br></br>
                    <label styles={{ fontSize: "16px" }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                    />
                  </div>
                </div>
                <div style={{paddingLeft: "30px", paddingRight: "30px"}}>
                  <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                  />
                </div>
                </div>
                <br></br>
                <div style={{fontWeight: "600", paddingLeft: "30px"}}>Payment Type:</div>

                <select
                    type="payment"
                    name="paymentType"
                    required
                  >
                    <option>Cash US$</option>
                    <option>CashApp</option>
                    <option>Venmo</option>
                    <option>BitCoin</option>
                    <option>Ehtereum</option>
                    <option>Other</option>
                  </select>
                <br></br>
                <br></br>
                <div style={{fontWeight: "600", paddingLeft: "30px"}}>Order Entry:</div>
                <br></br>
                <div style={{display: "grid", gridTemplateColumns: "300px 100px 150px", columnGap: "20px", paddingLeft: "30px", fontSize: "16px"}}>
                  <div>Ticket Type</div>
                  <div># of Tickets</div>
                  <div>Total $ Amount</div>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "300px 100px 150px", columnGap: "20px", paddingLeft: "30px", fontSize: "16px"}}>
                  <select
                    type="payment"
                    name="paymentType"
                    required
                  >
                    <option>General Admission: $10</option>
                    <option>Assigned Seating: $20</option>
                    <option>Box Seating: $50</option>
                  </select>

                  <select
                    type="number"
                    name="ticketAmount"
                    required
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                  </select>
                  <div></div>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "300px 100px 150px", columnGap: "20px", paddingLeft: "30px", fontSize: "16px"}}>
                  <div></div>
                  <div></div>
                  <div style={{fontSize: "14px"}}>full price</div>
                </div>
                <br></br>
                <div><button>Add to Order</button></div>
                <br></br>
                <div style={{fontWeight: "600", paddingLeft: "30px"}}>Current Order:</div>                <br></br>
                <div style={{display: "grid", gridTemplateColumns: "300px 100px 150px", columnGap: "20px", paddingLeft: "30px", fontSize: "16px"}}>
                  <div>Ticket Type</div>
                  <div># of Tickets</div>
                  <div>Total $ Amount</div>
                </div>
                <br></br>
                <div><button>Submit Order</button></div>
              </div>
            )
            /*
        } else if (!isLoading && isSuccessfull) {
            //console.log("eventDescriptions.length: zero: ", eventDescriptions.length);
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
        */
    }

    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                EVENT DASHBOARD
            </div>
            
            <div className={classes.DisplayPanel2}>
                <div className={classes.DashboardHeader}>
                    <div style={{paddingBottom: "5px"}}>
                      <div style={{fontSize: "22px", fontWeight: "600"}}>{eventDescription.eventTitle}</div>
                    </div>
                    <div>


                                  <button
                                        style={{
                                            fontSize: "14px",
                                            textAlign: "left",
                                            fontWeight: "400",
                                            paddingLeft: "0px",
                                            color: "blue",
                                            border: "none",
                                            backgroundColor: "#E7E7E7",
                                            cursor: "pointer",
                                            display: "inlineBlock",
                                            outline: "none",
                                        }}
                                        onClick={() => {
                                            setShowEventModal(!showEventModal)}}
                                    >
                                        Switch Event
                                    </button>

                                    </div>
                    {showEventModal ? null : null}
                </div>
                {mainDisplay()}
            </div>
        </div>
    )
}

export default EventDashboard;