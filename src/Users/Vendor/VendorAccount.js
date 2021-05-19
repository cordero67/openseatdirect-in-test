import React, { useState, useRef, useEffect } from "react";

import { API } from "../../config";
import { compareValues } from "./Resources/VendorFunctions";

import Events from "./Events";
import SalesAnalytics from "./SalesAnalytics";
import TicketSales from "./TicketSales";
import IssueTickets from "./IssueTickets";
//import EditEvent from "../../EventCreation/EditEvent";
import EditEvent from "../../EventCreation/EditEvent";

import Orders from "./Orders"; // CURRENTLY NOT USING THIS TAB
import CreateEvent from "../../EventCreation/CreateEvent";
import Account from "./Account";
import TicketWallet from "../TicketWallet/TicketWallet";
import VendorNavigation from "./Components/VendorNavigation";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./VendorAccount.module.css";

const VendorAccount = (props) => {
  console.log("VENDOR PROPS: ", props);
  // spinner, events, salesAnalytics, ticketSales, issueTickets, editEvent, wallet, account, create, orders
  const [display, setDisplay] = useState("spinner");
  const [eventDescriptions, setEventDescriptions] = useState(); //
  const [eventOrders, setEventOrders] = useState(); //
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [windowWidth, setWindowWidth] = useState([]);

  const [accountType, setAccountType] = useState();

  const firstTime = useRef(true);

  // LOOKS GOOD
  // determines resized width and height of window
  window.onresize = function (event) {
    console.log(window.innerWidth, window.innerHeight);
    setWindowWidth(window.innerWidth);
  };

  // LOOKS GOOD
  const stylingUpdate = (inWidth, inHeight) => {
    setWindowWidth(inWidth);
  };

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
        setAccountType("buyer");
        return 4;
      }
      if (!hasPaid && hasLinkIds) {
        setAccountType("buyer");
        return 5;
      }
      if (hasPaid && !hasLinkIds) {
        setAccountType("buyer");
        return 6;
      }
      if (hasPaid && hasLinkIds) {
        setAccountType("issuer");
        return 8;
      }
      setAccountType("buyer");
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
    console.log("MY ACCOUNT TAB: ", props.myAccountTab);
    if (firstTime.current) {
      console.log("FIRST TIME");
      firstTime.current = false;
    } else {
      console.log("SECOND TIME");
      setDisplay(props.myAccountTab);
    }
  }, [props.myAccountTab]);

  useEffect(() => {
    stylingUpdate(window.innerWidth, window.innerHeight);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      if (!(getStatus() === 7) && !(getStatus() === 8)) {
        window.location.href = "/personal";
      }
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let vendorToken = tempUser.token;
      let userId = tempUser.user.accountId.accountNum;

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + vendorToken);
      let requestOptionsGET = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      let requestOptionsPOST = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      let fetchstr = `${API}/accounts/${userId}/events`;

      fetch(fetchstr, requestOptionsGET)
        .then(handleErrors)
        .then((response) => response.text())
        .then((result) => {
          console.log("VENDOR EVENTS api result: ", JSON.parse(result));
          let jsEvents = JSON.parse(result);
          jsEvents.sort(compareValues("startDateTime", "asc"));
          setEventDescriptions(jsEvents);
          fetchstr = `${API}/reports/organizer`;
          fetch(fetchstr, requestOptionsPOST)
            .then(handleErrors)
            .then((response) => response.text())
            .then((result) => {
              let jsOrders = JSON.parse(result);
              console.log("ORDERS: ", jsOrders);
              jsOrders.sort(compareValues("createdAt", "asc"));
              setEventOrders(jsOrders);
              if (props.myAccountTab !== "undefined") {
                setDisplay(props.myAccountTab);
              } else {
                setDisplay("events");
              }
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
      })
      .catch((error) => {
        // no error is shown to user
        // orders are not updated but older order information still exists
        console.log("error", error);
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
          windowWidth={windowWidth}
          salesAnalytics={(event, orders) => {
            setSelectedEvent(event);
            setSelectedOrders(orders);

            setDisplay("salesAnalytics");
          }}
          ticketSales={(event, orders) => {
            console.log("EVENT: ", event);
            console.log("ORDER: ", orders);
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
          toEvents={() => {
            setDisplay("events");
          }}
        />
      );
    } else if (display === "ticketSales") {
      return (
        <TicketSales
          event={selectedEvent}
          orders={selectedOrders}
          toEvents={() => {
            setDisplay("events");
          }}
        />
      );
    } else if (display === "issueTickets") {
      return (
        <IssueTickets
          event={selectedEvent}
          confirmed={() => {
            reloadOrders();
          }}
          toEvents={() => {
            setDisplay("events");
          }}
        />
      );
    } else if (display === "editEvent") {
      console.log("selectedEvent: ", selectedEvent);
      return (
        <EditEvent
          event={selectedEvent}
          windowWidth={windowWidth}
          toEvents={() => {
            setDisplay("events");
          }}
        />
      );
    } else if (display === "orders") {
      // CURRENTLY NOT USING THIS TAB
      return <Orders />;
    } else if (display === "create") {
      return <CreateEvent />;
    } else if (display === "account") {
      return <Account />;
    } else if (display === "wallet") {
      return <TicketWallet />;
    } else {
      return null;
    }
  };

  const Navigation = () => {
    if (windowWidth >= 1190) {
      return (
        <VendorNavigation
          pane={display}
          accountType={accountType}
          clicked={(event) => {
            setDisplay(event.target.name);
            props.changeTab(event.target.name);
          }}
        />
      );
    } else return null;
  };

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
        {Navigation()}
        {loadingSpinner()}
        {mainDisplay()}
        {connectionStatus()}
      </div>
    </div>
  );
};

export default VendorAccount;
