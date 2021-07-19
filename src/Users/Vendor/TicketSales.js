import React, { useEffect, useState, Fragment } from "react";

import { CSVLink } from "react-csv";

import { getDate } from "./Resources/VendorFunctions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";

import classes from "./TicketSales.module.css";
import ReceiptModal from "../Modals/ReceiptModalVendor";

const TicketSales = (props) => {
  console.log("PROPS: ", props);

  const [modalView, setModalView] = useState(false); // defines appearance of ReceiptModal

  const [eventOrders, setEventOrders] = useState([]);
  const [exportOrders, setExportOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState({});

  const [sortParameters, setSortParameters] = useState({
    label: "createdAt",
    direction: "asc",
  });

  const createExportOrders = (eventOrders) => {
    let tempArray = [];
    eventOrders.map((order, index) => {
      let shortDateTime;
      [shortDateTime] = getDate(order.createdAt);
      order.qrTickets.map((ticket, index) => {
        let tempElement = {
          order: index + 1,
          date: shortDateTime,
          firstName: order.firstName,
          lastName: order.lastName,
          totalTickets: order.qty,
          amount: order.totalPaidAmount,
          tickets: index + 1,
          type: ticket.ticketId,
        };
        tempArray.push(tempElement);
      });
    });
    console.log(tempArray);
    setExportOrders(tempArray);
  };

  useEffect(() => {
    setEventOrders(props.orders);
    createExportOrders(props.orders);
  }, [props]);

  console.log("ORDERS: ", props.orders);

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
      let oddOrder = "true";
      let styling = {};
      return (
        <Fragment>
          {eventOrders.map((item, index) => {
            console.log("ORDER: ", item);
            let shortDateTime;
            [shortDateTime] = getDate(item.createdAt);
            if (oddOrder) {
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
              <div key={index} className={classes.Orders} style={styling}>
                <div style={{ textAlign: "left" }}>{shortDateTime}</div>
                <div style={{ textAlign: "left" }}>
                  {item.lastname}, {item.firstname}
                </div>
                <div style={{ textAlign: "left" }}>{item.email}</div>
                <div>{item.qrTickets.length}</div>
                <div style={{ textAlign: "right" }}>
                  {item.totalPaidAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: "22px", textAlign: "center" }}>
                  <button className={classes.EventButton} style={styling}>
                    <ion-icon
                      style={{ fontSize: "24px", color: "blue" }}
                      style={styling}
                      name="receipt-outline"
                      onClick={() => {
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
      //
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
            numberOrders={props.orders.length}
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
      {props.event.eventTitle !== "" ? (
        <div className={classes.TabTitle}>{props.event.eventTitle}</div>
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

  const headers = [
    { label: "Order", key: "order" },
    { label: "Date", key: "date" },
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" },
    { label: "tickets", key: "tickets" },
    { label: "amount", key: "amount" },
    { label: "number", key: "number" },
    { label: "type", key: "type" },
  ];

  const data = [
    {
      order: 1,
      date: "September 1",
      firstname: "Ahmed",
      lastname: "Tomi",
      email: "ah@smthing.co.com",
      tickets: 3,
      amount: 30,
      number: 1,
      type: "general admission",
    },
    {
      order: 1,
      date: "",
      firstname: "",
      lastname: "",
      email: "",
      tickets: "",
      amount: "",
      number: 1,
      type: "VIP",
    },
    {
      order: 1,
      date: "",
      firstname: "",
      lastname: "",
      email: "",
      tickets: "",
      amount: "",
      number: 1,
      type: "Box Seats",
    },
    {
      order: 2,
      date: "September 1",
      firstname: "Raed",
      lastname: "Labes",
      email: "rl@smthing.co.com",
    },
    {
      order: 2,
      date: "",
      firstname: "",
      lastname: "",
      email: "",
      tickets: "",
      amount: "",
      number: 1,
      type: "VIP",
    },
    {
      order: 2,
      date: "",
      firstname: "",
      lastname: "",
      email: "",
      tickets: "",
      amount: "",
      number: 1,
      type: "Box Seats",
    },
    { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" },
    {
      order: 3,
      date: "",
      firstname: "",
      lastname: "",
      email: "",
      tickets: "",
      amount: "",
      number: 1,
      type: "VIP",
    },
    {
      order: 3,
      date: "",
      firstname: "",
      lastname: "",
      email: "",
      tickets: "",
      amount: "",
      number: 1,
      type: "Box Seats",
    },
  ];
  /*
  

        */

  const displayHeader = (
    <div className={classes.DisplayHeader}>
      <div
        style={{
          fontWeight: "600",
          fontSize: "18px",
          paddingLeft: "30px",
        }}
      >
        Ticket Orders{" "}
        <CSVLink
          data={data}
          headers={headers}
          filename={"Attendee List.csv"}
          target="_blank"
        >
          <FontAwesomeIcon
            style={{ fontSize: "20px" }}
            color="blue"
            cursor="pointer"
            icon={faFileCsv}
          />
        </CSVLink>
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
            name="lastname"
            onClick={(e) => {
              updateValues(e.target.name);
            }}
          >
            Last{" "}
          </button>
          ,{" "}
          <button
            className={classes.SortButton}
            name="firstname"
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
            name="qty"
            onClick={(e) => {
              updateValues(e.target.name);
            }}
          >
            Tickets
          </button>
        </div>
        <div style={{ textAlign: "right" }}>
          <button
            className={classes.SortButton}
            name="totalPaidAmount"
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
