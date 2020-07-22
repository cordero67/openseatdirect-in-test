import React, { useState, useEffect } from "react";

import { API } from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faEllipsisV,
  faCog
} from "@fortawesome/free-solid-svg-icons";

import VendorNavigation from "../VendorNavigation";
import classes from "./Buyer.module.css";
import { compareValues, getDates } from "../VendorFunctions";

let vendorInfo = {};

const VendorEvents = () => {

  const [eventDescriptions, setEventDescriptions] = useState();//
  const [ticketDisplay, setTicketDisplay] = useState();
  const [isLoading, setIsLoading] = useState(true);//
  const [isSuccessfull, setIsSuccessfull] = useState(true);//

  useEffect(() => {
    /*
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      vendorInfo.token = tempUser.token;
      vendorInfo.id = tempUser.user._id;
      vendorInfo.name = tempUser.user.name
      console.log("vendorInfo.name: ", tempUser.user.name)
    } else {
      window.location.href = "/signin";
    }
    */
    /*
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
        let js = JSON.parse(result);
        js.sort(compareValues("startDateTime", "asc"));
        console.log("eventDescriptions ordered: ", js);
        setEventDescriptions(js);
        initializeDisplays(js);
        setIsSuccessfull(true)
        setIsLoading(false);
        return js;
      })
      .catch((error) => {
        console.log("error", error);
        setIsSuccessfull(false)
        setIsLoading(false);
      });
      */
  }, []);

  

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
  
  const editEvent = (item) => {
    if (typeof window !== "undefined") {
      console.log("JSON.stringify(item): ", JSON.stringify(item));
      localStorage.setItem("editEvent", JSON.stringify(item));
      window.location.href = `/eventedit/?eventID=${item.eventNum}`;
    }
    // NEED TO DETERMINE WHAT HAPPENS IF THERE IS NO WINDOW
  }

  /*
  const mainDisplay = () => {
    if (!isLoading && isSuccessfull) {
      return (
        <div>
          <div className={classes.MainDisplayHeader}>
            <div style={{ textAlign: "center" }}>Date</div>
            <div></div>
            <div className={classes.Expand}>Event</div>
            <div style={{ textAlign: "center" }}>Status</div>
            <div style={{ textAlign: "center" }}>Edit</div>
          </div>

          <div></div>
          <div style={{ marginTop: "110px", overflowY: "auto" }}>
            {eventDescriptions.map((item, index) => {

              let shortMonth, dayDate, longDateTime;
              [shortMonth, dayDate, longDateTime] = getDates(item);

              return (
                <div key={index}>
                  <div className={classes.MainDisplay}
                  >
                    <div style={{ textAlign: "center" }}>
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
                      <span style={{ fontSize: "18px", color: "black" }}>
                        {dayDate}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", textAlign: "center" }}>
                      {ticketDisplay[item.eventNum] === true ? (
                        <FontAwesomeIcon
                          color="black"
                          size="sm"
                          cursor="pointer"
                          onClick={() => {
                            let tempDisplay = {...ticketDisplay};
                            tempDisplay[item.eventNum] = false;
                            setTicketDisplay(tempDisplay);
                          }}
                          icon={faChevronUp}
                        />
                      ) : (
                        <FontAwesomeIcon
                          color="black"
                          size="sm"
                          cursor="pointer"
                          onClick={() => {
                            let tempDisplay = {...ticketDisplay};
                            tempDisplay[item.eventNum] = true;
                            setTicketDisplay(tempDisplay);
                          }}
                          icon={faChevronDown}
                        />
                      )}
                    </div>
                    <div
                      className={classes.Expand}
                      style={{ fontSize: "16px" }}
                    >
                      {item.eventTitle}
                      <br></br>
                      <span style={{ fontSize: "13px", fontWeight: "500" }}>
                        {longDateTime}
                      </span>
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "500" }}>
                      {item.isDraft ? <span style={{color: "blue"}}>Draft</span>: <span style={{color: "green"}}>Live</span>}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <FontAwesomeIcon
                        style={{ zIndex: "100" }}
                        color="blue"
                        size="lg"
                        cursor="pointer"
                        onClick={() => editEvent(item)}
                        icon={faCog}
                      />
                    </div>
                  </div>
                  <div>
                    {ticketDisplay[item.eventNum] === true ? (
                      <div style={{ fontSize: "14px" }}>
                        {listTicketTypes(item)}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (!isLoading && !isSuccessfull) {
      return (
        <div className={classes.SystemDownMessage}>
          <div>System error please refresh this page.</div>
        </div>
      )
    } else {
      return null;
    }
  };

  const listTicketTypes = (event) => {
    if (event.tickets.length > 0) {
      return (
        <div style={{ paddingBottom: "5px" }}>
          {event.tickets.map((ticket, index) => {
            return (
              <div
                key={index}
                className={classes.TicketTypes}
              >
                <div></div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 380px",
                    borderBottom: "1px solid lightgrey",
                  }}
                >
                  <div style={{ textAlign: "right", paddingRight: "5px" }}>
                    ${ticket.currentTicketPrice.toFixed(2)}
                    {":"}
                  </div>
                  <div style={{ textAlign: "left", paddingLeft: "5px" }}>
                    {ticket.ticketName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div>
          <div className={classes.NoTickets}>
            No tickets exist for this event.
          </div>
        </div>
      );
    }
  };
  */

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
        <div className={classes.DashboardTitle}>
          {vendorInfo.name} Rafael Cordero: Dashboard
        </div>
        <div className={classes.DashboardMain}>
          <div className={classes.DashboardNavigation}>
            <VendorNavigation></VendorNavigation>
          </div>
          <div className={classes.DashboardPanel}>
            <div className={classes.DashboardPanelHeader}>
              My Events
            </div>
            <div style={{ overflowY: "auto" }}>Main Display</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorEvents;

/*
<div style={{ overflowY: "auto" }}>{mainDisplay()}</div>
*/