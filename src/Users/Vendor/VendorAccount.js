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
  const [paneView, setPaneView] = useState("events");
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

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      if (!(getStatus() === 7) && !(getStatus() === 8)) {
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
          salesAnalytics={(event, orders) => {
            console.log("EventNum: ", event);
            console.log("EventOrders: ", orders);
            setSelectedEvent(event);
            setSelectedOrders(orders);

            setPaneView("salesAnalytics");
          }}
          ticketSales={() => {
            setPaneView("ticketSales");
          }}
          issueTickets={() => {
            setPaneView("issueTickets");
          }}
          editEvent={() => {
            setPaneView("editEvent");
          }}
        />
      );
    } else if (paneView === "salesAnalytics") {
      console.log("About to go to sales and anlaytics");
      return (
        <SalesAnalytics
          event={selectedEvent}
          orders={selectedOrders}
          clicked={() => {
            setPaneView("events");
          }}
        />
      );
    } else if (paneView === "ticketSales") {
      return (
        <TicketSales
          clicked={() => {
            setPaneView("events");
          }}
        />
      );
    } else if (paneView === "issueTickets") {
      return (
        <IssueTickets
          clicked={() => {
            setPaneView("events");
          }}
        />
      );
    } else if (paneView === "editEvent") {
      return (
        <EditEvent
          clicked={() => {
            setPaneView("events");
          }}
        />
      );
    } else if (paneView === "orders") {
      return <Orders />;
    } else if (paneView === "create") {
      return <CreateEvent />;
    } else if (paneView === "account") {
      return <Account />;
    } else if (paneView === "myTickets") {
      return <MyTickets />;
    } else {
      return null;
    }
  };

  const Navigation = (
    <VendorNavigation
      pane={paneView}
      clicked={(event) => {
        setPaneView(event.target.name);
      }}
    />
  );

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
