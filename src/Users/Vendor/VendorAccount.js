import React, { useState, useEffect } from "react";

import { API } from "../../config";
import { compareValues } from "./VendorFunctions";

import VendorNavigation from "./VendorNavigation";
import Events from "./Events";
import ManualOrderEntry from "./ManualOrderEntry";
import SalesAnalytics from "./SalesAnalytics";
import TicketSales from "./TicketSales";
import Orders from "./Orders";
import CreateEvent from "../../EventCreation/CreateEvent";
import Profile from "./Profile";
import Account from "./Account";

import classes from "./VendorAccount.module.css";

const VendorAccount = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [paneView, setPaneView] = useState("events")

  const handleErrors = response => {
      console.log("Inside 'apiCore' 'handleErrors()'", response);
      if (!response.ok) {
          throw Error(response.status);
      }
      return response;
  };

  useEffect(() => {
    setIsLoading(true);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let vendorToken = tempUser.token;
      let vendorId = tempUser.user._id;

      console.log("loading event and order data");
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + vendorToken);
  
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      // retrieves event information
      let fetchstr = `${API}/event/alluser/${vendorId}`;

      fetch(fetchstr, requestOptions)
      .then(handleErrors)
      .then((response) => response.text())
      .then((result) => {
        let tempEvents = JSON.parse(result);
        console.log("eventDescriptions unordered: ", tempEvents);
        tempEvents.sort(compareValues("startDateTime", "asc"));
        console.log("eventDescriptions ordered: ", tempEvents);
        localStorage.setItem("events", JSON. stringify(tempEvents));
      })
      .catch((error) => {
        console.log("error in event information retrieval", error);
      });
      
      // retrieves order information
      fetchstr = `${API}/order/${vendorId}`;

      fetch(fetchstr, requestOptions)
      .then(handleErrors)
      .then((response) => response.text())
      .then((result) => {
        localStorage.setItem("orders", result);
      })
      .catch((error) => {
        console.log("error in order information retrieval", error);
      });

    } else {
      window.location.href = "/signin";
    }
    setIsLoading(false);

  }, []);

const MainDisplay = () => {
  if(!isLoading) {
    if (paneView === "events") {
      return (
        <Events
          clicked={() => {
            setPaneView("ticketSales")
          }}
        />
      )
    } else if (paneView === "manualOrderEntry") {
      return (
        <ManualOrderEntry
          clicked={() => {
            setPaneView("events")
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
    } else if (paneView === "orders") {
      return (
        <Orders/>
      )
    } else if (paneView === "create") {
      return (
        <CreateEvent/>
      )
    } else if (paneView === "profile") {
      return (
        <Profile/>
      )
    } else if (paneView === "account") {
      return (
        <Account/>
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

export default VendorAccount;