import React, { useEffect, useState } from "react";

import { getDate } from "./VendorFunctions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import classes from "./TicketSales.module.css";

const TicketSales = (props) => {
  const [selectedEventTitle, setSelectedEventTitle] = useState(""); //event details of a single selected event

  const [eventOrders, setEventOrders] = useState([]);
  const [ordersView, setOrdersView] = useState("complete"); // complete, noOrders, or noEventSelected
  const [isLoading, setIsLoading] = useState(false); //

  const loadEventTitle = (eventNum) => {
    let tempEvents = JSON.parse(localStorage.getItem("events"));
    tempEvents.forEach((event, index) => {
      if (event.eventNum === eventNum) {
        setSelectedEventTitle(event.eventTitle);
      }
    })
  }

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {

      if (localStorage.getItem(`orders`) !== null && localStorage.getItem(`events`) !== null) {
        let storedEvents = JSON.parse(localStorage.getItem("events"));
        let storedOrders = JSON.parse(localStorage.getItem("orders"));

        if (storedOrders.length > 0) {
          
          if (localStorage.getItem(`eventNum`) !== null) {
            let storedEventNum = JSON.parse(localStorage.getItem("eventNum"));
            storedEvents.forEach((event, index) => {
              if (event.eventNum === storedEventNum) {
                loadEventTitle(storedEventNum)
              }
            })

            let ordersExist = false;
            let tempEventOrders = [];
            storedOrders.forEach((order) => {
              if (order.eventNum === storedEventNum) {
                order.key = Math.floor(Math.random() * 1000000000000000);
                order.view = false;
                tempEventOrders.push(order)
                ordersExist = true;
              }
            })
            
            if (ordersExist) {
              setEventOrders(tempEventOrders)
              setOrdersView("complete");
            } else {
              setOrdersView("noOrders");
            }

          } else {
            setOrdersView("noEventSelected");
          }

        } else {
          props.clicked("events")
        }

      } else {
        props.clicked("events")
      }
        
    } else {
      window.location.href = "/signin";
    }

    setIsLoading(false);
  }, []);

  const [sortParameters, setSortParameters] = useState(
    {label: "order_createdAt", direction: "asc"}
  );

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

  const switchView = (item) => {
    let tempEventOrders = [...eventOrders]
    tempEventOrders.forEach(order => {
      if (item.key === order.key) {
        order.view = !order.view;
      }
    })
    setEventOrders(tempEventOrders);
  }

  const orders = () => {
    if (eventOrders.length > 0) {
      return (
        <div>
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
                name="order_firstName"
                onClick={(e) => {updateValues(e.target.name)}}
              >
                First
              </button>
            </div>
            <div>
              <button 
                className={classes.SortButton}
                name="order_lastName"
                onClick={(e) => {updateValues(e.target.name)}}
              >
                Last
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
            <div style={{ textAlign: "center" }}>
              <button 
                className={classes.SortButton}
                name="order_numTickets"
                onClick={(e) => {updateValues(e.target.name)}}
              >
                # Tickets
              </button>
            </div>
            <div style={{ textAlign: "center" }}>
              <button 
                className={classes.SortButton}
                name="order_totalAmount"
                onClick={(e) => {updateValues(e.target.name)}}
              >
                Total
              </button>
            </div>
          </div>
          {eventOrders.map((item, index) => {
            let shortDateTime;
            [shortDateTime] = getDate(item);

            return (
              <div>
                <div className={classes.Orders}>
                  <div style={{ fontSize: "12px", textAlign: "center" }}>          
                    <FontAwesomeIcon
                      color="black"
                      size="sm"
                      cursor="pointer"
                      onClick={() => {
                        switchView(item);
                      }}
                      icon={item.view ? faChevronUp : faChevronDown}
                    />
                  </div>
                  <div style={{textAlign: "left"}}>{shortDateTime}</div>
                  <div style={{textAlign: "left"}}>{item.order_firstName}</div>
                  <div style={{textAlign: "left"}}>{item.order_lastName}</div>
                  <div style={{textAlign: "left"}}>{item.order_email}</div>
                  <div>{item.order_numTickets}</div>
                  <div style={{textAlign: "right", paddingRight: "20px"}}>{item.order_totalAmount.toFixed(2)}</div>
                </div>
                {item.view ?
                  <div>
                    {item.order_ticketItems.map((ticket, index) => {
                      let paymentMethod;
                      if ("order_gateway" in item) {
                        paymentMethod = item.order_gateway;
                      } else if (ticket.item_total_price.toFixed(2) !== "0.00") {
                        paymentMethod = ticket.manualPaymentMethod;
                      } else {
                        paymentMethod = "comp";
                      }
                      return (
                        <div className={classes.Tickets}>
                          <div style={{textAlign: "right"}}>{ticket.numTix}</div>
                          <div></div>
                          <div style={{textAlign: "left"}}>{"@ "}{ticket.unit_price.toFixed(2)}{": "}{ticket.ticketName}</div>
                          <div style={{textAlign: "right"}}>{ticket.item_total_price.toFixed(2)}</div>
                          <div style={{textAlign: "left"}}>{": "}{paymentMethod}</div>
                        </div>
                      )
                    })}
                  </div> :
                  null
                }
              </div>
            );
          })}
        </div>
      )
    } else return null
  }

  const ordersDisplay = () => {
    if (ordersView === "complete") {
      return (
        <div>
          {orders()}
        </div>
      )
    } else if (ordersView === "noEventSelected") {
      return (
        <div style={{fontSize: "16px", paddingLeft: "20px"}}>
          <div  style={{paddingTop: "20px"}}>
            You must first
            <button
              className={classes.NoButton}
              onClick={() => {props.clicked("events")}}
            >
            {" "}select{" "}
            </button>
            an event
          </div>
        </div>
      )
    } else if (ordersView === "noOrders") {
      return (
        <div  style={{fontSize: "16px", paddingLeft: "20px"}}>
          <div  style={{paddingTop: "20px"}}>There are no orders associated with this event.</div>
          <div  style={{paddingTop: "20px"}}
            >Please
            <button
              className={classes.NoButton}
              onClick={() => {props.clicked("events")}}
            >
            {" "}select{" "}
            </button>
            a different event.
          </div>
        </div>
      )
    }
    else {
      return null;
    }
  }

  const mainDisplay = () => {
    return (
      <div style={{paddingTop: "80px", paddingLeft: "30px"}}>
        <div style={{fontWeight: "600", fontSize: "18px"}}>Ticket Orders</div>
        {ordersDisplay()}
      </div>
    )
  }

  const tabTitle = (
    <div className={classes.DashboardHeader}>
      {(!isLoading && selectedEventTitle !== "") ?
      <div style={{fontSize: "26px", fontWeight: "600"}}>{selectedEventTitle}</div>
      :
      <div><br></br></div>}
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

  return (
    <div className={classes.DisplayPanel}>
      {tabTitle}
      {mainDisplay()}
    </div>
  )
}

export default TicketSales;