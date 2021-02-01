import React, { useState, useEffect, Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import classes from "./VendorNavigation.module.css";

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
      tempBuyerInfo.name = tempUser.user.accountId.accountName
      setBuyerInfo(tempBuyerInfo);
    } else {
      window.location.href = "/auth";
    }
    setIsLoading(false);
  }, []);
  
  return (
    <Fragment>

      <div className={classes.DashboardTitle}>
        <FontAwesomeIcon
          color="white"
          cursor="pointer"
          icon={faHome}
        />{" "}My Account
      </div>

      <ul className={classes.NavigationBar}>
        <div className={classes.NavigationItems}>

          <li>
            <button
              className={(
                props.pane === "events" ||
                props.pane === "salesAnalytics" ||
                props.pane === "ticketSales" ||
                props.pane === "issueTickets" ||
                props.pane === "editEvent"
              ) ?
                classes.NavigationButtonActive :
                classes.NavigationButton
              }
              name="events"
              onClick={props.clicked}>
              My Events
            </button>
          </li>

          <li>
            <button
              className={(props.pane === "create") ?
                classes.NavigationButtonActive :
                classes.NavigationButton
              }
              name="create"
              onClick={props.clicked}>
              Create Event
            </button>
          </li>

          <li>
            <button
              className={(props.pane === "account") ?
                classes.NavigationButtonActive :
                classes.NavigationButton
              }
              name="account"
              onClick={props.clicked}>
              Account Settings
            </button>
          </li>

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

        </div>
      </ul>
    </Fragment>
  );
};

export default VendorNavigation;

/*

      <div className={classes.NavigationTitle}>
        {!isLoading ? null : null}
      </div>

  <li>
    <button
      className={(props.pane === "orders") ?
        classes.NavigationButtonActive :
        classes.NavigationButton
      }
      name="orders"
      onClick={props.clicked}>
      Past Orders
    </button>
  </li>
*/