import React, { useEffect, useState, Fragment } from "react";
import Spinner from "../../components/UI/Spinner/Spinner";

import { API } from "../../config";
import classes from "./TicketWallet.module.css";
import ReceiptModal from "../Modals/ReceiptModalBuyer";
import TicketsModal from "../Modals/TicketsModal";
import QRCodesModal from "../Modals/QRCodesModal";
import WarningModal from "../Vendor/Modals/WarningModal";

import {
  getLongStartDate,
  getDates,
  getStartDate,
} from "../Vendor/Resources/VendorFunctions";

const MyTickets = () => {
  const [display, setDisplay] = useState("spinner"); // orders, future, past, spinner, connection
  const [modalView, setModalView] = useState("none"); // none, receipt, tickets, qrcode, warning

  const [ticketBuyer, setTicketBuyer] = useState({});
  const [orders, setOrders] = useState([]); // holds all orders for the given buyer
  const [futureEvents, setFutureEvents] = useState([]); // an array of events that tickets were received for future events
  const [pastEvents, setPastEvents] = useState([]); // an array of events that tickets were received for past events

  const [selectedOrder, setSelectedOrder] = useState({}); // order to populate receipt modal
  const [selectedTickets, setSelectedTickets] = useState({}); // tickets to populate tickets modal
  const [selectedEvent, setSelectedEvent] = useState({}); // event to populate receipt and ticket modals

  const handleErrors = (response) => {
    if (!response.ok) {
      console.log("error in 'handleErrors()'");
      throw Error(response.status);
    }
    return response;
  };

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
        if (js.length > 0) {
          console.log("LENGTH");
          setTicketBuyer({
            firstName: js[0].firstname,
            lastName: js[0].lastname,
          });
        }
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

    console.log("ORDERS: ", orders);

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

    // populates "tempArray" with individual ticket purchase information, not individual order information
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
        setFutureEvents(tempFutureArray);
      } else {
        tempPastArray.push(event);
        setPastEvents(tempPastArray);
      }
    });
    console.log("tempFutureArray: ", tempFutureArray);
    console.log("tempPastArray: ", tempPastArray);
  };

  const previousOrder = () => {
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
    launchModal(orders[newPosition], "receipt");
  };

  const nextOrder = () => {
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
    launchModal(orders[newPosition], "receipt");
  };

  const nextFutureTicket = () => {
    let newPosition;
    futureEvents.forEach((event, index) => {
      if (event.eventNum === selectedTickets.eventNum) {
        if (index === futureEvents.length - 1) {
          newPosition = 0;
        } else {
          newPosition = index + 1;
        }
      }
    });
    launchModal(futureEvents[newPosition], "future");
  };

  const previousFutureTicket = () => {
    let newPosition;
    futureEvents.forEach((event, index) => {
      if (event.eventNum === selectedTickets.eventNum) {
        if (index === 0) {
          newPosition = futureEvents.length - 1;
        } else {
          newPosition = index - 1;
        }
      }
    });
    launchModal(futureEvents[newPosition], "future");
  };

  const nextPastTicket = () => {
    let newPosition;
    pastEvents.forEach((event, index) => {
      if (event.eventNum === selectedTickets.eventNum) {
        if (index === pastEvents.length - 1) {
          newPosition = 0;
        } else {
          newPosition = index + 1;
        }
      }
    });
    launchModal(pastEvents[newPosition], "past");
  };

  const previousPastTicket = () => {
    let newPosition;
    pastEvents.forEach((event, index) => {
      if (event.eventNum === selectedTickets.eventNum) {
        if (index === 0) {
          newPosition = pastEvents.length - 1;
        } else {
          newPosition = index - 1;
        }
      }
    });
    launchModal(pastEvents[newPosition], "past");
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

  const launchModal = (item, type) => {
    console.log("ITEM: ", item);
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
        if (type === "receipt") {
          setSelectedOrder(item);
          setModalView("receipt");
        } else if (type === "future") {
          setSelectedTickets(item);
          setModalView("future");
        } else if (type === "past") {
          setSelectedTickets(item);
          setModalView("past");
        } else if (type === "qrcodes") {
          setSelectedTickets(item);
          setModalView("qrcodes");
        } else {
          setModalView("none");
        }
      })
      .catch((err) => {
        console.log("error:", err);
        setModalView("warning");
      });
  };

  const orderItems = () => {
    if (display === "orders") {
      let oddOrder = true;
      let styling = {};
      return (
        <Fragment>
          <div>
            {orders.map((order, index) => {
              let longDateTime = getLongStartDate(order.eventId.startDateTime);
              let orderDate = getStartDate(order.createdAt);
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
                <Fragment key={index}>
                  <div className={classes.OrdersInnerGrid} style={styling}>
                    <div>{orderDate}</div>
                    <div />
                    <div>
                      <button
                        className={classes.InvisibleButton}
                        style={styling}
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
                    <button className={classes.IconButton} style={styling}>
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
      let oddOrder = true;
      let styling = {};
      return (
        <Fragment>
          <div>
            {futureEvents.map((event, index) => {
              let shortMonth, dayDate, longDateTime;
              [shortMonth, dayDate, longDateTime] = getDates(
                event.startDateTime
              );
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
                <Fragment key={index}>
                  <div className={classes.FutureInnerGrid} style={styling}>
                    <div style={{ textAlign: "center" }}>
                      <div className={classes.DateRed}>{shortMonth}</div>
                      <div className={classes.DateBlack}>{dayDate}</div>
                    </div>
                    <div></div>
                    <div>
                      <button
                        className={classes.InvisibleButton}
                        style={styling}
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
                        style={styling}
                        onClick={() => {
                          launchModal(event, "future");
                        }}
                      >
                        <span style={{ color: "blue", fontWeight: "600" }}>
                          {event.tickets.length}
                        </span>
                      </button>
                    </div>

                    <button className={classes.IconButton} style={styling}>
                      <ion-icon
                        style={{ fontSize: "24px", color: "blue" }}
                        name="qr-code-outline"
                        onClick={() => {
                          launchModal(event, "qrcodes");
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
      let oddOrder = true;
      let styling = {};
      return (
        <Fragment>
          <div>
            {pastEvents.map((event, index) => {
              console.log("event: ", event);
              let shortMonth, dayDate, longDateTime;
              [shortMonth, dayDate, longDateTime] = getDates(
                event.startDateTime
              );
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
                <Fragment key={index}>
                  <div className={classes.PastInnerGrid} style={styling}>
                    <div style={{ textAlign: "center" }}>
                      <div className={classes.DateRed}>{shortMonth}</div>
                      <div className={classes.DateBlack}>{dayDate}</div>
                    </div>
                    <div></div>
                    <div>
                      <button
                        className={classes.InvisibleButton}
                        style={styling}
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
                        style={styling}
                        onClick={() => {
                          launchModal(event, "past");
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
          <div className={classes.OrdersGrid}>
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
          <div className={classes.FutureGrid}>
            <div style={{ textAlign: "center" }}>Date</div>
            <div>Image</div>
            <div>Event</div>
            <div style={{ textAlign: "center" }}>Tickets</div>
            <div style={{ textAlign: "center" }}>Check In</div>
          </div>
          <div className={classes.DisplayPanel}>{futureEventItems()}</div>
        </Fragment>
      );
    } else if (display === "past") {
      return (
        <Fragment>
          <div className={classes.PastGrid}>
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
  const connectionStatus = () => {
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
            numberOrders={orders.length}
            close={() => {
              setModalView("none");
            }}
            loadNext={() => {
              nextOrder();
            }}
            loadPrevious={() => {
              previousOrder();
            }}
          />
        </Fragment>
      );
    } else return null;
  };

  const futureTicketsModalDisplay = () => {
    if (modalView === "future") {
      return (
        <Fragment>
          <TicketsModal
            show={modalView === "future"}
            buyer={ticketBuyer}
            details={selectedTickets}
            event={selectedEvent}
            numberEvents={futureEvents.length}
            close={() => {
              setModalView("none");
            }}
            loadNext={() => {
              nextFutureTicket();
            }}
            loadPrevious={() => {
              previousFutureTicket();
            }}
          />
        </Fragment>
      );
    } else return null;
  };

  const pastTicketsModalDisplay = () => {
    if (modalView === "past") {
      return (
        <Fragment>
          <TicketsModal
            show={modalView === "past"}
            buyer={ticketBuyer}
            details={selectedTickets}
            event={selectedEvent}
            numberEvents={pastEvents.length}
            close={() => {
              setModalView("none");
            }}
            loadNext={() => {
              nextPastTicket();
            }}
            loadPrevious={() => {
              previousPastTicket();
            }}
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
            details={selectedTickets}
            event={selectedEvent}
            close={() => {
              setModalView("none");
            }}
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
    <div className={classes.DisplayView}>
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
      {futureTicketsModalDisplay()}
      {pastTicketsModalDisplay()}
      {qrcodesModalDisplay()}
    </div>
  );
};

export default MyTickets;
