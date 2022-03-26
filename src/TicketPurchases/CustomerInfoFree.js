import React, { useState, useEffect, Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import { API } from "../config.js";

import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling,
} from "./Resources/Styling";
import { DateRange } from "./Resources/PricingFunctions";
import Spinner from "../components/UI/Spinner/Spinner";
import GuestForm from "./Components/GuestForm";
import CartLink from "./Components/CartLink";
import OrderSummary from "./Components/OrderSummary";

import AuthenticationModal from "../Authentication/AuthenticationModal";
import { OrderConfirm } from "./Components/OrderConfirms";
import { loadTransactionInfo } from "./Resources/TicketSelectionFunctions";
import classes from "./CustomerInfo.module.css";

// defines the variables contained in the "cart_" data from "localStorage"
let eventDetails = {};
let ticketInfo = {};
let orderTotals = {};
//let osdOrderId;
let orderExpiration;

// defines an event's image
let eventLogo = "";

// defines the styling variables
let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

const CustomerInfo = (props) => {
  // defines panel displayed on main page
  const [display, setDisplay] = useState("spinner"); // defines panel displayed: main, spinner, confirmation, connection

  // defines 'authenticationModal' display status
  const [modalStatus, setModalStatus] = useState(false); // defines 'authenticationModal' display status

  // defines single or double pane view control variables
  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables

  // defines guest information sent to server
  const [guestInformation, setGuestInformation] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [transactionInfo, setTransactionInfo] = useState({}); // ticket transaction
  const [orderStatus, setOrderStatus] = useState(false); // defines if order was successful

  useEffect(() => {
    // downloads "order" information and "image" from "localStorage" and
    if (typeof window !== "undefined" && localStorage.getItem("eventNum")) {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
        eventDetails = tempCart.eventDetails;
        ticketInfo = tempCart.ticketInfo;
        orderTotals = tempCart.orderTotals;
        //osdOrderId = tempCart.osdOrderId;
        orderExpiration = tempCart.orderExpiration;
        if ("guestInfo" in tempCart) {
          setGuestInformation(tempCart.guestInfo);
        }
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
    setDisplay("main");
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
  const switchShowOrderSummary = (event) => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // determines what "contact information" has been filled out by the ticket buyer
  const regsuper =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let detailsMinimal = () => {
    if (
      guestInformation.firstname &&
      guestInformation.lastname &&
      guestInformation.email &&
      regsuper.test(guestInformation.email)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const changeField = (event) => {
    let tempInformation = { ...guestInformation };
    tempInformation[event.target.name] = event.target.value;
    setGuestInformation(tempInformation);
  };

  // clears entire "ticketInfo" object and "eventLogo", removes "cart" and "image" from "localStorage"
  const purchaseConfirmHandler = () => {
    eventDetails = {};
    ticketInfo = {};
    orderTotals = {};
    eventLogo = "";
    let event = JSON.parse(localStorage.getItem("eventNum"));
    localStorage.removeItem(`cart_${event}`);
    localStorage.removeItem(`image_${event}`);
  };
  // LOOKS GOOD
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const freeTicketHandler = (user) => {
    let order = {
      eventNum: eventDetails.eventNum,
      totalAmount: orderTotals.finalPurchaseAmount,
    };

    if (orderTotals.finalPurchaseAmount === 0) {
      order.isFree = true;
    } else {
      order.isFree = false;
    }

    let tickets = [];
    ticketInfo.map((item) => {
      if (item.adjustedTicketPrice === 0 && item.ticketsSelected > 0) {
        let tempObject = {};
        tempObject.ticketID = item.ticketID;
        tempObject.ticketsSelected = item.ticketsSelected;
        tickets.push(tempObject);
        if (
          item.ticketsSelected > 0 &&
          "form" in item.ticketPriceFunction &&
          item.ticketPriceFunction.form === "promo" &&
          item.adjustedTicketPrice !== item.ticketPrice
        ) {
          order.promo = item.ticketPriceFunction.args[0].name;
        }
      }
    });

    order.tickets = tickets;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let url;

    if (!user) {
      let email = guestInformation.email;
      let name = `${guestInformation.firstname} ${guestInformation.lastname}`;

      setTransactionInfo(
        loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name)
      );

      order.guestFirstname = guestInformation.firstname;
      order.guestLastname = guestInformation.lastname;
      order.guestEmail = guestInformation.email;

      console.log("signed free ticket tickets: ", tickets);

      console.log("signed free ticket order: ", order);

      url = `${API}/tixorder/unsigned_place_neworder`;
    } else {
      // following code runs if user signs up rather than proceed with guest checkout
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let email = tempUser.user.email;
      let name = `${tempUser.user.firstname} ${tempUser.user.lastname}`;

      setTransactionInfo(
        loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name)
      );

      console.log("signed free ticket tickets: ", tickets);
      console.log("signed free ticket order: ", order);

      myHeaders.append("Authorization", `Bearer ${tempUser.token}`);
      url = `${API}/tixorder/signed_place_neworder`;
    }

    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(order),
    };

    console.log("fetching with: ", url, fetcharg);
    console.log("Free ticket order: ", order);
    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        setOrderStatus(data.status);
        setDisplay("confirmation");
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setDisplay("connection");
      })
      .finally(() => {
        purchaseConfirmHandler();
        if (user) {
          setModalStatus(false);
        }
      });
  };

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
    } else return null;
  };

  // CONTROLS "connectionStatus" VIEW
  const connectionStatus = () => {
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
          <div>
            There is a problem with our server in processing your tickets.
            Please try again later.
          </div>
        </div>
      );
    } else return null;
  };

  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const purchaseConfirmation = () => {
    if (display === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>
            <OrderConfirm
              transactionInfo={transactionInfo}
              orderStatus={orderStatus}
            ></OrderConfirm>
          </div>
        </div>
      );
    } else return null;
  };

  const calculateTimeLeft = () => {
    let timeElapsed = new Date(orderExpiration) - new Date();
    let elapsedTime = {
      days: Math.floor(timeElapsed / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeElapsed / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeElapsed / 1000 / 60) % 60),
      seconds: Math.floor((timeElapsed / 1000) % 60),
    };
    return elapsedTime;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // every 1000 milliseconds === 1 second the timer function runs
  // when it runs it runs the "timeLeft" hook
  // this causes the page to refresh which updates the time expired numbers
  // these numbers are fed by the "calculateTimeLeft()" function
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });
  */

  const timeRemaining = () => {
    if (+new Date(orderExpiration) >= +new Date()) {
      let twoDigitSec;
      if (calculateTimeLeft().seconds < 10) {
        twoDigitSec = "0" + calculateTimeLeft().seconds;
      } else {
        twoDigitSec = calculateTimeLeft().seconds;
      }

      return (
        <div
          style={{
            fontSize: "16px",
            textAlign: "center",
            paddingBottom: "10px",
          }}
        >
          Ticket reservation expires in {calculateTimeLeft().minutes}:
          {twoDigitSec}
        </div>
      );
    } else {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      localStorage.removeItem(`cart_${event}`);
      localStorage.removeItem(`image_${event}`);
      window.location.href = `/et/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
      return (
        <div
          style={{
            fontSize: "16px",
            textAlign: "center",
            paddingBottom: "10px",
          }}
        >
          Ticket reservation has expired.
        </div>
      );
    }
  };

  const mainDisplay = () => {
    if (display === "main") {
      // determines whether or not to display the cart and arrow
      const cartLink = (show) => {
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
        } else return null;
      };

      // determines whether or not to display the purchase amount
      const totalAmount = (show) => {
        if (!show && orderTotals.ticketsPurchased > 0) {
          return (
            <div>
              {orderTotals.currencySym}
              {orderTotals.finalPurchaseAmount}
            </div>
          );
        } else return null;
      };

      let paymentPane = (
        <div className={classes.MainItemLeft}>
          <div className={classes.EventHeader}>
            <div className={classes.EventTitle}>{eventDetails.eventTitle}</div>
            <div className={classes.EventDate}>
              <DateRange
                start={eventDetails.startDateTime}
                end={eventDetails.endDateTime}
              />
            </div>
          </div>

          <div style={EventTicketSection}>
            {timeRemaining()}
            <div className={classes.TicketType}>Contact Information</div>
            <div style={{ paddingBottom: "20px" }}>
              Continue as Guest or{" "}
              <button
                className={classes.BlueText}
                onClick={() => setModalStatus(true)}
              >
                Log in
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
        orderSummary = (
          <OrderSummary
            cancel={true}
            eventNum={eventDetails.eventNum}
            vanity={eventDetails.vanityLink}
            ticketOrder={ticketInfo}
            ticketCurrency={orderTotals.currencySym}
          />
        );
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
        return <div style={MainGrid}>{paymentPane}</div>;
      } else {
        return <div style={MainGrid}>{orderPane}</div>;
      }
    } else return null;
  };

  return (
    <div style={MainContainer}>
      {connectionStatus()}
      {loadingSpinner()}
      {mainDisplay()}
      {purchaseConfirmation()}
      <AuthenticationModal
        show={modalStatus}
        zeroCart={false}
        start={"signin"}
        vendorIntent={false}
        closeModal={() => setModalStatus(false)}
        submit={() => freeTicketHandler(true)}
      />
    </div>
  );
};
export default CustomerInfo;
