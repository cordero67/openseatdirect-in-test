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

  const [buyerInfo, setBuyerInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [paneView, setPaneView] = useState("events")

  useEffect(() => {
    setIsLoading(true);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempBuyerInfo = {};
      tempBuyerInfo.token = tempUser.token;
      tempBuyerInfo.email = tempUser.user.email
      tempBuyerInfo.name = tempUser.user.name
      tempBuyerInfo.role = tempUser.user.role
      tempBuyerInfo.id = tempUser.user._id;
      console.log("tempBuyerInfo: ", tempBuyerInfo)
      setBuyerInfo(tempBuyerInfo);
      /*
      if (tempBuyerInfo.role === 0) {
        return <Redirect to="/buyerdashboard" />;
      } else if (tempBuyerInfo.role !== 1) {
        window.location.href = "/";
      }
      */
    } else {
      window.location.href = "/signin";
    }
    setIsLoading(false);
  }, []);

const MainDisplay = () => {
  if(!isLoading) {
    if (paneView === "profile") {
      return (
        <Profile
          loading={isLoading}
          name={buyerInfo.name}
          email={buyerInfo.email}
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
        <EventDashboard/>
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
          buyerInfo={buyerInfo}
          loading={isLoading}
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