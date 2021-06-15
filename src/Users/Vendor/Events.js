import React, { useState, Fragment } from "react";

import WarningModal from "./Modals/WarningModal";

import classes from "./Events.module.css";
import { getDates } from "./Resources/VendorFunctions";

const Events = (props) => {
  const [warningModal, setWarningModal] = useState({
    status: false,
    type: "",
  });

  const switchTab = (name, item) => {
    console.log("NAME: ", name);
    console.log("ITEM: ", item);
    if (name === "analytics") {
      let tempOrders = [];
      props.eventOrders.forEach((order) => {
        if (order.eventNum === item.eventNum) {
          tempOrders.push(order);
        }
      });
      if (tempOrders.length > 0) {
        props.salesAnalytics(item, tempOrders);
      } else {
        setWarningModal({
          status: true,
          type: "analytics",
        });
      }
    } else if (name === "orders") {
      let tempOrders = [];
      props.eventOrders.forEach((order) => {
        if (order.eventNum === item.eventNum) {
          tempOrders.push(order);
        }
      });
      if (tempOrders.length > 0) {
        props.ticketSales(item, tempOrders);
      } else {
        setWarningModal({
          status: true,
          type: "orders",
        });
      }
    } else if (name === "tickets") {
      if ("tickets" in item && item.tickets.length > 0) {
        props.issueTickets(item);
      } else {
        setWarningModal({
          status: true,
          type: "tickets",
        });
      }
    }
  };

  const warningModalDisplay = (
    <Fragment>
      <WarningModal
        show={warningModal.status}
        type={warningModal.type}
        close={() => {
          setWarningModal({
            status: false,
            type: "",
          });
        }}
      />
    </Fragment>
  );

  const mainDisplay = () => {
    if (props.eventDescriptions.length > 0) {
      let oddOrder = true;
      let styling = {};
      return (
        <div>
          {props.eventDescriptions.map((item, index) => {
            let shortMonth, dayDate, longDateTime;
            [shortMonth, dayDate, longDateTime] = getDates(item.startDateTime);
            if (!oddOrder) {
              styling = {
                backgroundColor: "#F0F0F0",
              };
            } else {
              styling = {
                backgroundColor: "#fff",
              };
            }
            oddOrder = !oddOrder;
            return (
              <div key={index} className={classes.Events} style={styling}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "red",
                    }}
                  >
                    {shortMonth}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      color: "black",
                      fontWeight: "600",
                    }}
                  >
                    {dayDate}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div className={classes.EventTitle}>{item.eventTitle}</div>
                  <div
                    style={{
                      fontSize: "13px",
                      textAlign: "left",
                      fontWeight: "500",
                    }}
                  >
                    {longDateTime}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    paddingTop: "12px",
                  }}
                >
                  {item.isDraft ? (
                    <span style={{ color: "#B80000" }}>DRAFT</span>
                  ) : (
                    <span style={{ color: "#008F00" }}>LIVE</span>
                  )}
                </div>
                <button className={classes.EventButton} style={styling}>
                  <ion-icon
                    style={{ fontSize: "28px", color: "blue" }}
                    name="analytics"
                    onClick={() => {
                      switchTab("analytics", item);
                    }}
                  />
                </button>
                <button className={classes.EventButton} style={styling}>
                  <ion-icon
                    style={{ fontSize: "24px", color: "blue" }}
                    name="receipt-outline"
                    onClick={() => {
                      switchTab("orders", item);
                    }}
                  />
                </button>
                <button className={classes.EventButton} style={styling}>
                  <ion-icon
                    style={{ fontSize: "26px", color: "blue" }}
                    name="ticket-outline"
                    onClick={() => {
                      switchTab("tickets", item);
                    }}
                  />
                </button>
                <button className={classes.EventButton} style={styling}>
                  <ion-icon
                    style={{ fontSize: "26px", color: "blue" }}
                    name="create-outline"
                    onClick={() => {
                      props.editEvent(item);
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className={classes.NoEventsText}>
          You currently have no events.
        </div>
      );
    }
  };

  const tabTitle = <div className={classes.DisplayPanelTitle}>My Events</div>;

  const displayHeader = (
    <div className={classes.EventsHeader}>
      <div style={{ textAlign: "center" }}>Date</div>
      <div>Event</div>
      <div style={{ textAlign: "center" }}>
        <div>Event</div>
        <div>Status</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div>Sales</div>
        <div>Analytics</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div>Past</div>
        <div>Orders</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div>Issue</div>
        <div>Tickets</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div>Edit</div>
        <div>Event</div>
      </div>
    </div>
  );

  return (
    <div>
      {tabTitle}
      {displayHeader}
      <div className={classes.DisplayPanel}>{mainDisplay()}</div>
      {warningModalDisplay}
    </div>
  );
};

export default Events;
