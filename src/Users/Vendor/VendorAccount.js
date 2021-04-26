import React, { useState, useEffect } from "react";

import { API } from "../../config";
import { compareValues } from "./Resources/VendorFunctions";

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
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./VendorAccount.module.css";

const VendorAccount = () => {
  // spinner, events, salesAnalytics, ticketSales, issueTickets, editEvent, myTickets, account, create, orders
  const [display, setDisplay] = useState("spinner");
  const [eventDescriptions, setEventDescriptions] = useState(); //
  const [eventOrders, setEventOrders] = useState(); //
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedOrders, setSelectedOrders] = useState([]);

  const getStatus = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    if ("user" in tempData && "accountId" in tempData.user) {
      let tempAccountId = tempData.user.accountId;

      let hasLinkIds = false;
      let hasPaid = false;
      if (tempAccountId.ticketPlan === "free") {
        return 7;
      }
      if (tempAccountId.ticketPlan === "comp") {
        hasPaid = true;
      }

      if (
        "paymentGatewayType" in tempAccountId &&
        tempAccountId.paymentGatewayType === "PayPalExpress" &&
        "paypalExpress_client_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypalExpress_client_id
      ) {
        hasLinkIds = true;
      }

      if (
        "paymentGatewayType" in tempAccountId &&
        tempAccountId.paymentGatewayType === "PayPalMarketplace" &&
        "paypal_merchant_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypal_merchant_id
      ) {
        hasLinkIds = true;
      }
      if (
        "paypal_plan_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypal_plan_id &&
        "accountPaymentStatus" in tempAccountId &&
        tempAccountId.accountPaymentStatus === "good"
      ) {
        hasPaid = true;
      }

      if (!hasPaid && !hasLinkIds) {
        return 4;
      }

      if (!hasPaid && hasLinkIds) {
        return 5;
      }

      if (hasPaid && !hasLinkIds) {
        return 6;
      }

      if (hasPaid && hasLinkIds) {
        return 8;
      }

      return 4;
    } else return 0;
  };

  const handleErrors = (response) => {
    if (!response.ok) {
      console.log("error in 'handleErrors()'");
      throw Error(response.status);
    }
    return response;
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      if (!(getStatus() === 7) && !(getStatus() === 8)) {
        window.location.href = "/personal";
      }
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let vendorToken = tempUser.token;

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + vendorToken);
      let requestOptionsA = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      let requestOptionsB = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      let fetchstr = `${API}/organizer/events`;

      fetch(fetchstr, requestOptionsA)
        .then(handleErrors)
        .then((response) => response.text())
        .then((result) => {
          console.log("result: ", JSON.parse(result));
          let jsEvents = JSON.parse(result);
          jsEvents.sort(compareValues("startDateTime", "asc"));
          setEventDescriptions(jsEvents);
          fetchstr = `${API}/reports/organizer`;
          fetch(fetchstr, requestOptionsB)
            .then(handleErrors)
            .then((response) => response.text())
            .then((result) => {
              let jsOrders = JSON.parse(result);
              console.log("ORDERS: ", jsOrders);
              jsOrders.sort(compareValues("createdAt", "asc"));
              setEventOrders(jsOrders);
              setDisplay("events");
            })
            .catch((error) => {
              console.log("error", error);
              setDisplay("connection");
            });
          return jsEvents;
        })
        .catch((error) => {
          console.log("error", error);
          setDisplay("connection");
        });
    } else {
      window.location.href = "/auth";
    }
  }, []);

  const reloadOrders = () => {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    let vendorToken = tempUser.token;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + vendorToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    let fetchstr = `${API}/reports/organizer`;
    fetch(fetchstr, requestOptions)
      .then(handleErrors)
      .then((response) => response.text())
      .then((result) => {
        let jsOrders = JSON.parse(result);
        console.log("ORDERS: ", jsOrders);
        jsOrders.sort(compareValues("createdAt", "asc"));
        setEventOrders(jsOrders);
        //setDisplay("events");
      })
      .catch((error) => {
        console.log("error", error);
        //setDisplay("connection");
      });
  };

  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div style={{ paddingTop: "60px" }}>
          <Spinner />
        </div>
      );
    } else {
      return null;
    }
  };

  const connectionStatus = () => {
    if (display === "connection") {
      return (
        <div className={classes.ConnectionText}>
          There is a problem with the OSD Server in retrieving your information.
          Please try again later.
        </div>
      );
    } else return null;
  };

  const mainDisplay = () => {
    if (display === "events") {
      return (
        <Events
          eventDescriptions={eventDescriptions}
          eventOrders={eventOrders}
          salesAnalytics={(event, orders) => {
            setSelectedEvent(event);
            setSelectedOrders(orders);

            setDisplay("salesAnalytics");
          }}
          ticketSales={(event, orders) => {
            setSelectedEvent(event);
            setSelectedOrders(orders);

            setDisplay("ticketSales");
          }}
          issueTickets={(event) => {
            setSelectedEvent(event);
            setDisplay("issueTickets");
          }}
          editEvent={(event) => {
            setSelectedEvent(event);
            setDisplay("editEvent");
          }}
        />
      );
    } else if (display === "salesAnalytics") {
      return (
        <SalesAnalytics
          event={selectedEvent}
          orders={selectedOrders}
          clicked={() => {
            setDisplay("events");
          }}
        />
      );
    } else if (display === "ticketSales") {
      return (
        <TicketSales
          event={selectedEvent}
          orders={selectedOrders}
          clicked={() => {
            setDisplay("events");
          }}
        />
      );
    } else if (display === "issueTickets") {
      return (
        <IssueTickets
          event={selectedEvent}
          confirmed={() => {
            console.log("CONFIRMED");
            reloadOrders();
          }}
          clicked={() => {
            setDisplay("events");
          }}
        />
      );
    } else if (display === "editEvent") {
      console.log("selectedEvent: ", selectedEvent);
      return (
        <EditEvent
          event={selectedEvent}
          clicked={() => {
            setDisplay("events");
          }}
        />
      );
    } else if (display === "orders") {
      return <Orders />;
    } else if (display === "create") {
      return <CreateEvent />;
    } else if (display === "account") {
      return <Account />;
    } else if (display === "myTickets") {
      return <MyTickets />;
    } else {
      return null;
    }
  };

  const Navigation = (
    <VendorNavigation
      pane={display}
      clicked={(event) => {
        setDisplay(event.target.name);
      }}
    />
  );

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
        {Navigation}
        {loadingSpinner()}
        {mainDisplay()}
        {connectionStatus()}
      </div>
    </div>
  );
};

export default VendorAccount;
