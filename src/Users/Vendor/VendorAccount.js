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
  console.log("VENDOR PROPS: ", props);

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

  let initialView = queryString.parse(window.location.search).view;
  console.log("initialView: ", initialView);
  if (initialView === "gateway" || initialView === "sub") {
    setUpgradeDisplay(initialView);
    setDisplay("upgrade");
  }

  let tempUser = JSON.parse(localStorage.getItem("user"));
  let acctnum = tempUser?.user?.accountId?.accountNum;
  if (!tempUser?.token || ! acctnum ) window.location.href = "/auth";


  let userInfo  = tempUser.user;
  userInfo.token = tempUser.token;
  userInfo.email = tempUser.user.email;
  userInfo.firstname = tempUser.user.firstname;
  userInfo.lastname = tempUser.user.lastname;
  userInfo.status = tempUser.user.accountId.status;
  userInfo.id = tempUser.user.accountId._id;
  userInfo.account = tempUser.user.accountId;
  userInfo.accountNum = tempUser.user.accountId.accountNum;

  console.log("userInfo: ", userInfo);

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

    const { isLoading2 , hasError2, setUrl2, setBody2, data2, networkError2 } =
      useOurApi2(method2, url2, myHeadersx, body2, initialData2);




/*

  const handleErrors = (response) => {
    if (!response.ok) {
      console.log("error in 'handleErrors()'");
      throw Error(response.status);
    }
    return response;
  };

  // LOOKS GOOD
  useEffect(() => {
    let initialView = queryString.parse(window.location.search).view;
    console.log("initialView: ", initialView);

    if (initialView === "gateway" || initialView === "sub") {
      setUpgradeDisplay(initialView);
      setDisplay("upgrade");
    } else {
      if (
        typeof window !== "undefined" &&
        localStorage.getItem(`user`) !== null
      ) {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        console.log("tempUser: ", tempUser);

        if (!("user" in tempUser && "token" in tempUser)) {
          window.location.href = "/auth";
        }

        // LOOKS GOOD
        let tempUserInfo = {};
        tempUserInfo.token = tempUser.token;
        tempUserInfo.email = tempUser.user.email;
        tempUserInfo.firstname = tempUser.user.firstname;
        tempUserInfo.lastname = tempUser.user.lastname;
        tempUserInfo.status = tempUser.user.accountId.status;
        tempUserInfo.id = tempUser.user.accountId._id;
        tempUserInfo.account = tempUser.user.accountId;
        tempUserInfo.accountNum = tempUser.user.accountId.accountNum;
        console.log("tempUserInfo: ", tempUserInfo);

//        setUserInfo(tempUserInfo);

        // LOOKS GOOD
        // sets api variables
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + tempUserInfo.token);
        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        // LOOKS GOOD
        // if "accountID" field exists than all event and order information is requested
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
              requestOptions = {
                method: "POST",
                headers: myHeaders,
                redirect: "follow",
              };
              let fetchstr = `${API}/reports/organizer?rsid=orders1`;
              //let fetchstr = `${API}/accounts/${tempUser.user.accountId.accountNum}/orders`;
              fetch(fetchstr, requestOptions)
                .then(handleErrors)
                .then((response) => response.text())
                .then((result) => {
                  let jsOrders = JSON.parse(result);
                  console.log("ORDERS: ", jsOrders);
                  //jsOrders.sort(compareValues("createdAt", "asc"));
                  setEventOrders(jsOrders.data);
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
          // account does not exist
          setDisplay("events");
        }
      } else {
        window.location.href = "/auth";
      }
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
    let fetchstr = `${API}/accounts/reports/organizer?rsid=orders1`;
    //let fetchstr = `${API}/accounts/${tempUser.user.accountId.accountNum}/orders`;
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

  // LOOKS GOOD
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

  // LOOKS GOOD
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

  */


  const reloadOrders = () => {
    setUrl2 (url2);
  }

  const mainDisplay = () => {
    console.log ("in mainDisplay","isLoading12=",isLoading, isLoading2, 
    "hasError12=", hasError, hasError2,"data=",data,"data2=",data2);

    if  ( isLoading || isLoading2) {
      return (
        <div style={{ paddingTop: "60px" }}>
          <Spinner />
        </div>
      );
    };
    if (hasError || hasError2) {
      return (
          <div className={classes.ConnectionText}>
            There is a problem in retrieving your information.
            Please try again later.
        </div>
      )
    };
    if (display === "events") {
      return (
        <Events
//          eventDescriptions={eventDescriptions}
//          eventOrders={eventOrders}
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
