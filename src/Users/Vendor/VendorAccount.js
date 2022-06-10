import React, { useState, useEffect } from "react";

import { API } from "../../config";
import { compareValues } from "./Resources/VendorFunctions";
import queryString from "query-string";

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

import { useOurApi } from "../../utils/useOurApi";
import { useOurApi2 } from "../../utils/useOurApi2";

const VendorAccount = (props) => {
  // spinner, events, salesAnalytics, ticketSales, issueTickets, editEvent, wallet, account, create, orders
  const [display, setDisplay] = useState("events");
  //  const [eventDescriptions, setEventDescriptions] = useState({}); //
  //  const [eventOrders, setEventOrders] = useState({}); //
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState("free");
  const [upgradeDisplay, setUpgradeDisplay] = useState("gateway");

  //  const [userInfo, setUserInfo] = useState({}); //

  //  const [userInfo, setUserInfo] = useState({}); //

  let tempUser = JSON.parse(localStorage.getItem("user"));
  let acctnum = tempUser?.user?.accountId?.accountNum;
  if (!tempUser?.token || !acctnum) window.location.href = "/auth";

  let userInfo = tempUser.user;
  userInfo.token = tempUser.token;
  userInfo.email = tempUser.user.email;
  userInfo.firstname = tempUser.user.firstname;
  userInfo.lastname = tempUser.user.lastname;
  userInfo.status = tempUser.user.accountId.status;
  userInfo.id = tempUser.user.accountId._id;
  userInfo.account = tempUser.user.accountId;
  userInfo.accountNum = tempUser.user.accountId.accountNum;

  //  setUserInfo(tempUserInfo);
  // sets api variables for EVENTS
  let myHeadersx = new Headers();
  myHeadersx.append("Content-Type", "application/json");
  myHeadersx.append("Authorization", "Bearer " + tempUser.token);
  const url = `${API}/accounts/${tempUser.user.accountId.accountNum}/events`;
  const method1 = "GET";
  const body = null;
  const initialData = { status: true, message: "hi first time for events" };
  const { isLoading, hasError, setUrl, setBody, data, networkError } =
    useOurApi(method1, url, myHeadersx, body, initialData);

  // sets api variables for ORDERS
  const url2 = `${API}/reports/organizer?rsid=orders1`;
  const method2 = "POST";
  const body2 = null;
  const initialData2 = { status: true, message: "hi first time for orders" };

  const { isLoading2, hasError2, setUrl2, setBody2, data2, networkError2 } =
    useOurApi2(method2, url2, myHeadersx, body2, initialData2);

  const reloadOrders = () => {
    setUrl2(url2);
  };

  useEffect(() => {
    console.log("inside useEffect");
    let initialView = queryString.parse(window.location.search).view;
    console.log("initialView: ", initialView);

    if (initialView === "create") {
      setUpgradeDisplay(initialView);
      setDisplay("create");
    }
  }, []);

  const mainDisplay = () => {
    if (isLoading || isLoading2) {
      return (
        <div style={{ paddingTop: "60px" }}>
          <Spinner />
        </div>
      );
    }
    if (hasError || hasError2) {
      return (
        <div className={classes.ConnectionText}>
          There is a problem in retrieving your information. Please try again
          later.
        </div>
      );
    }
    if (display === "events") {
      return (
        <Events
          eventDescriptions={data}
          eventOrders={data2.data}
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
          token={userInfo.token}
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
      return (
        <CreateEvent
          toEvents={() => {
            setDisplay("events");
          }}
        />
      );
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
          initialView={upgradeDisplay}
          userInfo={userInfo}
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

  const navigation = (
    <VendorNavigation
      pane={display}
      status={"status" in userInfo ? userInfo.status : 0}
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
        {navigation}
        {mainDisplay()}
      </div>
    </div>
  );
};

export default VendorAccount;
