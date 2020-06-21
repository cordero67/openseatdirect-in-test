import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";

import { API } from "../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";

import VendorNavigation from "./VendorNavigation";

import classes from "./User.module.css";
import { closestIndexTo } from "date-fns";

let userId = JSON.parse(localStorage.getItem("user")).user._id;
let token = JSON.parse(localStorage.getItem("user")).token;

const VendorEvents = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthAbbr = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let vendorInfo = {};
  let tempUser = {};
  tempUser = JSON.parse(localStorage.getItem("user"));
  vendorInfo.token = tempUser.token;
  vendorInfo.name = tempUser.user.name;
  vendorInfo.email = tempUser.user.email;
  vendorInfo.role = tempUser.user.role;
  vendorInfo.id = tempUser.user._id;

  //const [vendorInfo, setVendorInfo] = useState();
  const [eventDescriptions, setEventDescriptions] = useState();//
  const [ticketDisplay, setTicketDisplay] = useState();
  const [isLoading, setIsLoading] = useState(true);//
  const [isSuccessful, setIsSuccessful] = useState(true);//
  //const [activeEvent, setActiveEvent] = useState("");
  //const [activeTickets, setActiveTickets] = useState([]);
  //const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let fetchstr =  `${API}/event/all/${userId}`;
    console.log("about to fetch: ", fetchstr, requestOptions);

    fetch(fetchstr, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        console.log("eventDescriptions: ", js);
        js.sort(compareValues("startDateTime", "asc"));
        console.log("js: ", js);
        setEventDescriptions(js);
        initializeDisplays(js);
        setIsSuccessful(true)
        setIsLoading(false);
        return js;
      })
      .catch((error) => {
        console.log("error", error);
        setIsSuccessful(false)
        setIsLoading(false);
      });
  }, []);

  const initializeDisplays = (events) => {
    let tempObject = {};
    events.forEach((item, index) => {
      tempObject[item.eventNum] = false;
    })
    setTicketDisplay(tempObject);
    console.log("tempObject: ", tempObject)
  }

  const compareValues = (key, order) => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  };

  /*
  const parseTicketDetails = (tickets) => {
    if (tickets.length > 0) {
      let ticketTypes = [];
      let ticketArray = [];
      tickets.map((ticket, index) => {
        if (!ticketTypes.includes(ticket.ticketName)) {
          ticketTypes.push(ticket.ticketName);
          ticketArray.push({
            name: ticket.ticketName,
            sold: 0,
            revenue: 0,
          });
        }
        ticketArray.forEach((item, index) => {
          if (item["name"] === ticket.ticketName) {
            item["sold"] += 1;
            item["revenue"] += ticket.price;
            item["price"] = ticket.price;
          }
        });
      });
      console.log("ticketTypes: ", ticketTypes);
      console.log("ticketArray: ", ticketArray);
      setActiveTickets(ticketArray);
    } else {
      console.log("No ticket sales");
    }
  };
*/
  const mainDisplay = () => {
    if (!isLoading) {
      return (
        <div>
          <div
            style={{
              zIndex: "200",
              display: "grid",
              position: "fixed",
              top: "195px",
              columnGap: "10px",
              backgroundColor: "#f8f8f8",
              borderBottom: "1px solid lightgrey",
              width: "1015px",
              gridTemplateColumns: "60px 20px 480px 190px 80px",
              fontSize: "15px",
              paddingTop: "15px",
              paddingBottom: "15px",
              paddingLeft: "20px",
              paddingRight: "30px",
            }}
          >
            <div style={{ textAlign: "center" }}>Date</div>
            <div></div>
            <div className={classes.Expand}>Event</div>
            <div style={{ textAlign: "center" }}>Status</div>
            <div style={{ textAlign: "center" }}>Edit</div>
          </div>

          <div></div>
          <div style={{ marginTop: "110px", overflowY: "auto" }}>
            {eventDescriptions.map((item, index) => {
              let tempDateTime;
              let tempMonthAbbr;
              let tempMonthNames;
              let tempDate;
              let tempDay;
              let tempYear;
              let tempAmPm;
              let tempHours;
              let tempMinutes;
              let tempLongDateTime;
              tempDateTime = new Date(item.startDateTime);
              tempMonthAbbr = monthAbbr[tempDateTime.getMonth()];
              tempMonthNames = monthNames[tempDateTime.getMonth()];
              tempDate = tempDateTime.getDate();
              tempDay = weekDays[tempDateTime.getDay()];
              tempYear = tempDateTime.getFullYear();
              if (tempDateTime.getHours() > 12) {
                tempHours = tempDateTime.getHours() - 12;
                tempAmPm = "PM";
              } else {
                tempHours = tempDateTime.getHours();
                tempAmPm = "AM";
              }
              if (tempDateTime.getMinutes() > 9) {
                tempMinutes = tempDateTime.getMinutes();
              } else {
                tempMinutes = "0" + tempDateTime.getMinutes();
              }

              tempLongDateTime =
                tempDay +
                ", " +
                tempMonthNames +
                " " +
                tempDate +
                ", " +
                tempYear +
                " - " +
                tempHours +
                ":" +
                tempMinutes +
                tempAmPm;

              return (
                <div key={index}>
                  <div
                    style={{
                      display: "grid",
                      columnGap: "10px",
                      backgroundColor: "#fff",
                      gridTemplateColumns:
                        "60px 20px 480px 190px 80px",
                      fontSize: "16px",
                      paddingTop: "15px",
                      paddingLeft: "20px",
                      paddingBottom: "10px",
                      paddingRight: "30px",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "red",
                        }}
                      >
                        {tempMonthAbbr}
                      </span>
                      <br></br>
                      <span style={{ fontSize: "18px", color: "black" }}>
                        {tempDate}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", textAlign: "center" }}>
                      {ticketDisplay[item.eventNum] === true ? (
                        <FontAwesomeIcon
                          className={classes.faChevronUp}
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
                          className={classes.faChevronUp}
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
                        {tempLongDateTime}
                      </span>
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "500" }}>
                      {item.isDraft ? "Draft": "Live"}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <FontAwesomeIcon
                        className={classes.faChevronUp}
                        style={{ zIndex: "100" }}
                        color="black"
                        size="lg"
                        cursor="pointer"
                        onClick={() => {
                          console.log("Clicked ellises");
                          console.log("item.eventNum: ", item.eventNum);

                          window.location.href = `/eventedit/?eventID=${item.eventNum}`;
                        }}
                        icon={faEllipsisV}
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
    } else {
      return null;
    }
  };

/*
  <div>
    {activeEvent === item.eventNum ? (
      <div style={{ fontSize: "14px" }}>
        {listTicketTypes()}
      </div>
    ) : null}
  </div>
*/


  const listTicketTypes = (event) => {
    if (event.tickets.length > 0) {
      return (
        <div style={{ paddingBottom: "5px" }}>
          {event.tickets.map((ticket, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  columnGap: "10px",
                  backgroundColor: "#f8f8f8",
                  width: "1015px",
                  gridTemplateColumns: "90px 480px",
                  fontSize: "16px",
                  paddingTop: "4px",
                  paddingLeft: "20px",
                  paddingBottom: "1px",
                  paddingRight: "30px",
                }}
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
          <div
            style={{
              paddingLeft: "120px",
              backgroundColor: "#f8f8f8",
              fontSize: "16px",
              paddingTop: "5px",
              paddingBottom: "5px",
              paddingRight: "30px",
            }}
          >
            No tickets exist for this event.
          </div>
        </div>
      );
    }
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
                position: "fixed",
                top: "135px",
                backgroundColor: "#fff",
                zIndex: "200",
                width: "1015px",
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
                paddingBottom: "20px",
                borderBottom: "1px solid lightgrey",
              }}
            >
              Events
            </div>
            <div style={{ overflowY: "auto" }}>{mainDisplay()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorEvents;

/*

  const handleGetAttendees = (eventNum) => {
    console.log("vendorInfo: ", vendorInfo);
    setActiveTickets("");
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + vendorInfo.token);
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    console.log(myHeaders);

    let fetchstr = `${API}/eventdoor/${eventNum}/attendees/${vendorInfo.id}`
    console.log("about to fetch: ", fetchstr, requestOptions);
    fetch(fetchstr, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        setTicketDetails(js);
        let tempDetails = [...js];
        parseTicketDetails(js);
        setActiveEvent(eventNum);
        localStorage.setItem("event", JSON.stringify(eventNum));
        console.log("eventNum: ", eventNum);
        eventDetails.forEach((item, index) => {
          if (item.eventNum === eventNum) {
            console.log("Associated event details: ", item);
          }
        });
      })
      .catch((error) => {
        console.log("error", error);
        //SIGNOK = false;
      });
  };
*/