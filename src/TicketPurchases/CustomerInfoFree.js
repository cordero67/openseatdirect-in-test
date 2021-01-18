import React, { useState, useEffect, Fragment } from "react";
import dateFormat from "dateformat";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import { API } from "../config.js";

import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling
} from "./Resources/Styling";
import { DateRange } from "./Resources/PricingFunctions";
import Spinner from "../components/UI/Spinner/Spinner";
import GuestForm from "./Components/GuestForm";
import CartLink from "./CartLink";
import OrderSummary from "./Components/OrderSummary";
import AuthenticationModal from "./Modals/AuthenticationModal";
import { OrderConfirm } from "./Components/OrderConfirms";
import { loadTransactionInfo } from "./Resources/TicketSelectionFunctions";
import classes from "./CustomerInfo.module.css";

// defines the variables that accept the "cart_" data from "localStorage"
let eventDetails = {};
let ticketInfo = {};
let orderTotals = {};

// defines an event's image
let eventLogo = "";

// defines the styling variables
let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

const CustomerInfo = props => {
  // defines panel displayed on main page
  const [display, setDisplay] = useState("spinner"); //main, spinner, confirmation, connection

  // defines 'authenticationModal' display status
  const [modalStatus, setModalStatus] = useState(false);

  // defines single or double pane view control variables
  const [showDoublePane, setShowDoublePane] = useState(false);
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  // defines contact information to be sent to server
  const [guestInformation, setGuestInformation] = useState({
    guestFirstname: "",
    guestLastname: "",
    guestEmail: ""
  });

  // transaction variables for display on confirmation page
  const [transactionInfo, setTransactionInfo] = useState({});

  // defines if order was successful
  const [orderStatus, setOrderStatus] = useState(false)











  useEffect(() => {
    // downloads "order" information and "image" from "localStorage" and
    if (
      typeof window !== "undefined" && localStorage.getItem("eventNum")
    ) {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
        eventDetails = tempCart.eventDetails;
        ticketInfo = tempCart.ticketInfo;
        orderTotals = tempCart.orderTotals;
        if('guestInfo' in tempCart) {
          setGuestInformation(tempCart.guestInfo);
          console.log("guestInfo: ", tempCart.guestInfo)
        }
        console.log("orderTotals: ", orderTotals);
        console.log("ticketInfo: ", ticketInfo);
      } else {
        window.location.href = "/events";
      }
      if (localStorage.getItem(`image_${event}`)) {
        eventLogo = JSON.parse(localStorage.getItem(`image_${event}`));
      }
    } else {
        window.location.href = "/events";
    }
    stylingUpdate(window.innerWidth, window.innerHeight);
    setDisplay("main")
  }, []);

  window.onresize = () => {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };

  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    if (inWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
    MainContainer = MainContainerStyling(inWidth, inHeight);
    MainGrid = MainGridStyling(inWidth, inHeight);
    EventTicketSection = EventTicketSectionStyling(inWidth, inHeight);
    OrderSummarySection = OrderSummarySectionStyling(inWidth, inHeight);
    OrderSummarySectionAlt = OrderSummarySectionAltStyling(inWidth, inHeight);
    setIsRestyling(false);
  };

  // toggles between "order pane" views
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // determines what "contact information" has been filled out by the ticket buyer
  const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let detailsMinimal = () => {
    if(guestInformation.guestFirstname
      && guestInformation.guestLastname
      && guestInformation.guestEmail
      && regsuper.test(guestInformation.guestEmail)) {
      return true
    } else {
      return false
    }
  }

  const changeField = (event) => {
    let tempInformation = {...guestInformation};
    tempInformation[event.target.name] = event.target.value;
    setGuestInformation(tempInformation);
  }
  
  // clears entire "ticketInfo" object and "eventLogo", removes "cart" and "image" from "localStorage"
  const purchaseConfirmHandler = () => {
    eventDetails = {};
    ticketInfo = {};
    orderTotals = {};
    eventLogo = "";
    let event = JSON.parse(localStorage.getItem("eventNum"));
    localStorage.removeItem(`cart_${event}`);
    localStorage.removeItem(`image_${event}`);
    localStorage.removeItem(`eventNum`);
  };
  
  const handleErrors = response => {
    console.log ("inside handleErrors ", response);
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
  };

  const freeTicketHandler = (user) => {
    if (!user) {
      console.log("Inside freeTicketHandler");

      let email = guestInformation.guestEmail;
      let name = `${guestInformation.guestFirstname} ${guestInformation.guestLastname}`;

      setTransactionInfo(loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name));

      let order = {orderDetails: {guestInfo: {}}};
      let ticketArray = [];
      order.orderDetails.guestInfo.guestFirstname = guestInformation.guestFirstname;
      order.orderDetails.guestInfo.guestLastname = guestInformation.guestLastname;
      order.orderDetails.guestInfo.guestEmail = guestInformation.guestEmail;
      order.eventNum = eventDetails.eventNum;
      ticketInfo.map((item, index) => {
        console.log("item #", index)
        if(item.adjustedTicketPrice === 0 && item.ticketsSelected > 0) {
          let tempObject = {};
          tempObject.ticketID = item.ticketID;
          tempObject.ticketsSelected = item.ticketsSelected;
          ticketArray.push(tempObject);
        }
      });
      order.tickets = ticketArray;

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let url = `${API}/free/freeTickets`;
      let fetcharg ={
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(order),
      };
      console.log("fetching with: ", url, fetcharg);
      console.log("Free ticket order: ", order)
      fetch(url, fetcharg )
      .then(handleErrors)
      .then ((response)=>{
        console.log ("then response: ", response);
        return response.json()})
      .then ((data)=>{
        console.log ("fetch return got back data:", data);
        setOrderStatus(data.status);
        setDisplay("confirmation");
      })
      .catch ((error)=>{
        console.log("freeTicketHandler() error.message: ", error.message);
        setDisplay("connection")
      })
      .finally(() => {
        purchaseConfirmHandler();
      });
    }
    else {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("transactionInfo: ",transactionInfo)
      console.log("Inside freeTicketHandler");
    
      let email = tempUser.user.email;
      let name = tempUser.user.name;

      setTransactionInfo(loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name));

      let order = {};
      let ticketArray = [];
      order.eventNum = eventDetails.eventNum;
      ticketInfo.map((item, index) => {
        if(item.adjustedTicketPrice === 0 && item.ticketsSelected > 0) {
          let tempObject = {};
          tempObject.ticketID = item.ticketID;
          tempObject.ticketsSelected = item.ticketsSelected;
          ticketArray.push(tempObject);
        }
      });
      order.tickets = ticketArray;

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${tempUser.token}`);

      let url = `${API}/free/signedFreeTickets/${tempUser.user._id}`
      let fetcharg ={
          method: "POST",
          headers: myHeaders,
          body:JSON.stringify (order),
      };

      console.log("fetching with: ", url, fetcharg);
      console.log("Free ticket order: ", order)
      fetch(url, fetcharg )
      .then(handleErrors)
      .then ((response)=>{
        console.log ("then response: ", response);
        return response.json()})
      .then ((data)=>{
        console.log ("fetch return got back data:", data);
        setOrderStatus(data.status);
        setDisplay("confirmation");
      })
      .catch ((error)=>{
        console.log("freeTicketHandler() error.message: ", error.message);
        setDisplay("connection")
      })
      .finally(() => {
        purchaseConfirmHandler();
        setModalStatus(false)
      });
    }
  }

  // creates submit button to send free ticket information to server
  const checkoutButton = () => {
    if (orderTotals.ticketsPurchased > 0 && detailsMinimal()) {
      return (
        <button
          onClick={() => freeTicketHandler(false)}
          disabled={false}
          className={classes.ButtonGreen}
        >
          SUBMIT ORDER
        </button>
      );
    } else {
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          SUBMIT ORDER
        </button>
      );
    }
  };

  // defines and sets "loadingSpinner" view status
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div className={classes.Spinner}>
          <Spinner></Spinner>;
        </div>
      );
    } else {
      return null;
    }
  }

  // CONTROLS "connectionStatus" VIEW
  const connectionStatus = () => {
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
          <div>There is a problem with OSD Server in processing your tickets. Please try again later.</div>
        </div>
      )
    } else {
      return null;
    }
  }

  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const purchaseConfirmation = () => {
    if (display === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>
            <OrderConfirm
              transactionInfo={transactionInfo}
              orderStatus={orderStatus}>
            </OrderConfirm>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  const mainDisplay = () => {
    if (display === "main") {
      // determines whether or not to display the cart and arrow
      const cartLink = show => {
        if (!show) {
          return (
            <CartLink
              onClick={switchShowOrderSummary}
              showStatus={showOrderSummaryOnly}
              isLoading={false}
              orderTotals={orderTotals}
              showDoublePane={showDoublePane}
            />
          );
        } else {
          return null;
        }
      };

      // determines whether or not to display the purchase amount
      const totalAmount = show => {
        if (!show && orderTotals.ticketsPurchased > 0) {
          return <div>{orderTotals.currencySym}{orderTotals.finalPurchaseAmount}</div>;
        } else {
          return null;
        }
      };

      let paymentPane = (
        <div className={classes.MainItemLeft}>
          <div className={classes.EventHeader}>
            <div className={classes.EventTitle}>
                {eventDetails.eventTitle}
            </div>
            <div className={classes.EventDate}>
              <DateRange
                start={eventDetails.startDateTime}
                end={eventDetails.endDateTime}
              />
            </div>
          </div>

          <div style={EventTicketSection}>
            <div className={classes.TicketType}>Contact Information (FREE)</div>
            <div style={{paddingBottom: "20px"}}>
              Continue as Guest or{" "}
              <button
                className={classes.BlueText}
                onClick={() => setModalStatus(true)}
              >
                Sign In
              </button>
            </div>
            <GuestForm
              guestInformation={guestInformation}
              changeField={changeField}
            />
          </div>
          <div className={classes.EventFooter}>
            <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
            <div className={classes.TotalAmount}>
              {totalAmount(showDoublePane)}
            </div>
            <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
          </div>
        </div>
      );

      // defines and sets "orderSummary" which is displayed in right panel
      let orderSummary;
      if (orderTotals.ticketsPurchased > 0) {
        orderSummary = <OrderSummary ticketOrder={ticketInfo} ticketCurrency={orderTotals.currencySym}/>;
      } else if (orderTotals.finalPurchaseAmount <= 0) {
        orderSummary = (
          <div className={classes.EmptyOrderSummary}>
            <FontAwesomeIcon
              className={classes.faShoppingCart}
              icon={faShoppingCart}
            />
          </div>
        );
      } else {
        orderSummary = null;
      }

      // defines and sets "orderPane" which is the right panel
      let orderPane;
      if (showDoublePane) {
        orderPane = (
          <div>
            <div>
              <img
                className={classes.Image}
                src={eventLogo}
                alt="Event Logo Coming Soon!!!"
              />
            </div>
            <div style={OrderSummarySection}>{orderSummary}</div>
          </div>
        );
      } else {
        orderPane = (
          <Fragment>
            <div>
              <div style={OrderSummarySectionAlt}>{orderSummary}</div>
            </div>
            <div className={classes.EventFooter}>
              <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
              <div className={classes.TotalAmount}>
                {totalAmount(showDoublePane)}
              </div>
              <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
            </div>
          </Fragment>
        );
      }

      if (showDoublePane) {
        return (
          <div style={MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
        );
      } else if (!showOrderSummaryOnly) {
        return (
          <div style={MainGrid}>{paymentPane}</div>
        );
      } else {
        return (
          <div style={MainGrid}>{orderPane}</div>
        );
      }

    } else {
      return null;
    }
  }

  return (
    <div style={MainContainer}>
      {connectionStatus()}
      {loadingSpinner()}
      {mainDisplay()}
      {purchaseConfirmation()}
      <AuthenticationModal
        show={modalStatus}
        zeroCart={false}
        closeModal={() => setModalStatus(false)}
        submitOrder={() => {
      
          freeTicketHandler(true)
        }}
      />
    </div>
  );
};
export default CustomerInfo;