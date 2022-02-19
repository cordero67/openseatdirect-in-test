import React, { useState, useEffect, Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
//
//
//
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
import AuthenticationModal from "./Modals/AuthenticationModal";
//
//
import classes from "./CustomerInfo.module.css";

// defines the variables that accept the "cart_" data from "localStorage"
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
  //console.log("inside customre paid info");
  // defines panel displayed on main page
  const [display, setDisplay] = useState("spinner"); //main, spinner

  // defines 'authenticationModal' display status
  const [modalStatus, setModalStatus] = useState(false);

  // defines single or double pane view control variables
  const [showDoublePane, setShowDoublePane] = useState(false);
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  // defines contact information to be sent to server
  const [guestInformation, setGuestInformation] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  //
  //
  //
  //
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

  window.onresize = function () {
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

  // creates submit button to send free ticket information to server
  const checkoutButton = () => {
    if (orderTotals.ticketsPurchased > 0 && detailsMinimal()) {
      return (
        <button
          onClick={loadCustomerInfo}
          disabled={false}
          className={classes.ButtonGreen}
        >
          SUBMIT INFORMATION
        </button>
      );
    } else {
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          SUBMIT INFORMATION
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

  // adds guest information to "order" in local storage
  const loadCustomerInfo = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null
    ) {
      let user = JSON.parse(
        localStorage.getItem(`cart_${eventDetails.eventNum}`)
      );
      console.log("user: ", user);
      user.guestInfo = guestInformation;
      localStorage.setItem(
        `cart_${eventDetails.eventNum}`,
        JSON.stringify(user)
      );
      if (eventDetails.gateway === "PayPalExpress") {
        console.log("window.location.href = '/checkout-paypalexpress'");
        window.location.href = "/checkout-paypalexpress";
      } else if (eventDetails.gateway === "Stripe") {
        console.log("window.location.href = '/checkout-stripe'");
        window.location.href = "/checkout-stripe";
      } else if (eventDetails.gateway === "Opennnode") {
        console.log("window.location.href = '/checkout-opennode'");
        window.location.href = "/checkout-opennode";

      } else if (eventDetails.gateway === "PayPalMerchant") {
        window.location.href = "/checkout-paypalmerchant";
      } else {
        console.log("no gateway is found");
        window.location.href = `/et/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
      }
    }
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
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

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
      localStorage.removeItem(`eventNum`);
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
    } else {
      return null;
    }
  };

  return (
    <div style={MainContainer}>
      {loadingSpinner()}
      {mainDisplay()}

      <AuthenticationModal
        show={modalStatus}
        zeroCart={false}
        start={"signin"}
        vendorIntent={false}
        closeModal={() => setModalStatus(false)}
        submit={() => {
          console.log("Inside submitOrder");
          //eventDetails.gateway = "PayPalMerchant";
          if (eventDetails.gateway === "PayPalExpress") {
            console.log("window.location.href = '/checkout-paypalexpress'");
            window.location.href = "/checkout-paypalexpress";
          } else if (eventDetails.gateway === "Stripe") {
            console.log("window.location.href = '/checkout-stripe'");
            window.location.href = "/checkout-stripe";
          } else if (eventDetails.gateway === "Opennode") {
            console.log("window.location.href = '/checkout-opennnode'");
            window.location.href = "/checkout-opennode";

          } else if (eventDetails.gateway === "PayPalMerchant") {
            window.location.href = "/checkout-paypalmerchant";
          } else {
            console.log("no gateway is found");
            window.location.href = `/et/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
          }
        }}
      />
    </div>
  );
};
export default CustomerInfo;
