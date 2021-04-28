import React, { useEffect, useState, Fragment } from "react";

import { getDate } from "./Resources/VendorFunctions";

import classes from "./TicketSales.module.css";
import ReceiptModal from "./Modals/ReceiptModal";

const TicketSales = (props) => {
  const [modalView, setModalView] = useState(false); // defines appearance of ReceiptModal
  const [eventOrders, setEventOrders] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [selectedOrder, setSelectedOrder] = useState({});
  const [sortParameters, setSortParameters] = useState({
    label: "createdAt",
    direction: "asc",
  });

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      // create an array of objects to hold transactions by ticket type
      let tempOrders = [];
      props.event.tickets.forEach((ticket) => {
        tempOrders.push({
          ticketId: ticket._id,
          ticketName: ticket.ticketName,
          ticketsSold: 0,
          ticketPrice: ticket.currentTicketPrice,
          grossTotal: 0,
          netTotal: 0,
        });
      });
      console.log("tempOrders: ", tempOrders);

      // populate this ticketOrder array
      props.orders.forEach((order) => {
        order.qrTickets.forEach((qrTix) => {
          //console.log("qrTix: ", qrTix.ticketId);
          tempOrders.forEach((ticketType, index) => {
            if (ticketType.ticketId === qrTix.ticketId) {
              //console.log("We have a match");
              tempOrders[index].ticketsSold += 1;
              tempOrders[index].grossTotal += parseFloat(qrTix.fullPrice);
              tempOrders[index].netTotal += qrTix.sellingPrice;
            }
          });
        });
      });
      console.log("tempOrders: ", tempOrders);

      setEventOrders(props.orders);
      setSelectedEventTitle(props.event.eventTitle);
    } else {
      window.location.href = "/auth";
    }
  }, [props]);

  const compareValues = (key, order) => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  };

  const updateValues = (newLabel) => {
    let newDirection;
    if (newLabel !== sortParameters.label) {
      newDirection = sortParameters.direction;
    } else if (sortParameters.direction === "asc") {
      newDirection = "desc";
    } else {
      newDirection = "asc";
    }
    let temp;
    temp = [...eventOrders];
    temp.sort(compareValues(newLabel, newDirection));
    setEventOrders(temp);
    setSortParameters({ label: newLabel, direction: newDirection });
  };

  const mainDisplay = () => {
    if (props.orders.length > 0) {
      return (
        <Fragment>
          {eventOrders.map((item, index) => {
            let shortDateTime;
            [shortDateTime] = getDate(item);

            return (
              <div key={index} className={classes.Orders}>
                <div style={{ textAlign: "left" }}>{shortDateTime}</div>
                <div style={{ textAlign: "left" }}>
                  {item.lastName}, {item.firstName}
                </div>
                <div style={{ textAlign: "left" }}>{item.email}</div>
                <div>{item.qrTickets.length}</div>
                <div style={{ textAlign: "right", paddingRight: "20px" }}>
                  {item.totalAmount}
                </div>
                <div style={{ fontSize: "22px", textAlign: "center" }}>
                  <button className={classes.EventButton}>
                    <ion-icon
                      style={{ fontSize: "24px", color: "blue" }}
                      name="receipt-outline"
                      onClick={() => {
                        console.log("ITEM");
                        setSelectedOrder(item);
                        setModalView(true);
                      }}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </Fragment>
      );
    } else {
      return (
        <div className={classes.NoTicketsText}>
          There are no past orders associated with this event.
        </div>
      );
    }
  };

  const loadPreviousOrder = () => {
    let newPosition;
    eventOrders.forEach((order, index) => {
      if (order.osdOrderId === selectedOrder.osdOrderId) {
        if (index === 0) {
          newPosition = eventOrders.length - 1;
        } else {
          newPosition = index - 1;
        }
      }
    });
    setSelectedOrder(eventOrders[newPosition]);
  };

  const loadNextOrder = () => {
    let newPosition;
    eventOrders.forEach((order, index) => {
      if (order.osdOrderId === selectedOrder.osdOrderId) {
        if (index === eventOrders.length - 1) {
          newPosition = 0;
        } else {
          newPosition = index + 1;
        }
      }
    });
    setSelectedOrder(eventOrders[newPosition]);
  };

  const receiptModalDisplay = () => {
    if (modalView) {
      return (
        <Fragment>
          <ReceiptModal
            show={modalView}
            details={selectedOrder}
            event={props.event}
            close={() => {
              setModalView(false);
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
    } else return null;
  };

  const tabTitle = (
    <div className={classes.DisplayPanelTitle}>
      {selectedEventTitle !== "" ? (
        <div style={{ fontSize: "26px", fontWeight: "600" }}>
          {selectedEventTitle}
        </div>
      ) : (
        <div>{null}</div>
      )}
      <div style={{ paddingTop: "5px" }}>
        <button
          className={classes.SwitchButton}
          onClick={() => {
            props.toEvents("events");
          }}
        >
          Switch Event
        </button>
      </div>
    </div>
  );

  const displayHeader = (
    <div className={classes.DisplayHeader}>
      <div style={{ fontWeight: "600", fontSize: "18px", paddingLeft: "30px" }}>
        Ticket Orders
      </div>
      <div className={classes.OrdersHeader}>
        <div>
          <button
            className={classes.SortButton}
            name="createdAt"
            onClick={(e) => {
              updateValues(e.target.name);
            }}
          >
            Order Date
          </button>
        </div>
        <div>
          <button
            className={classes.SortButton}
            name="lastName"
            onClick={(e) => {
              updateValues(e.target.name);
            }}
          >
            Last{" "}
          </button>
          ,{" "}
          <button
            className={classes.SortButton}
            name="firstName"
            onClick={(e) => {
              updateValues(e.target.name);
            }}
          >
            First{" "}
          </button>
        </div>
        <div>
          <button
            className={classes.SortButton}
            name="email"
            onClick={(e) => {
              updateValues(e.target.name);
            }}
          >
            Customer Email
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            className={classes.SortButton}
            name="numTickets"
            onClick={(e) => {
              updateValues(e.target.name);
            }}
          >
            Tickets
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            className={classes.SortButton}
            name="totalAmount"
            onClick={(e) => {
              updateValues(e.target.name);
            }}
          >
            Total
          </button>
        </div>
        <div style={{ textAlign: "center" }}>Receipt</div>
      </div>
    </div>
  );

  return (
    <div>
      {tabTitle}
      {displayHeader}
      <div className={classes.DisplayPanel}>{mainDisplay()}</div>
      {receiptModalDisplay()}
    </div>
  );
};

export default TicketSales;
