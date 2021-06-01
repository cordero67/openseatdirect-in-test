import React, { useState, useEffect, Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import classes from "./VendorNavigation.module.css";

const VendorNavigation = (props) => {
  return (
    <Fragment>
      <div className={classes.DashboardTitle}>
        <FontAwesomeIcon color="white" cursor="pointer" icon={faHome} /> My
        Account
      </div>

      <ul className={classes.NavigationBar}>
        <div className={classes.NavigationItems}>
          <li>
            <button
              className={
                props.pane === "events" ||
                props.pane === "salesAnalytics" ||
                props.pane === "ticketSales" ||
                props.pane === "issueTickets" ||
                props.pane === "editEvent"
                  ? classes.NavigationButtonActive
                  : classes.NavigationButton
              }
              name="events"
              onClick={props.clicked}
            >
              My Events
            </button>
          </li>

          <li>
            <button
              className={
                props.pane === "create"
                  ? classes.NavigationButtonActive
                  : classes.NavigationButton
              }
              name="create"
              onClick={props.clicked}
            >
              Create Event
            </button>
          </li>

          <li>
            <button
              className={
                props.pane === "account"
                  ? classes.NavigationButtonActive
                  : classes.NavigationButton
              }
              name="account"
              onClick={props.clicked}
            >
              Account Settings
            </button>
          </li>
        </div>
      </ul>
    </Fragment>
  );
};

export default VendorNavigation;

/*


          <hr className={classes.HorizontalDivider}/>

          <li>
            <button
              className={(props.pane === "myTickets") ?
                classes.NavigationButtonActive :
                classes.NavigationButton
              }
              name="myTickets"
              onClick={props.clicked}>
              My Tickets
            </button>
          </li>
          */
