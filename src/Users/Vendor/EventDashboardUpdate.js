import React, { useState, useEffect } from "react";
import { Redirect, Fragment, Link } from "react-router-dom";

import { API } from "../../config";

import VendorNavigation from "./VendorNavigation";
import TicketOrderEntry from "./TicketOrderEntry";
import EventOrders from "./EventOrders";
import classes from "./ControlPanel.module.css";

const EventDashboard = (props) => {

  const [isLoading, setIsLoading] = useState(true);

  const [paneView, setPaneView] = useState("events")

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
      if (props.subPane === "ticketEntry") {
        return (
          <TicketOrderEntry
          />
        )
      } else if (props.subPane === "eventOrders") {
        return (
          <EventOrders/>
        )
      } else {
        return null;
      }
    } else {
      return null
    }
  }

  return (
    <div>
      <div>
          {MainDisplay()}
      </div>
    </div>
  );
};

export default EventDashboard;