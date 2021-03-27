import React, { useState, useEffect, Fragment } from "react";
import dateFormat from "dateformat";

<<<<<<< HEAD
=======


>>>>>>> master
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
<<<<<<< HEAD
  OrderSummarySectionAltStyling,
=======
  OrderSummarySectionAltStyling
>>>>>>> master
} from "./Resources/Styling";
import { DateRange } from "./Resources/PricingFunctions";
import Spinner from "../components/UI/Spinner/Spinner";
import GuestForm from "./Components/GuestForm";
import CartLink from "./Components/CartLink";
import OrderSummary from "./Components/OrderSummary";
import AuthenticationModal from "./Modals/AuthenticationModal";

<<<<<<< HEAD
=======

>>>>>>> master
import classes from "./CustomerInfo.module.css";

// defines the variables that accept the "cart_" data from "localStorage"
let eventDetails = {};
let ticketInfo = {};
let orderTotals = {};
let osdOrderId;
let orderExpiration;

// defines an event's image
let eventLogo = "";

// defines the styling variables
let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

<<<<<<< HEAD
const CustomerInfo = (props) => {
=======
const CustomerInfo = props => {
>>>>>>> master
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
<<<<<<< HEAD
    email: "",
  });

  useEffect(() => {
    // downloads "order" information and "image" from "localStorage" and
    if (typeof window !== "undefined" && localStorage.getItem("eventNum")) {
=======
    email: ""
  });

















  useEffect(() => {
    // downloads "order" information and "image" from "localStorage" and
    if (
      typeof window !== "undefined" && localStorage.getItem("eventNum")
    ) {
>>>>>>> master
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
        eventDetails = tempCart.eventDetails;
        ticketInfo = tempCart.ticketInfo;
        orderTotals = tempCart.orderTotals;
        osdOrderId = tempCart.osdOrderId;
        orderExpiration = tempCart.orderExpiration;
<<<<<<< HEAD
        if ("guestInfo" in tempCart) {
          setGuestInformation(tempCart.guestInfo);
          console.log("guestInfo: ", tempCart.guestInfo);
=======
        if('guestInfo' in tempCart) {
          setGuestInformation(tempCart.guestInfo);
          console.log("guestInfo: ", tempCart.guestInfo)
>>>>>>> master
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
<<<<<<< HEAD
    setDisplay("main");
  }, []);

  window.onresize = function () {
=======
    setDisplay("main")
  }, []);

  window.onresize = function() {
>>>>>>> master
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
<<<<<<< HEAD
  const switchShowOrderSummary = (event) => {
=======
  const switchShowOrderSummary = event => {
>>>>>>> master
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // determines what "contact information" has been filled out by the ticket buyer
  const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
<<<<<<< HEAD

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
=======
  
  let detailsMinimal = () => {
    if(guestInformation.firstname
      && guestInformation.lastname
      && guestInformation.email
      && regsuper.test(guestInformation.email)) {
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





































































































































>>>>>>> master

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
    } else {
      return null;
    }
<<<<<<< HEAD
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
=======
  }

  // adds guest information to "order" in local storage
  const loadCustomerInfo = () => {
    if (typeof window !== "undefined" && localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null) {
      let user = JSON.parse(localStorage.getItem(`cart_${eventDetails.eventNum}`));
      console.log("user: ", user)
>>>>>>> master
      user.guestInfo = guestInformation;
      localStorage.setItem(
        `cart_${eventDetails.eventNum}`,
        JSON.stringify(user)
      );
<<<<<<< HEAD
      if (eventDetails.gateway === "PayPalExpress") {
        window.location.href = "/checkout-paypalexpress";
      } else if (eventDetails.gateway === "PayPalMarketplace") {
        window.location.href = "/checkout-paypalmerchant";
      } else {
        window.location.href = `/et/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
      }
    }
  };
=======
      window.location.href = "/checkout";
    }
  }



















>>>>>>> master

  const calculateTimeLeft = () => {
    let timeElapsed = new Date(orderExpiration) - new Date();

    let elapsedTime = {
      days: Math.floor(timeElapsed / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeElapsed / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeElapsed / 1000 / 60) % 60),
<<<<<<< HEAD
      seconds: Math.floor((timeElapsed / 1000) % 60),
    };

    return elapsedTime;
=======
      seconds: Math.floor((timeElapsed / 1000) % 60)
    };

    return elapsedTime;

>>>>>>> master
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // every 1000 milliseconds === 1 second the timer function runs
  // when it runs it runs the "timeLeft" hook
  // this causes the page to refresh which updates the time expired numbers
<<<<<<< HEAD
  // these numbers are fed by the "calculateTimeLeft()" function
=======
  // these numbers are fed by the "calculateTimeLeft()" function  
>>>>>>> master
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timeRemaining = () => {
    if (+new Date(orderExpiration) >= +new Date()) {
      let twoDigitSec;
      if (calculateTimeLeft().seconds < 10) {
<<<<<<< HEAD
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
=======
        twoDigitSec = "0" + calculateTimeLeft().seconds
      } else {
        twoDigitSec = calculateTimeLeft().seconds
      }
  
      return (
        <div style={{fontSize: "16px", textAlign: "center", paddingBottom: "10px"}}>
          Ticket reservation expires in{" "}{calculateTimeLeft().minutes}:{twoDigitSec}
        </div>
      )
>>>>>>> master
    } else {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      localStorage.removeItem(`cart_${event}`);
      localStorage.removeItem(`image_${event}`);
      localStorage.removeItem(`eventNum`);
      window.location.href = `/et/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;

      return (
<<<<<<< HEAD
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
        } else {
          return null;
        }
      };

      let paymentPane = (
        <div className={classes.MainItemLeft}>
          <div className={classes.EventHeader}>
            <div className={classes.EventTitle}>{eventDetails.eventTitle}</div>
            <div className={classes.EventDate}>
=======
        <div style={{fontSize: "16px", textAlign: "center", paddingBottom: "10px"}}>
          Ticket reservation has expired.
        </div>
      )
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
      } else return null;
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
>>>>>>> master
              <DateRange
                start={eventDetails.startDateTime}
                end={eventDetails.endDateTime}
              />
<<<<<<< HEAD
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
=======
          </div>
        </div>

        <div style={EventTicketSection}>
          {timeRemaining()}
          <div className={classes.TicketType}>Contact Information</div>
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
>>>>>>> master

      if (showDoublePane) {
        return (
          <div style={MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
        );
      } else if (!showOrderSummaryOnly) {
<<<<<<< HEAD
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
=======
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
    
>>>>>>> master
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
<<<<<<< HEAD
          eventDetails.gateway = "PayPalMerchant";
          //eventDetails.gateway = "";
          if (eventDetails.gateway === "PayPalExpress") {
            window.location.href = "/checkout-paypalexpress";
          } else if (eventDetails.gateway === "PayPalMerchant") {
            window.location.href = "/checkout-paypalmerchant";
          } else {
            window.location.href = `/et/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
          }
=======
          window.location.href = "/checkout";
>>>>>>> master
        }}
      />
    </div>
  );
};
<<<<<<< HEAD
export default CustomerInfo;
=======
export default CustomerInfo;
>>>>>>> master
