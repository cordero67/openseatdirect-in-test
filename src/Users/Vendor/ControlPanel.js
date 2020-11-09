import React, { useState, useEffect } from "react";
import { Redirect, Fragment, Link } from "react-router-dom";

import { API } from "../../config";

import VendorNavigation from "./VendorNavigation";
import Account from "./Account";
import Events from "./Events";
import EventDashboard from "./EventDashboard";
import Orders from "./Orders";
import Profile from "./Profile";
import CreateEvent from "../../EventCreation/CreateEvent";
import classes from "./ControlPanel.module.css";

const ControlPanel = () => {

  const [isLoading, setIsLoading] = useState(true);

  const [paneView, setPaneView] = useState("dashboard")

  useEffect(() => {
    setIsLoading(true);
    if (
      typeof window === "undefined" ||
      localStorage.getItem(`user`) === null
    ) {
      window.location.href = "/signin";
    }
    setIsLoading(false);
  }, []);

const MainDisplay = () => {
  if(!isLoading) {
    if (paneView === "profile") {
      return (
        <Profile
        />
      )
    } else if (paneView === "account") {
      return (
        <Account/>
      )
    } else if (paneView === "events") {
      return (
        <Events
          clicked={() => {
            setPaneView("dashboard")
          }}
        />
      )
    } else if (paneView === "dashboard") {
      return (
        <EventDashboard
        clicked={() => {
          setPaneView("events")
        }}
      />
      )
    } else if (paneView === "orders") {
      return (
        <Orders/>
      )
    } else if (paneView === "profile") {
      return (
        <Profile/>
      )
    } else if (paneView === "create") {
      return (
        <CreateEvent/>
      )
  } else {
      return null;
    }
  } else {
    return null
  }
}

const Navigation = () => {
  if(!isLoading) {
    return (
        <VendorNavigation
          name="My Name"
          pane={paneView}
          clicked={(event) => {
            console.log("Clicked button")
            console.log("event: ", event.target)
            console.log("event.name: ", event.target.name)
            setPaneView(event.target.name)
          }}
        />
    )
  } else {return null}
}

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
          {Navigation()}
          {MainDisplay()}
      </div>
    </div>
  );
};

export default ControlPanel;