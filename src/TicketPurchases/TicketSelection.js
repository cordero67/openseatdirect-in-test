import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import dateFormat from "dateformat";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import Aux from "../hoc/Auxiliary/Auxiliary";
import { getEventData } from "./apiCore";
import { getDateStr } from "../components/formuals";
import Spinner from "../components/UI/Spinner/Spinner";

import CocinaCandelaLogo from "../assets/Cocina_Candela/cocina-candela-large.jpg";
import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import TicketItem from "./TicketItem";
import styles from "./Order.module.css";

// CODE TRANSFERRED FROM "EventData"
// defines an event's NON ticket type specific information
let eventDetails;

// CODE TRANSFERRED FROM "EventData"
// defines ticket order object
// contains event information and ticket type specific data
// this object is sent to "Checkout" page
let ticketOrder;

const SingleEvent = () => {
  // **DECISION CODE**
  // **NOTED**
  const [showDoublePane, setShowDoublePane] = useState(false);

  // **DECISION CODE**
  // **NOTED**
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const [isLoading, setIsLoading] = useState(true);

  // CODE TRANSFERRED FROM "EventData"
  // defines an event's specific ticket type information
  // also tracks the number of tickets selected throughout selection process
  const [ticketInfo, setTicketInfo] = useState([]);

  // **DECISION CODE**
  // **NOTED**
  useEffect(() => {
    setIsLoading(true);
    // CODE TRANSFERRED FROM "EventData"
    eventData(queryString.parse(window.location.search).eventID);
    // determines initial window width and then
    // determines a one or two pane display
    if (window.innerWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
  }, []);

  // CODE TRANSFERRED FROM "EventData"
  const eventData = eventID => {
    getEventData(eventID)
      .then(res => {
        console.log("Event Data Received: ", res);
        console.log("startDateTime Data Received: ", res.startDateTime);
        console.log("endDateTime Data Received: ", res.endDateTime);
        loadEventDetails(res);
        loadTicketInfo(res.ticket);
        createTicketOrder(res);
        console.log("eventDetails: ", eventDetails);
        console.log("ticketOrder: ", ticketOrder);
        console.log("ticketInfo: ", ticketInfo);
      })
      .catch(err => {
        console.log("In the catch");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // CODE TRANSFERRED FROM "EventData"
  const loadEventDetails = event => {
    eventDetails = {
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventCategory: event.eventCategory,
      eventStatus: event.eventStatus,
      longDescription: event.longDescription,
      organizer: event.organizerName,
      shortDescription: event.shortDescription,
      startDateTime: dateFormat(
        event.startDateTime,
        "dddd, mmmm dS, yyyy, h:MM:ss TT"
      ),
      endDateTime: dateFormat(
        event.endDateTime,
        "dddd, mmmm dS, yyyy, h:MM:ss TT"
      ),
      organizerUrl: event.organizerUrl,
      eventUrl: event.eventUrl,
      location: {
        venueName: event.locationVenueName,
        address1: event.locationAddress1,
        address2: "",
        city: "Montclair",
        state: event.locationState,
        zipPostalCode: event.locationZipPostalCode,
        countryCode: event.locationCountryCode
      },
      image: ""
    };
  };

  // CODE TRANSFERRED FROM "EventData"
  const loadTicketInfo = ticket => {
    let tempTicketArray = [];
    ticket.map(item => {
      const tempTicketItem = {
        ticketID: item._id,
        ticketType: item.ticketType,
        ticketName: item.ticketName,
        ticketDescription: item.ticketDescription,
        ticketsAvailable: item.remainingQuantity,
        ticketPrice: item.currentTicketPrice,
        ticketsSelected: 0,
        maxTicketOrder: item.maxTicketsAllowedPerOrder,
        minTicketOrder: item.minTicketsAllowedPerOrder
      };
      tempTicketArray.push(tempTicketItem);
    });
    setTicketInfo(tempTicketArray);
  };

  // CODE TRANSFERRED FROM "EventData"
  const createTicketOrder = event => {
    const ticketParameters = [];
    event.ticket.map(item => {
      const newTicketItem = {
        ticketID: item._id,
        ticketPrice: item.currentTicketPrice,
        ticketName: item.ticketName,
        ticketsSelected: 0
      };
      ticketParameters.push(newTicketItem);
    });
    ticketOrder = {
      eventNum: event.eventNum,
      eventUrl: event.eventUrl,
      eventName: event.eventTitle,
      startDateTime: dateFormat(
        event.startDateTime,
        "dddd, mmmm dS, yyyy, h:MM:ss TT"
      ),
      endDateTime: dateFormat(
        event.endDateTime,
        "dddd, mmmm dS, yyyy, h:MM:ss TT"
      ),
      totalPurchaseAmount: 0,
      ticketsPurchased: 0,
      tickets: ticketParameters
    };
    console.log("ticketOrder: ", ticketOrder);
  };

  // CODE TRANSFERRED FROM "EventData"
  let eventTitle;

  // CODE TRANSFERRED FROM "EventData"
  if (!isLoading) {
    eventTitle = (
      <Aux>
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip ellipsis",
            fontSize: "1.125rem",
            fontWeight: "600"
          }}
        >
          {eventDetails.eventTitle}
        </div>
        <div
          style={{
            fontSize: "1.0rem",
            fontWeight: "400"
          }}
        >
          {eventDetails.startDateTime}
        </div>
      </Aux>
    );
  } else eventTitle = null;

  // CODE TRANSFERRED FROM "EventData"
  const updateTicketsSelected = (event, ticketType) => {
    // updates "ticketInfo"
    let tempTicketInfo = [...ticketInfo];
    tempTicketInfo.map(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = event.target.value;
      }
    });
    setTicketInfo(tempTicketInfo);
    // updates "ticketOrder.tickets"
    ticketOrder.tickets.map(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = parseInt(ticketType.ticketsSelected);
      }
    });
    // updates "ticketOrder.totalPurchaseAmount" and "ticketOrder.ticketsPurchased"
    let tempTotalPurchaseAmount = 0;
    let temptTicketsPurchased = 0;
    ticketOrder.tickets.map(item => {
      tempTotalPurchaseAmount += item.ticketsSelected * item.ticketPrice;
      temptTicketsPurchased += item.ticketsSelected;
    });
    ticketOrder.totalPurchaseAmount = tempTotalPurchaseAmount;
    ticketOrder.ticketsPurchased = temptTicketsPurchased;
    console.log("ticketOrder.tickets: ", ticketOrder.tickets);
    console.log("ticketOrder: ", ticketOrder);
  };

  // CODE TRANSFERRED FROM "EventData"
  let ticketItems;

  // CODE TRANSFERRED FROM "EventData"
  if (!isLoading) {
    ticketItems = (
      <Aux>
        <div>
          {ticketInfo.map(item => {
            return (
              <Aux>
                <TicketItem
                  name={item}
                  key={item._id}
                  onChange={event => {
                    updateTicketsSelected(event, item);
                  }}
                ></TicketItem>
              </Aux>
            );
          })}
        </div>
      </Aux>
    );
  } else {
    ticketItems = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  }

  // **DECISION CODE**
  // **NOTED**
  window.onresize = function(event) {
    // dynamically determines window width and then
    // determines a one or two pane display
    if (window.innerWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
  };

  // determines whether or not to display the purchase amount
  // "showDoublePane" must be false and "ticketOrder.totalPurchaseAmount" must be > 0
  // **DECISION CODE**
  // **NOTED**
  const totalAmount = show => {
    if (!isLoading && !show && ticketOrder.totalPurchaseAmount > 0) {
      return <div>${ticketOrder.totalPurchaseAmount}</div>;
    } else return null;
  };

  // determines whether or not to display the number of tickets purchased
  // "showDoublePane" must be false and "ticketOrder.ticketsPurchased" must be > 0
  // **DECISION CODE**
  // **NOTED**
  const ticketAmount = show => {
    if (!isLoading && !show && ticketOrder.ticketsPurchased > 0) {
      return <Aux><span className={styles.cartBadge}><sup>{ticketOrder.ticketsPurchased}</sup></span></Aux>;
    } else return null;
  };

  // determines whether or not to display the cart and arrow
  // "showDoublePane" must be false
  // **DECISION CODE**
  // **NOTED**
  const cartLink = show => {
    if (!isLoading && !show) {
      return (
        <div>
          <FontAwesomeIcon
            onClick={switchShowOrderSummary}
            className={styles.faShoppingCart}
            icon={faShoppingCart}
          />{ticketAmount(showDoublePane)}

          {showOrderSummaryOnly ? (
            <FontAwesomeIcon
              onClick={switchShowOrderSummary}
              className={styles.faChevronUp}
              icon={faChevronUp}
            />
          ) : (
            <FontAwesomeIcon
              onClick={switchShowOrderSummary}
              className={styles.faChevronDown}
              icon={faChevronDown}
            />
          )}
        </div>
      );
    } else return null;
  };

  // **DECISION CODE**
  // **NOTED**
  // toggles between "order pane" views
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // NEED TO MODIFY TO SEND "cart" rather than "order"
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      // "localStorage" property allows access the Storage object for a document's origin
      // the stored data is saved across browser sessions and has no expiration time, even when window is closed
      // "setItem()" adds order information to "localStorage" with a key of "order" and a value of "JSON.stringify(data)"
      localStorage.setItem("cart", JSON.stringify(ticketOrder));
    }
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let checkoutButton;

  // NEED TO STYLE
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  if (!isLoading && ticketOrder.totalPurchaseAmount > 0) {
    checkoutButton = (
      <button
        onClick={purchaseTicketHandler}
        disabled={false}
        className={styles.ButtonRed}
      >
        <Link to="/checkout"><span style={{color: "white"}}>Checkout</span></Link>
      </button>
    );
  } else if (!isLoading) {
    checkoutButton = (
      <button
        disabled={true}
        className={styles.ButtonGrey}
      >
        Checkout
      </button>
    );
  } else checkoutButton = null;

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let orderSummary;

  // FULLY STYLED
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  if (!isLoading && ticketOrder.totalPurchaseAmount > 0) {
    orderSummary = (
      <Aux>
        <div style={{ fontWeight: "600" }}>Order Summary</div>
        <br></br>
        {ticketOrder.tickets.map(item => {
          if (item.ticketsSelected > 0) {
            return (
              <Aux>
                <div className={styles.RightGrid}>
                  <div style={{ fontWeight: "400" }}>
                    {item.ticketsSelected} X {item.ticketName}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    ${item.ticketsSelected * item.ticketPrice}{" "}
                  </div>
                </div>
              </Aux>
            );
          }
        })}

        <hr style={{ border: "1px solid#B2B2B2" }} />
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "600" }}>Total</div>
          <div style={{ textAlign: "right" }}>
            ${ticketOrder.totalPurchaseAmount}
          </div>
        </div>
        <br></br>
      </Aux>
    );
  } else if (!isLoading && ticketOrder.totalPurchaseAmount <= 0) {
    orderSummary = (
      <div
        style={{
          color: "grey",
          position: "relative",
          float: "left",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <FontAwesomeIcon
          className={styles.faShoppingCart}
          icon={faShoppingCart}
        />
      </div>
    );
  } else {
    orderSummary = null;
  }

  // **DECISION CODE**
  // **NOTED**
  let orderPane;

  // **DECISION CODE**
  // **NOTED**
  if (showDoublePane) {
    orderPane = (
      <div>
        <div className={styles.ImageBox}>
          <img
            className={styles.Image}
            src={CocinaCandelaLogo}
            alt="Cocina Candela Logo"
          />
        </div>
        <div className={styles.OrderSummary}>{orderSummary}</div>
      </div>
    );
  } else {
    orderPane = (
      <Aux>
        <div>
          <div className={styles.OrderSummaryAlt}>{orderSummary}</div>
        </div>
        <div className={styles.EventFooter}>
          <div
            style={{
              paddingTop: "10px",
              fontWeight: "600"
            }}
          >
            {cartLink(showDoublePane)}
          </div>
          <div
            style={{
              textAlign: "right",
              paddingRight: "10px",
              paddingTop: "8px",
              fontSize: "20px",
              fontWeight: "600"
            }}
          >
            {totalAmount(showDoublePane)}
          </div>
          <div style={{ textAlign: "right" }}>{checkoutButton}</div>
        </div>
      </Aux>
    );
  }

  // **DECISION CODE**
  // **NOTED**
  let ticketPane = (
    <div className={styles.MainItemLeft}>
      <div className={styles.EventHeader}>{eventTitle}</div>
      <div className={styles.EventTicketSection}>
        {ticketItems}
        <div className={styles.EventDescription}>
          Powered by{" "}
          <NavLink to="/" exact>
            <img src={OSDLogo} alt="OpenSeatDirect Logo" />
          </NavLink>
        </div>
        <br></br>
      </div>
      <div className={styles.EventFooter}>
        <div
          style={{
            paddingTop: "8px",
            fontSize: "20px",
            fontWeight: "600"
          }}
        >
          {cartLink(showDoublePane)}
        </div>
        <div
          style={{
            textAlign: "right",
            paddingRight: "10px",
            paddingTop: "8px",
            fontSize: "20px",
            fontWeight: "600"
          }}
        >
          {totalAmount(showDoublePane)}
        </div>
        <div style={{ textAlign: "right" }}>{checkoutButton}</div>
      </div>
    </div>
  );

  // **DECISION CODE**
  // **NOTED**
  let mainDisplay;

  if (showDoublePane) {
    mainDisplay = (
      <Aux>
        <div className={styles.MainGrid}>
          {ticketPane}
          {orderPane}
        </div>
      </Aux>
    );
  } else if (!showOrderSummaryOnly) {
    mainDisplay = (
      <Aux>
        <div className={styles.MainGrid}>{ticketPane}</div>
      </Aux>
    );
  } else {
    mainDisplay = (
      <Aux>
        <div className={styles.MainGrid}>{orderPane}</div>
      </Aux>
    );
  }

  // FULLY STYLED
  return (
    <Aux>
      <div className={styles.MainContainer}>{mainDisplay}</div>
    </Aux>
  );
};

export default SingleEvent;
