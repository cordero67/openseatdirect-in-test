import React, { useEffect, useState, Fragment } from "react";

import { API } from "../../config";
import WarningModal from "./Modals/WarningModal";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./Events.module.css";
import { compareValues, getDates } from "./Resources/VendorFunctions";

const Events = (props) => {
  const [display, setDisplay] = useState("spinner"); //main, spinner, connection
  const [warningModal, setWarningModal] = useState({
    status: false,
    type: "",
  });

  const [eventDescriptions, setEventDescriptions] = useState(); //

  const handleErrors = (response) => {
    if (!response.ok) {
      console.log("error in 'handleErrors()'");
      throw Error(response.status);
    }
    return response;
  };

  // *** NEED TO LOOK AT RESTRICTING WHEN THE API IS TRIGGERED TO NOT HAVE REDUNDANT PINGS TO THE BACK END
  const loadServerData = () => {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    let vendorToken = tempUser.token;
    let vendorId = tempUser.user._id;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + vendorToken);
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let fetchstr = `${API}/event/alluser/${vendorId}`;

    fetch(fetchstr, requestOptions)
      .then(handleErrors)
      .then((response) => response.text())
      .then((result) => {
        console.log("result: ", JSON.parse(result));
        localStorage.setItem("events", result);
        let js = JSON.parse(result);
        js.sort(compareValues("startDateTime", "asc"));
        setEventDescriptions(js);
        fetchstr = `${API}/order/${vendorId}`;
        fetch(fetchstr, requestOptions)
          .then(handleErrors)
          .then((response) => response.text())
          .then((result) => {
            localStorage.setItem("orders", result);
            setDisplay("main");
          });
        return js;
      })
      .catch((error) => {
        console.log("error", error);
        setDisplay("connection");
      });
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      loadServerData();
    } else {
      window.location.href = "/auth";
    }
  }, []);

  const setEventNum = (item) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("eventNum", JSON.stringify(item.eventNum));
    } else {
      window.location.href = "/auth";
    }
  };

  const switchTab = (name, item) => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      localStorage.setItem("eventNum", JSON.stringify(item.eventNum));

      if (
        localStorage.getItem(`orders`) !== null &&
        localStorage.getItem(`events`) !== null
      ) {
        let storedEvents = JSON.parse(localStorage.getItem("events"));
        let storedOrders = JSON.parse(localStorage.getItem("orders"));

        if (name === "analytics") {
          setWarningModal({
            status: true,
            type: "analytics",
          });
        } else if (name === "orders") {
          let ordersExist = false;
          storedOrders.forEach((order) => {
            if (order.eventNum === item.eventNum) {
              ordersExist = true;
            }
          });
          if (ordersExist) {
            props.ticketSales();
          } else {
            setWarningModal({
              status: true,
              type: "orders",
            });
          }
        } else if (name === "tickets") {
          let ticketsExist = false;
          storedEvents.forEach((event) => {
            if (
              event.eventNum === item.eventNum &&
              "tickets" in event &&
              event.tickets.length > 0
            ) {
              ticketsExist = true;
            }
          });
          if (ticketsExist) {
            props.issueTickets();
          } else {
            setWarningModal({
              status: true,
              type: "tickets",
            });
          }
        }
      } else {
        loadServerData();
      }
    } else {
      window.location.href = "/auth";
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
    if (display === "main" && eventDescriptions.length !== 0) {
      return (
        <div>
          {eventDescriptions.map((item, index) => {
            let shortMonth, dayDate, longDateTime;
            [shortMonth, dayDate, longDateTime] = getDates(item.startDateTime);
            return (
              <div key={index} className={classes.Events}>
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
                <button className={classes.EventButton}>
                  <ion-icon
                    style={{ fontSize: "28px", color: "blue" }}
                    name="analytics"
                    onClick={() => {
                      switchTab("analytics", item);
                    }}
                  />
                </button>
                <button className={classes.EventButton}>
                  <ion-icon
                    style={{ fontSize: "24px", color: "blue" }}
                    name="receipt-outline"
                    onClick={() => {
                      switchTab("orders", item);
                    }}
                  />
                </button>
                <button className={classes.EventButton}>
                  <ion-icon
                    style={{ fontSize: "26px", color: "blue" }}
                    name="ticket-outline"
                    onClick={() => {
                      switchTab("tickets", item);
                    }}
                  />
                </button>
                <button className={classes.EventButton}>
                  <ion-icon
                    style={{ fontSize: "26px", color: "blue" }}
                    name="create-outline"
                    onClick={() => {
                      setEventNum(item);
                      props.editEvent();
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      );
    } else if (display === "main") {
      return (
        <div className={classes.NoEventsText}>
          You currently have no events.
        </div>
      );
    } else {
      return null;
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
          There is a problem with the OSD Server in retrieving your events.
          Please try again later.
        </div>
      );
    } else return null;
  };

  return (
    <div>
      {tabTitle}
      {displayHeader}
      <div className={classes.DisplayPanel}>
        {loadingSpinner()}
        {mainDisplay()}
        {connectionStatus()}
      </div>
      {warningModalDisplay}
    </div>
  );
};

export default Events;
