import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";

import { API } from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faEllipsisV,
  faCog
} from "@fortawesome/free-solid-svg-icons";

import BuyerNavigation from "./BuyerNavigation";
import classes from "./BuyerDashboard.module.css";
import { compareValues, getDates } from "../VendorFunctions";

let vendorInfo = {};

const VendorEvents = () => {

  const [eventDescriptions, setEventDescriptions] = useState();//
  const [ticketDisplay, setTicketDisplay] = useState();
  const [isLoading, setIsLoading] = useState(true);//
  const [isSuccessfull, setIsSuccessfull] = useState(true);//

  useEffect(() => {


    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      vendorInfo.token = tempUser.token;
      vendorInfo.email = tempUser.user.email
      vendorInfo.name = tempUser.user.name
      vendorInfo.role = tempUser.user.role
      vendorInfo.id = tempUser.user._id;
      console.log("vendorInfo.name: ", tempUser.user.name)
      if (vendorInfo.role === 1) {
        return <Redirect to="/vendorevents" />;
      } else if (vendorInfo.role !== 0) {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/signin";
    }

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

// profile, create, temp
const [paneView, setPaneView] = useState("profile")

const mainDisplay = () => {
  if (paneView === "profile") {
    return (
      <div className={classes.DashboardPanel}>
      <div className={classes.DashboardPanelHeader}>
        My Profile
      </div>
      <div style={{ overflowY: "auto" }}>
        <div className={classes.GenericDisplayHeader}>
          <div>Name:{" "}{vendorInfo.name}</div>
          <br></br>
          <div>E-mail:{" "}{vendorInfo.email}</div>
          <br></br>
        </div>
      </div>
    </div>
    )
  } else if (paneView === "create") {
    return (
      <div className={classes.DashboardPanel}>
      <div className={classes.DashboardPanelHeader}>
        Create Event
      </div>
      <div style={{ overflowY: "auto" }}>
        <div className={classes.GenericDisplayHeader}>
          will ask user to first complete the onboarding process
        </div>
      </div>
    </div>
    )
  } else if (paneView === "wallet") {
    return (
      <div className={classes.DashboardPanel}>
      <div className={classes.DashboardPanelHeader}>
        Ticket Wallet
      </div>
      <div style={{ overflowY: "auto" }}>
        <div className={classes.GenericDisplayHeader}>
          Ticket Wallet coming soon!!!
        </div>
      </div>
    </div>
    )
  } else if (paneView === "preferences") {
    return (
      <div className={classes.DashboardPanel}>
      <div className={classes.DashboardPanelHeader}>
        My Preferences
      </div>
      <div style={{ overflowY: "auto" }}>
        <div className={classes.GenericDisplayHeader}>
          Preferences coming soon!!!
        </div>
      </div>
    </div>
    )
  } else {
    return null;
  }
}

const onboardingMessage = () => {
  if (true) {
    return (
      <div style={{zIndex: "400"}}>Onboarding</div>
    )
  }
}

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
        <div className={classes.DashboardTitle}>
          {vendorInfo.name} Dashboard
        </div>
        <div className={classes.DashboardMain}>
          <div className={classes.DashboardNavigation}>
            <BuyerNavigation
              pane={paneView}
              clicked={(event) => {
                console.log("Clicked button")
                console.log("event: ", event.target)
                setPaneView(event.target.name)
              }}></BuyerNavigation>
          </div>
          <div>
            {mainDisplay()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorEvents;