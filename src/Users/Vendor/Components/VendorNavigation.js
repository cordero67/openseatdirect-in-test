import React, { Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import classes from "./VendorNavigation.module.css";

const VendorNavigation = (props) => {
  console.log("props: ", props);
  let accountSettings = (
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
  );

  let myTickets = (
    <li>
      <button
        className={
          props.pane === "wallet"
            ? classes.NavigationButtonActive
            : classes.NavigationButton
        }
        name="wallet"
        onClick={props.clicked}
      >
        My Tickets
      </button>
    </li>
  );

  let myEvents = (
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
  );

  let createEvent = (
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
  );

  const upgradeAccount = () => {
    if (props.status !== 8) {
      return (
        <li>
          <button
            className={
              props.pane === "upgrade"
                ? classes.NavigationButtonActive
                : classes.NavigationButton
            }
            name="upgrade"
            onClick={props.clicked}
          >
            Upgrade Account
          </button>
        </li>
      );
    }
  };

  return (
    <Fragment>
      <div className={classes.DashboardTitle}>
        <FontAwesomeIcon color="white" cursor="pointer" icon={faHome} /> My
        Account
      </div>

      <ul className={classes.NavigationBar}>
        <div className={classes.NavigationItems}>
          {myEvents}
          {createEvent}
          {accountSettings}
          {upgradeAccount()}
          <hr className={classes.HorizontalDivider} />
          {myTickets}
        </div>
      </ul>
    </Fragment>
  );
};

export default VendorNavigation;
