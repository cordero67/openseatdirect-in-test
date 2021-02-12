import React, { useEffect, useState, Fragment } from "react";

import { getDate } from "./Resources/VendorFunctions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

import classes from "./TicketSales.module.css";
import ReceiptModal from "./Modals/ReceiptModal";
import Spinner from "../../components/UI/Spinner/Spinner";

const TicketSales = (props) => {
  const [display, setDisplay] = useState("spinner"); //main, spinner
  const [modalView, setModalView] = useState(false);

  const [eventOrders, setEventOrders] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [selectedOrder, setSelectedOrder] = useState({})

  const [sortParameters, setSortParameters] = useState(
    {label: "order_createdAt", direction: "asc"}
  );

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {
      if (
        localStorage.getItem(`orders`) !== null &&
        localStorage.getItem(`events`) !== null &&
        localStorage.getItem(`eventNum`) !== null
        ) {
        let storedEvents = JSON.parse(localStorage.getItem("events"));
        let storedOrders = JSON.parse(localStorage.getItem("orders"));
        let storedEventNum = JSON.parse(localStorage.getItem("eventNum"));

        storedEvents.forEach(event => {
          if (event.eventNum === storedEventNum) {
            loadEventTitle(storedEventNum)
          }
        })

        let tempEventOrders = [];
        storedOrders.forEach((order) => {
          if (order.eventNum === storedEventNum) {
            order.key = Math.floor(Math.random() * 1000000000000000);
            order.view = false;
            tempEventOrders.push(order);
          }
        })
        setEventOrders(tempEventOrders)
        
      } else {
        props.clicked("events")
      }
    } else {
      window.location.href = "/auth";
    }
    setDisplay("main")
  }, []);

  const loadEventTitle = (eventNum) => {
    let tempEvents = JSON.parse(localStorage.getItem("events"));
    tempEvents.forEach((event, index) => {
      if (event.eventNum === eventNum) {
        setSelectedEventTitle(event.eventTitle);
      }
    })
  }

  const compareValues = (key, order) => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

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
    setSortParameters(
      {label: newLabel, direction: newDirection}
    )
  }

  const mainDisplay = () => {
    if (display === "main" && eventOrders.length > 0) {
      return (
        <Fragment>
          {eventOrders.map((item, index) => {
            let shortDateTime;
            [shortDateTime] = getDate(item);
            return (
              <div
                key={index}
                className={classes.Orders}
              >
                <div style={{textAlign: "left"}}>{shortDateTime}</div>
                <div style={{textAlign: "left"}}>{item.order_lastName},{" "}{item.order_firstName}</div>
                <div style={{textAlign: "left"}}>{item.order_email}</div>
                <div>{item.order_numTickets}</div>
                <div style={{textAlign: "right", paddingRight: "20px"}}></div>
                <div style={{ fontSize: "22px", textAlign: "center" }}>          
                  <FontAwesomeIcon
                    color="blue"
                    size="sm"
                    cursor="pointer"
                    onClick={() => {
                      setSelectedOrder(item)
                      setModalView(true)
                    }}
                    icon={faReceipt}
                  />
                </div>
              </div>
            );
          })}
        </Fragment>
      )
    } else if (display === "main") {
      return (
        <div className={classes.NoTicketsText}>
          There are no past orders associated with this event.
        </div>
      )
    } else return null
  }

  const loadPreviousOrder = () => {
    let newPosition;
    eventOrders.map((order, index) => {
      if (order.key === selectedOrder.key) {
        if (index === 0) {
          newPosition = eventOrders.length - 1;
        } else {
          newPosition = index - 1;
        }
      }
    })
    setSelectedOrder(eventOrders[newPosition]);
  }

  const loadNextOrder = () => {
    let newPosition;
    eventOrders.map((order, index) => {
      if (order.key === selectedOrder.key) {
        if (index === (eventOrders.length - 1)) {
          newPosition = 0;
        } else {
          newPosition = index + 1;
        }
      }
    })
    setSelectedOrder(eventOrders[newPosition]);
  }

  const receiptModalDisplay = () => {
    if (modalView) {
      return (
        <Fragment>
          <ReceiptModal
            show={modalView}
            details={selectedOrder}
            close={() => {setModalView(false)}}
            loadNext={() => {loadNextOrder()}}
            loadPrevious={() => {loadPreviousOrder()}}
          />
        </Fragment>
      )
    } else return null;
  }

  const tabTitle = (
    <div className={classes.DisplayPanelTitle}>
      {(display === "main" && selectedEventTitle !== "") ?
        <div style={{fontSize: "26px", fontWeight: "600"}}>{selectedEventTitle}</div>:
        <div>{null}</div>
      }
      <div style={{paddingTop: "5px"}}>
        <button
          className={classes.SwitchButton}
          onClick={() => {props.clicked("events")}}
        >
          Switch Event
        </button>
      </div>
    </div>
  )

  const displayHeader = (
    <div className={classes.DisplayHeader}>
      <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Ticket Orders</div>
      <div className={classes.OrdersHeader}>
        <div>
          <button 
            className={classes.SortButton}
            name="order_createdAt"
            onClick={(e) => {updateValues(e.target.name)}}
          >
            Order Date
          </button>
        </div>
        <div>
          <button 
            className={classes.SortButton}
            name="order_lastName"
            onClick={(e) => {updateValues(e.target.name)}}
          >
            Last{" "}
          </button>,{" "}
          <button 
            className={classes.SortButton}
            name="order_firstName"
            onClick={(e) => {updateValues(e.target.name)}}
          >
            First{" "}
          </button>
        </div>
        <div>
          <button 
            className={classes.SortButton}
            name="order_email"
            onClick={(e) => {updateValues(e.target.name)}}
          >
            Customer Email
          </button>
        </div>
        <div style={{textAlign: "center"}}>
          <button 
            className={classes.SortButton}
            name="order_numTickets"
            onClick={(e) => {updateValues(e.target.name)}}
          >
            Tickets
          </button>
        </div>
        <div style={{textAlign: "center"}}>
          <button 
            className={classes.SortButton}
            name="order_totalAmount"
            onClick={(e) => {updateValues(e.target.name)}}
          >
            Total
          </button>
        </div>
        <div style={{textAlign: "center"}}>Receipt</div>
      </div>
    </div>
  )

  const loadingSpinner = () => {
      if (display === "spinner") {
      return (
        <div style={{paddingTop: "60px"}}>
          <Spinner/>
        </div>
      )
      } else {
          return null
      }
  }

  return (
    <div>
      {tabTitle}
      {displayHeader}
      <div className={classes.DisplayPanel}>
        {loadingSpinner()}
        {mainDisplay()}
      </div>
      {receiptModalDisplay()}
    </div>
  )
}

export default TicketSales;