import React, { useState, useEffect, Fragment } from "react";
import dateFormat from "dateformat";

import VendorNavigation from "./VendorNavigation";

import { API } from "../config";
import classes from "./User.module.css";

const VendorEventDetails = () => {
  // will bold vendor info from local storage, flat file
  let tempInfo = JSON.parse(localStorage.getItem("user"));
  let vendorInfo = {
    token: tempInfo.token,
    name: tempInfo.user.name,
    email: tempInfo.user.email,
    role: tempInfo.user.role,
    id: tempInfo.user._id,
  };
  console.log("vendorInfo: ", vendorInfo);


  // determines if data is being requested from server
  const [isLoading, setIsLoading] = useState(false);
  console.log("isLoading: ", isLoading);

  // information about every event
  const [eventDetails, setEventDetails] = useState();
  console.log("eventDetails: ", eventDetails);

  // stores details of selected event
  const [selectedEvent, setSelectedEvent] = useState("");
  console.log("selectedEvent: ", selectedEvent);

  // stores details of tickets of selected event
  const [selectedTickets, setSelectedTickets] = useState("");
  console.log("selectedTickets: ", selectedTickets);

  // stores ticket sales of selected event
  const [selectedSales, setSelectedSales] = useState("");
  console.log("selectedSales: ", selectedSales);

  // summarizes ticket sales of selected event
  const [selectedSalesParsed, setSelectedSalesParsed] = useState("");
  console.log("selectedSalesParsed: ", selectedSales);

  // retrieves details of all events associated with the vendor
  // no ticket specific information isretrieved
  useEffect(() => {
    setIsLoading(true);
    console.log("set 'isloading' to true")
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + vendorInfo.token);
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let fetchstr =
      `${API}/event/all/${vendorInfo.id}`;
    console.log("about to fetch: ", fetchstr, requestOptions);
    // requests event details
    fetch(fetchstr, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        console.log("eventDetails from server: ", js);
        setEventDetails(js);
        console.log("set 'EventDetails'");
        //SIGNOK = true;
        return js;
      })
      .then((js) => {
        // checks if an event number ("event") is saved in local storage
        if ((typeof window !== "undefined") && localStorage.getItem("event")) {
          let tempEvent = JSON.parse(localStorage.getItem("event"));
          console.log("found event in local starage: ",tempEvent)
          js.forEach((item, index) => {
            //searches for event from "eventDetails" that matches 'event" 
            if (parseInt(item.eventNum) === parseInt(tempEvent)) {
              // once a match is found, "selectedEvent" is defined
              console.log("found a match: ", item.eventNum, " and ", tempEvent)
              setSelectedEvent(item)
              localStorage.removeItem("event");
            }
          })
          // calls function to set "selectedEvent", "selectedTickets" and "selectedSales"
          console.log("calls the 'getTicketDetails' function")
          getTicketDetails(tempEvent, js);
        } else {
          // no event stored in local storage
          console.log("no event in local storage")
          setIsLoading(false);}
        }
      )
      .catch((error) => {
        console.log("error", error);
        //SIGNOK = false;
        setIsLoading(false);
      });
  }, []);

  // retrieves all ticket details and associated sales for a given event
  const getTicketDetails = (selectedEvent) => {
    console.log("selectedEvent: ",  selectedEvent)
    console.log("inside 'getTicketDetails' function")
    console.log("set 'isloading' to true")
    setIsLoading(true);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + vendorInfo.token);
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let fetchstr1 =
      `${API}/event/${vendorInfo.id}/tickets/${selectedEvent}`;
    console.log("about to fetch: ", fetchstr1, requestOptions);
    // requests ticket details of a specific event
    fetch(fetchstr1, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        console.log("js: ", js);
        // stores data into "selectedTickets"
        setSelectedTickets(js);
        return js
      })
      .then((js) => {
        console.log("about to retrieve ticket sales, selectedEvent: ", selectedEvent)
        getTicketSales(selectedEvent);
        return js
      })
      .then((js) => {
        console.log("4th get ticket sales")
        // selectedEvent
        console.log("sets isLoading to false")
        setIsLoading(false);
      })
      .catch((error) => {
        //console.log("error", error);
        //SIGNOK = false;
        setIsLoading(false);
      });
  }

  const getTicketSales = (eventNum) => {
    console.log("eventNum: ",eventNum)
    console.log("inside 'getTicketSales':", getTicketSales);
    console.log("selectedEvent: ", eventNum);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + vendorInfo.token);
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let fetchstr =
      `${API}/eventdoor/${eventNum}/attendees/${vendorInfo.id}`;
    console.log("about to fetch: ", fetchstr, requestOptions);

    fetch(fetchstr, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        console.log("js ticket sales: ", js);
        setSelectedSales(js);
        let tempDetails = [...js];
        let tempEventD = [...eventDetails]
        console.log("eventDetails: ", tempEventD);
        tempEventD.forEach((item, index) => {
          if (item.eventNum === eventNum) {
            console.log("Associated event details: ", item)
          };
          console.log("inside forEach");
        });
      /*
        //parseTicketDetails(js);
        //setActiveTicket(eventNum);
        //  }*/
      })
      .catch((error) => {
        console.log("error", error);
        //SIGNOK = false;
      });
    return eventNum;
  };
      

  // changes "selectedEvents" and calls function to change "selectedDetails"
  const changeSelection = (event) => {
    eventDetails.map((item, index) => {
      // finds the specific event in "eventDetails"
      if (parseInt(item.eventNum) === parseInt(event.target.value)) {
        setSelectedEvent(item);
        getTicketDetails(item.eventNum);
        //setTicketSales();
        //getTicketSales(event.target.value);
      }
    })
  }


  
  // converts the start and end date/times to a single string
  const dates = (start, end) => {
    if (dateFormat(start, "m d yy", true) === dateFormat(end, "m d yy", true)) {
      return (
        <Fragment>
          {dateFormat(start, "ddd, mmm d, yyyy - h:MM TT", true)} to{" "}
          {dateFormat(end, "shortTime", true)}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {dateFormat(start, "ddd, mmm d, yyyy - h:MM TT", true)} to{" "}
          {dateFormat(end, "ddd, mmm d, yyyy - h:MM TT", true)}
        </Fragment>
      )
    }
  }

  // populates right side of dashboard canvas with selected event info
  const eventDisplay = () => {
    return (
      <div>
      <div style={{fontSize: "22px", paddingBottom: "5px"}}>{selectedEvent.eventTitle}</div>
      <div style={{display: "grid", gridTemplateColumns: "200px 200px", paddingLeft: "20px", paddingBottom: "10px"}}>
        <button className={classes.VendorEventButton}
        style={{textAlign: "left"}}
        onClick={() => {
          setSelectedEvent("");
          setSelectedTickets("");
        }}
        >Edit this Event</button>
        <button className={classes.VendorEventButton}
        onClick={() => {
          setSelectedEvent("");
          setSelectedTickets("");
        }}
        >Select different Event</button>
      </div>
      <div style={{fontSize: "18px", paddingTop: "5px", paddingLeft: "20px"}}>Event</div>
      <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px"}}>{dates(selectedEvent.startDateTime,selectedEvent.endDateTime)}</div>
      <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px"}}>{selectedEvent.locationVenueName}</div>
      <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px"}}>{selectedEvent.locationAddress1}, {selectedEvent.locationCity}, {selectedEvent.locationState}</div>  
      <div style={{display: "grid", columnGap: "10px", gridTemplateColumns: "200px 450px"}}>
        <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px", display: "grid", gridTemplateColumns: "100px 70px"}}>
          <div>Tickets sold:</div>
          <div style={{textAlign: "right"}}>##/{selectedEvent.remainingQuantity}</div>
        </div>
        <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px", display: "grid", gridTemplateColumns: "150px 90px"}}>
          <div>Sales revenue:</div>
          <div style={{textAlign: "right"}}>###</div>
        </div>
      </div>
      <br></br>
      {selectedTickets.map((item, index) => {
        let currentPromo;
        if (item.priceFunction && item.priceFunction.form) {
          currentPromo = item.priceFunction.form;
        } else {
          currentPromo ="none"
        }
        return (
          <div key={index}>

            <div style={{fontSize: "18px", paddingLeft: "20px"}}>{item.ticketName}</div>

            <div style={{display: "grid", columnGap: "10px", gridTemplateColumns: "200px 450px"}}>
              <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px", display: "grid", gridTemplateColumns: "100px 70px"}}>
                <div>Current price:</div>
                <div style={{textAlign: "right"}}>{item.currency}{" "}{item.initialTicketPrice}</div>
              </div>
              <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px", display: "grid", gridTemplateColumns: "150px 90px"}}>
                <div>Current promotion:</div>
                <div style={{textAlign: "right"}}>{currentPromo}</div>
              </div>
            </div>

            <div style={{display: "grid", columnGap: "10px", gridTemplateColumns: "200px 450px"}}>
              <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px", display: "grid", gridTemplateColumns: "100px 70px"}}>
                <div>Tickets sold:</div>
                <div style={{textAlign: "right"}}>##/{item.remainingQuantity}</div>
              </div>
              <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px", display: "grid", gridTemplateColumns: "150px 90px"}}>
                <div>Sales revenue:</div>
                <div style={{textAlign: "right"}}>###</div>
              </div>
            </div>
            <div style={{fontSize: "14px", paddingTop: "5px", paddingLeft: "20px"}}>Recent transactions:</div>
            <br></br>
          </div>)
      })}
      
    </div>)
  }
  
  // determines if the "eventDisplay" should be show or not
  const displayEvent = () => {
    if (!isLoading && eventDetails && selectedEvent) {
      return (
        <div>
          {eventDisplay()}
        </div>
      )
    } else return null
  }


  // good to here

  // populates right side of dashboard canvas with selection box
  const eventSelector = () => {
    if (!isLoading && eventDetails && !selectedEvent) {
      return (
        <div>
          <div style={{fontSize: "22px"}}>Select an Event</div>
          <br></br>
            <select
              style={{
                padding: "9px 5px",
                border: "1px solid lightgrey",
                boxSizing: "borderBox",
                width: "600px",
                fontSize: "16px",
                lineHeight: "1.75",
                cursor: "pointer",
              }}
              type="number"
              id="input box ticket description"
              placeholder="select an event"
              name="an event"
              defaultValue="default"
              value={selectedEvent.eventName}
              onChange={(event) => {
                changeSelection(event);
                console.log("event.target.value: ", event.target.value);
              }}
              required
            >
              {eventDetails.map((event, index) => {
                return (
                  <option key={index} value={event.eventNum} name={event.eventTitle}>
                    {event.eventTitle}
                  </option>
                );
              })}
              
            <option style={{display: "none"}} value="default" disabled>Select an event from list</option>
          </select>
        </div>
      )
    } else return null
  };

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
        <div className={classes.DashboardTitle}>
          {vendorInfo.name} Dashboard
        </div>
        <div className={classes.DashboardMain}>
          <div className={classes.DashboardNavigation}>
            <VendorNavigation></VendorNavigation>
          </div>
          <div className={classes.DashboardPanel}>
            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
              }}
            >
              <div
                style={{
                  paddingBottom: "20px",
                  borderBottom: "1px solid lightgrey",
                }}
              >
                Event Details
              </div>
            </div>
            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
              }}
            >
                  {eventSelector()}
                  {displayEvent()}
              <br></br>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorEventDetails;