import React, { useState, useEffect } from "react";

import { API } from "../../config";
import { compareValues } from "./Resources/VendorFunctions";

// THESE INDIVIDUAL COMPONENTS HAVE NOT BEEN CHECKED
import Events from "./Events"; // NEW COMPONENT COPIED FROM DEV AND UPDATED
import SalesAnalytics from "./SalesAnalytics"; // NEW COMPONENT COPIED FROM DEV AND UPDATED
import TicketSales from "./TicketSales"; // NEW COMPONENT COPIED FROM DEV AND UPDATED
import IssueTickets from "./IssueTickets"; // NEW COMPONENT COPIED FROM DEV AND UPDATED
import EditEvent from "../../EventCreation/EditEvent"; // NEW COMPONENT COPIED FROM DEV AND UPDATED
import Orders from "./Orders"; // CURRENTLY NOT USING THIS TAB
import CreateEvent from "../../EventCreation/CreateEvent"; // NO CHANGE WAS MADE TO THIS COMPONENT
import Account from "./Account"; // NEW COMPONENT COPIED FROM DEV AND UPDATED
import Upgrade from "./Upgrade";
//import TicketWallet from "../TicketWallet/TicketWallet";
import MyTickets from "../ComponentPages/MyTickets";
import VendorNavigation from "./Components/VendorNavigation"; // NEW COMPONENT COPIED FROM DEV AND UPDATED
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./VendorAccount.module.css";

const VendorAccount = (props) => {
  console.log("VENDOR PROPS: ", props);

  // spinner, events, salesAnalytics, ticketSales, issueTickets, editEvent, wallet, account, create, orders
  const [display, setDisplay] = useState("spinner");
  const [eventDescriptions, setEventDescriptions] = useState({}); //
  const [eventOrders, setEventOrders] = useState({}); //
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState("free");

  const [userInfo, setUserInfo] = useState(); //

  const handleErrors = (response) => {
    if (!response.ok) {
      console.log("error in 'handleErrors()'");
      throw Error(response.status);
    }
    return response;
  };

  useEffect(() => {
    console.log("INSIDE USEFFECT");
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("INSIDE IF");

      if (!("user" in tempUser && "token" in tempUser)) {
        window.location.href = "/auth";
      }

      let tempUserInfo = {};
      tempUserInfo.token = tempUser.token;
      tempUserInfo.email = tempUser.user.email;
      tempUserInfo.name = tempUser.user.name;
      tempUserInfo.role = tempUser.user.role;
      tempUserInfo.id = tempUser.user._id;
      tempUserInfo.account = tempUser.user.accountId;

      setUserInfo(tempUserInfo);

      if (
        tempUserInfo.account &&
        "status" in tempUserInfo.account &&
        tempUserInfo.account.status === 8
      ) {
        console.log("INSIDE ANOTHER IF");
        setSubscriptionType("paid");
      }

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + tempUserInfo.token);
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      if (tempUserInfo.account) {
        console.log("INSIDE EVENT FETCH");
        let fetchstr = `${API}/accounts/${tempUser.user.accountId.accountNum}/events`;

        fetch(fetchstr, requestOptions)
          .then(handleErrors)
          .then((response) => response.text())
          .then((result) => {
            console.log("VENDOR EVENTS api result: ", JSON.parse(result));
            let jsEvents = JSON.parse(result);
            jsEvents.sort(compareValues("startDateTime", "asc"));
            setEventDescriptions(jsEvents);
            fetchstr = `${API}/accounts/${tempUser.user.accountId.accountNum}/orders`;
            fetch(fetchstr, requestOptions)
              .then(handleErrors)
              .then((response) => response.text())
              .then((result) => {
                let jsOrders = JSON.parse(result);
                console.log("ORDERS: ", jsOrders);
                jsOrders.sort(compareValues("createdAt", "asc"));
                setEventOrders(jsOrders);
                // THIS IS FOR THE NEW IMPLEMENTATION WHEN THE TAB SETTING IS COMING FORM "Routes.js"
                //setDisplay(props.myAccountTab);
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
        setDisplay("events");
      }
    } else {
      window.location.href = "/auth";
    }
  }, []);

  const reloadOrders = () => {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    let vendorToken = tempUser.token;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + tempUser.token);
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    console.log("Temp User: ", tempUser);
    let fetchstr = `${API}/accounts/${tempUser.user.accountId.accountNum}/orders`;
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
    //if (true) {
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
      return (
        <Account
          upgrade={(event) => {
            setDisplay("upgrade");
          }}
        ></Account>
      );
    } else if (display === "upgrade") {
      return (
        <Upgrade
          userid={userInfo.id}
          token={userInfo.token}
          accountNum={userInfo.accountNum}
        />
      );
    } else if (display === "wallet") {
      return <MyTickets />;
    } else {
      return null;
    }
  };

  const Navigation = (
    <VendorNavigation
      pane={display}
      subscriptionType={subscriptionType}
      clicked={(event) => {
        setDisplay(event.target.name);
        // *****THIS NEEDS TO BE INCOPORATED ONCE "Routs.js" HAS BEEN UPDATED
        // *****AND NEW "Sidecar.js" HAS BEEN UPDATED
        //props.changeTab(event.target.name);
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
