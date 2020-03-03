import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import dateFormat from "dateformat";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import Aux from "../hoc/Auxiliary/Auxiliary";
import { getEventData, getEventImage } from "./apiCore";
import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling
} from "./Styling";
import Spinner from "../components/UI/Spinner/Spinner";

import DefaultLogo from "../assets/Get_Your_Tickets.png";
import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import CartLink from "./CartLink";
import OrderSummary from "./OrderSummary";
import TicketItem from "./TicketItem";
import styles from "./Order.module.css";

// defines an event's NON ticket type specific information
let eventDetails;

// defines an event's image
let eventLogo = "";

// defines checkout page address based on payment gateway
let paymentGateway = "/";

// defines ticket order object sent to "Checkout" page: event information and ticket type specific data
let ticketOrder;

let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

const TicketSelection = () => {
  const [showDoublePane, setShowDoublePane] = useState(false);

  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);

  // defines an event's specific ticket type information
  // also tracks the number of tickets selected throughout selection process
  const [ticketInfo, setTicketInfo] = useState([]);

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  useEffect(() => {
    setIsLoadingEvent(true);
    setIsSuccessfull(true);
    console.log("About to call 'eventData()' inside 'TicketSelection'");
    eventData(queryString.parse(window.location.search).eventID);
    //console.log("About to call 'eventImage()' inside 'TicketSelection'");
    // eventImage(queryString.parse(window.location.search).eventID);
    // determines initial window width and then
    // determines a one or two pane display
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    // based on window width, displays one or two panes
    if (inWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
    // set styling parameters
    MainContainer = MainContainerStyling(inWidth, inHeight);
    MainGrid = MainGridStyling(inWidth, inHeight);
    EventTicketSection = EventTicketSectionStyling(inWidth, inHeight);
    OrderSummarySection = OrderSummarySectionStyling(inWidth, inHeight);
    OrderSummarySectionAlt = OrderSummarySectionAltStyling(inWidth, inHeight);

    setIsRestyling(false);
  };

  const eventData = eventID => {
    console.log("Inside 'eventData()' function call inside 'TicketSelection'");
    getEventData(eventID)
      .then(res => {
        console.log(
          "Event Data Received from 'getEventData()' api function: ",
          res
        );
        loadEventDetails(res);
        loadTicketInfo(res.ticket);
        createTicketOrder(res);
        console.log(
          "Inside 'eventData()' function call, eventDetails: ",
          eventDetails
        );
        console.log(
          "Inside 'eventData()' function call, ticketOrder: ",
          ticketOrder
        );
        console.log(
          "Inside 'eventData()' function call, ticketInfo: ",
          ticketInfo
        );

        //console.log("About to call 'eventImage()' inside 'TicketSelection'");
        //eventImage(queryString.parse(window.location.search).eventID);
        console.log("About to call 'getEventImage()' inside 'TicketSelection'");
        getEventImage(eventID)
          .then(res => {
            console.log("Event Image Received: ", res);
            eventLogo = res;
            console.log("eventLogo: ", eventLogo);
            setIsLoadingEvent(false);
          })
          .catch(err => {
            console.log("In the catch 'getEventImage'");
            console.log("No image exists");
            eventLogo = DefaultLogo;
          })
          .finally(() => {
            setIsLoadingEvent(false);
          });
      })
      .catch(err => {
        console.log(
          "In the 'eventData()' '.catch' block inside 'TicketSelection'"
        );
        console.log("This is the error from 'getEventData': ", err);
        if (err === "Error: Error: 400") {
          console.log("I'm handling a 400 error");
        }
        if (err === undefined) {
          console.log("I'm handling an undefined error");
        }
        // need to now handle this situation
        setIsLoadingEvent(true);
        setIsSuccessfull(false);
      })
      .finally(() => {});
  };

  const loadEventDetails = event => {
    console.log("Inside 'loadEventDetails' inside 'TicketSelection'");
    eventDetails = {
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventCategory: event.eventCategory,
      eventStatus: event.eventStatus,
      longDescription: event.longDescription,
      organizer: event.organizerName,
      organizerEmail: event.accountId.accountEmail,
      gateway: event.accountId.paymentGatewayType,
      gatewayClientID: event.accountId.paypalExpress_client_id,
      shortDescription: event.shortDescription,
      startDateTime: dateFormat(
        event.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      ),
      endDateTime: dateFormat(
        event.endDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      ),
      organizerUrl: event.organizerUrl,
      eventUrl: event.eventUrl,
      location: {
        venueName: event.locationVenueName,
        address1: event.locationAddress1,
        city: event.locationCity,
        state: event.locationState,
        zipPostalCode: event.locationZipPostalCode,
        countryCode: event.locationCountryCode
      }
    };
    // sets the checkout page url
    if (eventDetails.gateway === "PayPalExpress") {
      console.log(eventDetails.gateway);
      paymentGateway = "/checkout_pp";
    } else if (eventDetails.gateway === "Braintree") {
      paymentGateway = "/checkout_bt";
    }

    console.log("This is the 'loadEventDetails': ", eventDetails);
  };

  const loadTicketInfo = ticket => {
    console.log("Inside 'loadTicketInfo' inside 'TicketSelection'");
    let tempTicketArray = [];
    ticket.forEach(item => {
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

  const createTicketOrder = event => {
    console.log("Inside 'createTicketOrder' inside 'TicketSelection'");
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null
    ) {
      console.log("ORDER EXISTS!");
      ticketOrder = JSON.parse(
        localStorage.getItem(`cart_${eventDetails.eventNum}`)
      );
      setTicketInfo(ticketOrder.tickets);
    } else {
      const ticketParameters = [];
      event.ticket.forEach(item => {
        const newTicketItem = {
          ticketID: item._id,
          ticketPrice: item.currentTicketPrice,
          ticketName: item.ticketName,
          ticketsSelected: 0,
          ticketDescription: item.ticketDescription
        };
        ticketParameters.push(newTicketItem);
      });
      ticketOrder = {
        gateway: eventDetails.gateway,
        clientID: eventDetails.gatewayClientID,
        location: eventDetails.location,
        userEmail: eventDetails.organizerEmail,
        eventNum: event.eventNum,
        eventUrl: event.eventUrl,
        eventName: event.eventTitle,
        startDateTime: dateFormat(
          event.startDateTime,
          "ddd, mmm d, yyyy - h:MM TT",
          true
        ),
        endDateTime: dateFormat(
          event.endDateTime,
          "ddd, mmm d, yyyy - h:MM TT",
          true
        ),
        totalPurchaseAmount: 0,
        ticketsPurchased: 0,
        tickets: ticketParameters
      };
      console.log("THIS SHOULD HAVE THE GATEWAY INFO");
      console.log("ticketOrder: ", ticketOrder);
    }
  };

  let eventHeader;

  if (!isLoadingEvent) {
    eventHeader = (
      <Aux>
        <div className={styles.EventTitle}
        >
          {eventDetails.eventTitle}
        </div>
        <div className={styles.EventDate}>
          {eventDetails.startDateTime}
        </div>
      </Aux>
    );
  } else eventHeader = null;

  const updateTicketsSelected = (event, ticketType) => {
    // updates "ticketInfo"
    let tempTicketInfo = [...ticketInfo];
    tempTicketInfo.forEach(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = event.target.value;
      }
    });
    setTicketInfo(tempTicketInfo);
    // updates "ticketOrder.tickets"
    ticketOrder.tickets.forEach(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = parseInt(ticketType.ticketsSelected);
      }
    });
    // updates "ticketOrder.totalPurchaseAmount" and "ticketOrder.ticketsPurchased"
    let tempTotalPurchaseAmount = 0;
    let temptTicketsPurchased = 0;
    ticketOrder.tickets.forEach(item => {
      tempTotalPurchaseAmount += item.ticketsSelected * item.ticketPrice;
      temptTicketsPurchased += item.ticketsSelected;
    });
    ticketOrder.totalPurchaseAmount = tempTotalPurchaseAmount;
    ticketOrder.ticketsPurchased = temptTicketsPurchased;
    console.log("ticketOrder.tickets: ", ticketOrder.tickets);
    console.log("ticketOrder: ", ticketOrder);
  };

  let ticketItems;

  if (!isLoadingEvent) {
    ticketItems = (
      <div>
        {ticketInfo.map(item => {
          return (
            <TicketItem
              name={item}
              key={item.ticketID}
              onChange={event => {
                updateTicketsSelected(event, item);
              }}
            ></TicketItem>
          );
        })}
      </div>
    );
  } else {
    ticketItems = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  }

  window.onresize = function(event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };

  // determines whether or not to display the purchase amount
  // "showDoublePane" must be false and "ticketOrder.totalPurchaseAmount" must be > 0
  const totalAmount = show => {
    if (!isLoadingEvent && !show && ticketOrder.totalPurchaseAmount > 0) {
      return <div>${ticketOrder.totalPurchaseAmount}</div>;
    } else return null;
  };

  // determines whether or not to display the number of tickets purchased
  // "showDoublePane" must be false and "ticketOrder.ticketsPurchased" must be > 0
  const ticketAmount = show => {
    if (!isLoadingEvent && !show && ticketOrder.ticketsPurchased > 0) {
      return (
        <Aux>
          <span className={styles.cartBadge}>
            <sup>{ticketOrder.ticketsPurchased}</sup>
          </span>
        </Aux>
      );
    } else return null;
  };

  // determines whether or not to display the cart and arrow
  // "showDoublePane" must be false
  const cartLink = show => {
    if (!isLoadingEvent && !show) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          ticketOrder={ticketOrder}
          isLoading={isLoadingEvent}
          showDoublePane={showDoublePane}
        />
      );
    } else return null;
  };

  // toggles between "order pane" views
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // stores "ticketOrder" and "eventLogo" in "localStorage"
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `cart_${eventDetails.eventNum}`,
        JSON.stringify(ticketOrder)
      );
      localStorage.setItem(`image`, JSON.stringify(eventLogo));
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));
    }
    window.location.href = paymentGateway;
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let checkoutButton;
  if (!isLoadingEvent && ticketOrder.totalPurchaseAmount > 0) {
    checkoutButton = (
      <button
        onClick={purchaseTicketHandler}
        disabled={false}
        className={styles.ButtonRed}
      >
        <span style={{ color: "white" }}>Checkout</span>
      </button>
    );
  } else if (!isLoadingEvent) {
    checkoutButton = (
      <button disabled={true} className={styles.ButtonGrey}>
        Checkout
      </button>
    );
  } else checkoutButton = null;

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let orderSummary;
  if (!isLoadingEvent && ticketOrder.totalPurchaseAmount > 0) {
    orderSummary = <OrderSummary ticketOrder={ticketOrder} />;
  } else if (!isLoadingEvent && ticketOrder.totalPurchaseAmount <= 0) {
    orderSummary = (
      <div className={styles.EmptyOrderSummary}>
        <FontAwesomeIcon
          className={styles.faShoppingCart}
          icon={faShoppingCart}
        />
      </div>
    );
  } else {
    orderSummary = null;
  }

  let orderPane;
  if (showDoublePane) {
    orderPane = (
      <div>
        <img
          className={styles.Image}
          src={eventLogo}
          alt="Event Logo Coming Soon!!!"
        />

        <div style={OrderSummarySection}>{orderSummary}</div>
      </div>
    );
  } else {
    orderPane = (
      <Aux>
        <div>
          <div style={OrderSummarySectionAlt}>{orderSummary}</div>
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

  let ticketPane = (
    <div className={styles.MainItemLeft}>
      <div className={styles.EventHeader}>{eventHeader}</div>
      <div style={EventTicketSection}>
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

  let mainDisplay;

  if (showDoublePane && isSuccessfull) {
    mainDisplay = (
      <Aux>
        <div style={MainGrid}>
          {ticketPane}
          {orderPane}
        </div>
      </Aux>
    );
  } else if (!showOrderSummaryOnly && isSuccessfull) {
    mainDisplay = (
      <Aux>
        <div style={MainGrid}>{ticketPane}</div>
      </Aux>
    );
  } else if (isSuccessfull) {
    mainDisplay = (
      <Aux>
        <div style={MainGrid}>{orderPane}</div>
      </Aux>
    );
  } else {
    mainDisplay = (
      <Aux>
        <div className={styles.BlankCanvas}>
          <h5>
            <span style={{ color: "red" }}>This event does not exist.</span>
          </h5>
        </div>
      </Aux>
    );
  }

  return (
    <Aux>
      <div style={MainContainer}>{mainDisplay}</div>
    </Aux>
  );
};

export default TicketSelection;
