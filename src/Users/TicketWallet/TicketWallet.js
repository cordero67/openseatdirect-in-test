import React, { useEffect, useState, Fragment } from "react";
import Spinner from "../../components/UI/Spinner/Spinner";

import { API } from "../../config";
import classes from "./TicketWallet.module.css";
import ReceiptModal from "../Modals/ReceiptModal";
import TicketsModal from "../Vendor/Modals/TicketsModal";
import QRCodesModal from "../Vendor/Modals/QRCodesModal";
import WarningModal from "../Vendor/Modals/WarningModal";

import {
  getLongStartDate,
  getDates,
  getStartDate,
} from "../Vendor/Resources/VendorFunctions";

const MyTickets = () => {
  const [display, setDisplay] = useState("spinner"); // orders, future, past, spinner, connection
  const [modalView, setModalView] = useState("none"); // none, receipt, tickets, qrcode, warning

  const [modalItem, setModalItem] = useState({});

  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedTickets, setSelectedTickets] = useState({});

  const [futureEvents, setFutureEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  const handleErrors = (response) => {
    if (!response.ok) {
      console.log("error in 'handleErrors()'");
      throw Error(response.status);
    }
    return response;
  };

  // LOOKS GOOD
  useEffect(() => {
    let tempUser;
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      tempUser = JSON.parse(localStorage.getItem("user"));
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${tempUser.token}`);

    let url = `${API}/reports/buyer`;
    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        setOrders(js);
        console.log("result: ", js);
        createEventArrays(js);
        setDisplay("future");
      })
      .catch((error) => {
        setDisplay("connection");
        console.log("error", error);
      });
  }, []);

  const createEventArrays = (orders) => {
    let tempEvents = []; // an array of eventNum's of events that tickets were received
    let tempArray = []; // an array of events that tickets were received
    let tempPastArray = []; // an array of events that tickets were received for past events
    let tempFutureArray = []; // an array of events that tickets were received for future events

    orders.map((order) => {
      let adjusted = order.eventId.startDateTime.replace("T", " ");

      if (!tempEvents.includes(order.eventNum)) {
        // populates "tempEvents" strictly with event numbers
        tempEvents.push(order.eventNum);
        // populates "tempArray"
        let tempElement = {
          eventNum: order.eventNum,
          eventTitle: order.eventId.eventTitle,
          startDateTime: order.eventId.startDateTime,
          endDateTime: adjusted,
          tickets: [],
        };
        tempArray.push(tempElement);
      }
    });

    // populates "tempArray" with ticket pruchase information
    orders.map((order) => {
      let position = tempEvents.indexOf(order.eventNum);
      order.qrTickets.map((ticket) => {
        tempArray[position].tickets.push(ticket);
      });
    });

    console.log("tempArray: ", tempArray);
    console.log("tempEvents: ", tempEvents);

    // populates both "futureEvents" and "pastEvents" variables
    tempArray.map((event) => {
      let eventTime = Date.parse(event.endDateTime);
      if (eventTime > Date.now()) {
        tempFutureArray.push(event);
        console.log("tempFutureArray: ", tempFutureArray);
        setFutureEvents(tempFutureArray);
      } else {
        tempPastArray.push(event);
        console.log("tempPastArray: ", tempPastArray);
        setPastEvents(tempPastArray);
      }
    });
  };

  const loadPreviousOrder = () => {
    let newPosition;
    orders.forEach((order, index) => {
      if (order.osdOrderId === selectedOrder.osdOrderId) {
        if (index === 0) {
          newPosition = orders.length - 1;
        } else {
          newPosition = index - 1;
        }
      }
    });
    setSelectedOrder(orders[newPosition]);
  };

  const loadNextOrder = () => {
    let newPosition;
    orders.forEach((order, index) => {
      if (order.osdOrderId === selectedOrder.osdOrderId) {
        if (index === orders.length - 1) {
          newPosition = 0;
        } else {
          newPosition = index + 1;
        }
      }
    });
    setSelectedOrder(orders[newPosition]);
  };

  // defines and sets "loadingSpinner" view status
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div style={{ paddingTop: "150px" }}>
          <Spinner></Spinner>;
        </div>
      );
    } else {
      return null;
    }
  };

  const launchModal = (item, modalType) => {
    let tempUser;
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      tempUser = JSON.parse(localStorage.getItem("user"));
    }

    fetch(`${API}/events/${item.eventNum}`, {
      method: "GET",
    })
      .then(handleErrors)
      .then((response) => response.text())
      .then((result) => {
        console.log("result: ", JSON.parse(result));
        let jsEvents = JSON.parse(result);
        setSelectedEvent(jsEvents);
        if (modalType === "receipt") {
          setSelectedOrder(item);
        } else if (modalType === "tickets") {
          setSelectedTickets(item);
        }
        setModalView(modalType);
      })
      .catch((err) => {
        console.log(
          "Inside '.catch' block of 'getEventData()', this is the error:",
          // NEED TO ADD AN ERROR MODAL
          err
        );
        setModalView("warning");
      });
  };

  const orderItems = () => {
    if (display === "orders") {
      return (
        <Fragment>
          <div>
            {orders.map((order, index) => {
              let longDateTime = getLongStartDate(order.eventId.startDateTime);
              let orderDate = getStartDate(order.createdAt);
              return (
                <Fragment key={index}>
                  <div className={classes.OrdersInnerGrid}>
                    <div>{orderDate}</div>
                    <div />
                    <div>
                      <button
                        className={classes.InvisibleButton}
                        onClick={() => {
                          window.location.href = `/ed/?eventID=${order.eventId.eventNum}`;
                        }}
                      >
                        <span style={{ color: "blue", fontWeight: "600" }}>
                          {order.eventId.eventTitle}
                        </span>
                      </button>
                      <br></br>
                      <div>{longDateTime}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      {order.qrTickets.length}
                    </div>
                    <div style={{ textAlign: "right", paddingRight: "10px" }}>
                      {order.totalPaidAmount.toFixed(2)}
                    </div>
                    <button className={classes.IconButton}>
                      <ion-icon
                        style={{ fontSize: "24px", color: "blue" }}
                        name="receipt-outline"
                        onClick={() => {
                          launchModal(order, "receipt");
                        }}
                      />
                    </button>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </Fragment>
      );
    } else return null;
  };

  const futureEventItems = () => {
    if (display === "future") {
      return (
        <Fragment>
          <div>
            {futureEvents.map((event, index) => {
              console.log("event: ", event);
              let shortMonth, dayDate, longDateTime;
              [shortMonth, dayDate, longDateTime] = getDates(
                event.startDateTime
              );

              return (
                <Fragment key={index}>
                  <div className={classes.FutureInnerGrid}>
                    <div style={{ textAlign: "center" }}>
                      <div className={classes.DateRed}>{shortMonth}</div>
                      <div className={classes.DateBlack}>{dayDate}</div>
                    </div>
                    <div></div>
                    <div>
                      <button
                        className={classes.InvisibleButton}
                        onClick={() => {
                          window.location.href = `/ed/?eventID=${event.eventNum}`;
                        }}
                      >
                        <span style={{ color: "blue", fontWeight: "600" }}>
                          {event.eventTitle}
                        </span>
                      </button>
                      <br></br>
                      {longDateTime}
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <button
                        className={classes.InvisibleButton}
                        onClick={() => {
                          launchModal(event, "tickets");
                        }}
                      >
                        <span style={{ color: "blue", fontWeight: "600" }}>
                          {event.tickets.length}
                        </span>
                      </button>
                    </div>

                    <button className={classes.IconButton}>
                      <ion-icon
                        style={{ fontSize: "24px", color: "blue" }}
                        name="qr-code-outline"
                        onClick={() => {
                          setModalItem(event);
                          setModalView("qrcodes");
                          //switchTab("orders", item);
                        }}
                      />
                    </button>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </Fragment>
      );
    } else return null;
  };

  const pastEventItems = () => {
    if (display === "past") {
      return (
        <Fragment>
          <div>
            {pastEvents.map((event, index) => {
              console.log("event: ", event);
              let shortMonth, dayDate, longDateTime;
              [shortMonth, dayDate, longDateTime] = getDates(
                event.startDateTime
              );

              return (
                <Fragment key={index}>
                  <div className={classes.PastInnerGrid}>
                    <div style={{ textAlign: "center" }}>
                      <div className={classes.DateRed}>{shortMonth}</div>
                      <div className={classes.DateBlack}>{dayDate}</div>
                    </div>
                    <div></div>
                    <div>
                      <button
                        className={classes.InvisibleButton}
                        onClick={() => {
                          window.location.href = `/ed/?eventID=${event.eventNum}`;
                        }}
                      >
                        <span style={{ color: "blue", fontWeight: "600" }}>
                          {event.eventTitle}
                        </span>
                      </button>
                      <br></br>
                      {longDateTime}
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <button
                        className={classes.InvisibleButton}
                        onClick={() => {
                          setModalItem(event);
                          setModalView("tickets");
                          //switchTab("orders", item);
                        }}
                      >
                        <span style={{ color: "blue", fontWeight: "600" }}>
                          {event.tickets.length}
                        </span>
                      </button>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </Fragment>
      );
    } else return null;
  };

  // LOOKS GOOD
  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (display === "orders") {
      return (
        <Fragment>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 80px 500px 60px 70px 80px",
              gridGap: "10px",
              position: "fixed",
              top: "140px",
              height: "30px",
              width: "1030px",
              backgroundColor: "#e7e7e7",
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
              fontWeight: "600",
              verticalAlign: "center",
              paddingTop: "5px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <div>Order Date</div>
            <div>Image</div>
            <div>Event</div>
            <div style={{ textAlign: "center" }}>Tickets</div>
            <div style={{ textAlign: "center" }}>Total</div>
            <div style={{ textAlign: "center" }}>Receipt</div>
          </div>
          <div className={classes.DisplayPanel}>{orderItems()}</div>
        </Fragment>
      );
    } else if (display === "future") {
      return (
        <Fragment>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 80px 500px 60px 80px",
              gridGap: "10px",
              position: "fixed",
              top: "140px",
              height: "30px",
              width: "1030px",
              backgroundColor: "#e7e7e7",
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
              fontWeight: "600",
              verticalAlign: "center",
              paddingTop: "5px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <div style={{ textAlign: "center" }}>Date</div>
            <div>Image</div>
            <div>Event</div>
            <div style={{ textAlign: "center" }}>Tickets</div>
            <div style={{ textAlign: "center" }}>Checkin</div>
          </div>
          <div className={classes.DisplayPanel}>{futureEventItems()}</div>
        </Fragment>
      );
    } else if (display === "past") {
      return (
        <Fragment>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 80px 500px 60px",
              gridGap: "10px",
              position: "fixed",
              top: "140px",
              height: "30px",
              width: "1030px",
              backgroundColor: "#e7e7e7",
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
              fontWeight: "600",
              verticalAlign: "center",
              paddingTop: "5px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <div style={{ textAlign: "center" }}>Date</div>
            <div>Image</div>
            <div>Event</div>
            <div style={{ textAlign: "center" }}>Tickets</div>
          </div>
          <div className={classes.DisplayPanel}>{pastEventItems()}</div>
        </Fragment>
      );
    } else return null;
  };

  // LOOKS GOOD
  // defines and sets "connectionStatus" view status
  const connectionStatus = (condition) => {
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
          There is a problem retrieving your tickets. Please try again later.
        </div>
      );
    } else return null;
  };

  const receiptModalDisplay = () => {
    if (modalView === "receipt") {
      return (
        <Fragment>
          <ReceiptModal
            show={modalView === "receipt"}
            details={selectedOrder}
            event={selectedEvent}
            close={() => {
              setModalView("none");
            }}
            loadNext={() => {
              loadNextOrder();
            }}
            loadPrevious={() => {
              loadPreviousOrder();
            }}
          />
        </Fragment>
      );
    } else {
      return null;
    }
  };

  const ticketsModalDisplay = () => {
    if (modalView === "tickets") {
      return (
        <Fragment>
          <TicketsModal
            show={modalView === "tickets"}
            details={selectedTickets}
            event={selectedEvent}
            close={() => {
              setModalView("none");
            }}
            //loadNext={() => {loadNextOrder()}}
            //loadPrevious={() => {loadPreviousOrder()}}
          />
        </Fragment>
      );
    } else return null;
  };

  const qrcodesModalDisplay = () => {
    if (modalView === "qrcodes") {
      return (
        <Fragment>
          <QRCodesModal
            show={modalView === "qrcodes"}
            details={modalItem}
            close={() => {
              setModalView("none");
            }}
            //loadNext={() => {loadNextOrder()}}
            //loadPrevious={() => {loadPreviousOrder()}}
          />
        </Fragment>
      );
    } else return null;
  };

  const ordersButton = () => {
    if (display === "orders") {
      return classes.ButtonGrey;
    } else {
      return classes.ButtonClear;
    }
  };

  const futureButton = () => {
    if (display === "future") {
      return classes.ButtonGrey;
    } else {
      return classes.ButtonClear;
    }
  };

  const pastButton = () => {
    if (display === "past") {
      return classes.ButtonGrey;
    } else {
      return classes.ButtonClear;
    }
  };

  const tabTitle = <div className={classes.DisplayPanelTitle}>My Tickets</div>;

  const displayHeader = (
    <div
      className={classes.DisplayView}
      style={{
        display: "grid",
        gridTemplateColumns: "200px 200px 200px",
        paddingRight: "215px",
        paddingLeft: "215px",
      }}
    >
      <button className={futureButton()} onClick={() => setDisplay("future")}>
        Upcoming Events
      </button>
      <button className={pastButton()} onClick={() => setDisplay("past")}>
        Past Events
      </button>
      <button className={ordersButton()} onClick={() => setDisplay("orders")}>
        Order History
      </button>
    </div>
  );

  return (
    <div>
      {tabTitle}
      {displayHeader}
      {loadingSpinner()}
      {mainDisplay()}
      {connectionStatus()}
      {receiptModalDisplay()}
      {ticketsModalDisplay()}
      {qrcodesModalDisplay()}
    </div>
  );
};

export default MyTickets;

/*
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //myHeaders.append("Authorization", `Bearer ${tempUser.token}`);

    let url = `${API}/events/${eventNum}`;
    let fetcharg = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        //setOrders(js);
        console.log("result: ", js);
        //createEventArrays(js);
        //setDisplay("future");
      })
      .catch((error) => {
        //setDisplay("connection");
        console.log("error", error);
      });

      */
