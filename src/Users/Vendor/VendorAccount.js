import React, { useState, useEffect } from "react";

import Events from "./Events";
import SalesAnalytics from "./SalesAnalytics";
import TicketSales from "./TicketSales";
import IssueTickets from "./IssueTickets";
import EditEvent from "../../EventCreation/EditEvent";
import Orders from "./Orders";
import CreateEvent from "../../EventCreation/CreateEvent";
import Account from "./Account";
import MyTickets from "../ComponentPages/MyTickets";
import VendorNavigation from "./Components/VendorNavigation";

import classes from "./VendorAccount.module.css";

const VendorAccount = () => {
  const [paneView, setPaneView] = useState("events")

  const getStatus= (user) => { 
    if ('accountId' in user && 'status' in user.accountId ) {
        return user.accountId.status
    } else {
        return 0;
    } 
  }

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if (!(getStatus(tempUser.user) === 7) &&
        !(getStatus(tempUser.user) === 8)) {
        window.location.href = "/personal";
      }
    } else {
      window.location.href = "/auth";
    }
  }, []);

const MainDisplay = () => {
  if (paneView === "events") {
    return (
      <Events
        salesAnalytics={() => {
          setPaneView("salesAnalytics")
        }}
        ticketSales={() => {
          setPaneView("ticketSales")
        }}
        issueTickets={() => {
          setPaneView("issueTickets")
        }}
        editEvent={() => {
          setPaneView("editEvent")
        }}
      />
    )
  } else if (paneView === "salesAnalytics") {
    return (
      <SalesAnalytics/>
    )
  } else if (paneView === "ticketSales") {
    return (
      <TicketSales
        clicked={() => {
          setPaneView("events")
        }}
      />
    )
  } else if (paneView === "issueTickets") {
    return (
      <IssueTickets
        clicked={() => {
          setPaneView("events")
        }}
      />
    )
  } else if (paneView === "editEvent") {
    return (
      <EditEvent
        clicked={() => {
          setPaneView("events")
        }}
      />
    )
  } else if (paneView === "orders") {
    return (
      <Orders/>
    )
  } else if (paneView === "create") {
    return (
      <CreateEvent/>
    )
  } else if (paneView === "account") {
    return (
      <Account/>
    )
  } else if (paneView === "myTickets") {
    return (
      <MyTickets/>
    )
  } else {
    return null;
  }
}

const Navigation = (
  <VendorNavigation
    pane={paneView}
    clicked={(event) => {
      setPaneView(event.target.name)
    }}
  />
)

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
          {Navigation}
          {MainDisplay()}
      </div>
    </div>
  );
};

export default VendorAccount;