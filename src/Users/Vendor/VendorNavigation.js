import React, { useState, useEffect, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { NavLink } from "react-router-dom";

import classes from "./VendorAccountOLD.module.css";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const VendorNavigation = (props) => {

  const [buyerInfo, setBuyerInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempBuyerInfo = {};
      tempBuyerInfo.name = tempUser.user.name
      setBuyerInfo(tempBuyerInfo);
    } else {
      window.location.href = "/signin";
    }
    setIsLoading(false);
  }, []);
  
  return (
    <Fragment>
      <div className={classes.NavigationTitle}>
          {!isLoading ?
            <span
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                lineHeight: "normal",
              }}>
              {buyerInfo.name}
            </span> :
            null}
      </div>

      <div className={classes.DashboardTitle}>
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
          }}>
          <FontAwesomeIcon
            color="white"
            cursor="pointer"
            icon={faHome}
          />{" "}My Account
        </span>
      </div>

      <ul className={classes.NavigationBar}>
        <div className={classes.NavigationItems}>

          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: (props.pane === "events" ||
                props.pane === "salesAnalytics" ||
                props.pane === "ticketSales" ||
                props.pane === "issueTickets" ||
                props.pane === "editEvent")
                ? "#e0e0e0" : "#b8b8b8",


                outline: "none"
              }}
              name="events"
              onClick={props.clicked}>
              My Events
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "myTickets" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="myTickets"
              onClick={props.clicked}>
              My Tickets
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "orders" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="orders"
              onClick={props.clicked}>
              Past Orders
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "create" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="create"
              onClick={props.clicked}>
              Create Event
            </button>
          </li>
          
          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "profile" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="profile"
              onClick={props.clicked}>
              Profile
            </button>
          </li>

          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "account" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="account"
              onClick={props.clicked}>
              Account
            </button>
          </li>
        </div>
      </ul>
    </Fragment>
  );
};

export default VendorNavigation;