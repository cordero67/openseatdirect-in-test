import React, { useState, useEffect, Fragment } from "react";
import dateFormat from "dateformat";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling
} from "./Styling";
import Spinner from "../components/UI/Spinner/Spinner";
import CartLink from "./CartLink";
import OrderSummary from "./OrderSummary";
import SignInModal from "./Modals/SignInModal";

import classes from "./Order.module.css";

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
  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);
  const [modalStatus, setModalStatus] = useState("none");

  // defines contact information to be sent to server
  const [contactInformation, setContactInformation] = useState({
    guestFirstname: "",
    guestLastname: "",
    guestEmail: ""
  });

  // defines all view control variables
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // defines single or double pane view control variables
  const [showDoublePane, setShowDoublePane] = useState(false);
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // control variables viewing functions, assures only one is "true" at a single point in time
  const onlyShowPaymentDetails = () => {
    setShowLoadingSpinner(false);
    setShowPaymentDetails(true);
  };

  useEffect(() => {
    // downloads "order" information and "image" from "localStorage" and
    if (localStorage.getItem("eventNum")) {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
        console.log("tempCart: ", tempCart)
        eventDetails = tempCart.eventDetails;
        ticketInfo = tempCart.ticketInfo;
        orderTotals = tempCart.orderTotals;
        if('guestInfo' in tempCart) {
          setContactInformation(tempCart.guestInfo);
          console.log("guestInfo: ", tempCart.guestInfo)
        }
        console.log("orderTotals: ", orderTotals);
        console.log("ticketInfo: ", ticketInfo);
      }
      if (localStorage.getItem(`image_${event}`)) {
        eventLogo = JSON.parse(localStorage.getItem(`image_${event}`));
      }
    }
    stylingUpdate(window.innerWidth, window.innerHeight);
    onlyShowPaymentDetails();
  }, []);

  window.onresize = function(event) {
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

  // determines whether or not to display the purchase amount
  const totalAmount = show => {
    if (!showLoadingSpinner && !show && orderTotals.ticketsPurchased > 0) {
      return <div>{orderTotals.currencySym}{orderTotals.finalPurchaseAmount}</div>;
    } else {
      return null;
    }
  };

  // determines whether or not to display the cart and arrow
  const cartLink = show => {
    if (!showLoadingSpinner && !show) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          isLoading={showLoadingSpinner}
          orderTotals={orderTotals}
          showDoublePane={showDoublePane}
        />
      );
    } else {
      return null;
    }
  };

  // toggles between "order pane" views
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // defines and sets "orderSummary" which is displayed in right panel
  let orderSummary;
  if (!showLoadingSpinner && orderTotals.ticketsPurchased > 0) {
    orderSummary = <OrderSummary ticketOrder={ticketInfo} ticketCurrency={orderTotals.currencySym}/>;
  } else if (!showLoadingSpinner && orderTotals.finalPurchaseAmount <= 0) {
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

  // determines what "contact information" has been filled out by the ticket buyer
  const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let detailsMinimal = () => {
    if(contactInformation.guestFirstname
      && contactInformation.guestLastname
      && contactInformation.guestEmail
      && regsuper.test(contactInformation.guestEmail)) {
      return true
    } else {
      return false
    }
  }

  const changeField = (event) => {
    let tempInformation = {...contactInformation};
    tempInformation[event.target.name] = event.target.value;
    setContactInformation(tempInformation);
    console.log(contactInformation);
    console.log("regsuper.test(contactInformation.guestEmail): ", regsuper.test(contactInformation.guestEmail))
  }

  const guestForm = (
    <div>
      <div style={{display: "grid", gridGap: "4%", gridTemplateColumns: "48% 48%"}}>
        <div style={{paddingBottom: "20px", height: "85px"}}>
          <label style={{fontSize: "15px"}}>
            First Name{" "}<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="guestFirstname"
            value={contactInformation.guestFirstname}
            onChange={changeField}
            className={classes.InputBox}
          />
        </div>

        <div style={{paddingBottom: "20px", height: "85px"}}>
          <label style={{fontSize: "15px"}}>
            Last Name{" "}<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="guestLastname"
            value={contactInformation.guestLastname}
            onChange={changeField}
            className={classes.InputBox}
          />
        </div>
      </div>

      <div style={{paddingBottom: "20px", height: "85px"}}>
        <label style={{fontSize: "15px"}}>
          Email Address{" "}<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="guestEmail"
          value={contactInformation.guestEmail}
          onChange={changeField}
          className={classes.InputBoxLarge}
        />
      </div>

      <div>{(contactInformation.guestEmail && !regsuper.test(contactInformation.guestEmail))
        ? <span style={{ color: "red", padding: "5px"}}>A valid email address is required</span>
        : null
      }</div>
    </div>
  )

  const loadCustomerInfo = () => {
    console.log("Clicked button reminder");

    if (typeof window !== "undefined" && localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null) {
      let user = JSON.parse(localStorage.getItem(`cart_${eventDetails.eventNum}`));
      console.log("inside defined sectionpurchaseTicketHandler")
      console.log("user: ", user)
      user.guestInfo = contactInformation;
      localStorage.setItem(
        `cart_${eventDetails.eventNum}`,
        JSON.stringify(user)
      );

      window.location.href = "/checkout";
    }

  }

  // creates submit button to send free ticket information to server
  const checkoutButton = () => {
    if (orderTotals.ticketsPurchased > 0 && detailsMinimal()) {
      return (
        <button
          onClick={() => {
            console.log("Clicked button");
            loadCustomerInfo();
          }}
          disabled={false}
          className={classes.ButtonGreen}
        >
          <span style={{ color: "white" }}>SUBMIT INFORMATION</span>
        </button>
      );
    } else {
      return (
        <button disabled={true} className={classes.ButtonGrey}>
          SUBMIT INFORMATION
        </button>
      );
    }
  };

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

  // variables that define rendered items
  let loadingSpinner = null;
  let paymentPane = null;

  // defines and sets "loadingSpinner" view status
  if (showLoadingSpinner) {
    loadingSpinner = (
      <div className={classes.Spinner}>
        <Spinner></Spinner>;
      </div>
    );
  } else {
    loadingSpinner = null;
  }

  // defines and sets "paymentPane" view status
  if (showPaymentDetails) {
    let dateRange;
    if (dateFormat(eventDetails.startDateTime, "m d yy", true) === dateFormat(eventDetails.endDateTime, "m d yy", true)) {
      dateRange = <Fragment>{dateFormat(
        eventDetails.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )} to {dateFormat(
        eventDetails.endDateTime,
        "shortTime",
        true
      )}</Fragment>
    } else {
      dateRange = <Fragment>{dateFormat(
        eventDetails.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )} to {dateFormat(
        eventDetails.endDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )}</Fragment>
    }

    paymentPane = (
      <Fragment>
        <div className={classes.MainItemLeft}>
          <div className={classes.EventHeader}>
            <div className={classes.EventTitle}>
                {eventDetails.eventTitle}
            </div>
            <div className={classes.EventDate}>
              {dateRange}
            </div>
          </div>


          <div style={EventTicketSection}>
            <span className={classes.TicketType}>Contact Information</span>
            <br></br>
            <br></br>
            <div className={classes.TicketTypeSmall}>
              Continue as Guest or{" "}
              <button
                style={{
                  color: "blue",
                  border: "none",
                  backgroundColor: "white",
                  cursor: "pointer",
                  display: "inline-block",
                  outline: "none",
                  textAlign: "left",
                  paddingLeft: "0px",
                  fontWeight: "600"
                }}
                
                onClick={() => setModalStatus("signin")}
              >
                Sign In
              </button>
            </div>
            <br></br>
            <br></br>
            {guestForm}
          </div>
          <div className={classes.EventFooter}>
            <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
            <div className={classes.TotalAmount}>
              {totalAmount(showDoublePane)}
            </div>
            <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
          </div>
     
        </div>
      </Fragment>
    );
  }

  // defines which of "paymentPane" and/or "orderPane" items to display
  let mainDisplay = null;
  if (showPaymentDetails) {
    if (showDoublePane) {
      mainDisplay = (
          <div style={MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
      );
    } else if (!showOrderSummaryOnly) {
      mainDisplay = (
          <div style={MainGrid}>{paymentPane}</div>
      );
    } else {
      mainDisplay = (
          <div style={MainGrid}>{orderPane}</div>
      );
    }
  } else {
    mainDisplay = null;
  }



  return (
      <div style={MainContainer}>
        {loadingSpinner}
        <SignInModal
          show={modalStatus === "signin"}
          closeModal={() => setModalStatus("none")}
        />
        {mainDisplay}
      </div>
  );
};
export default CustomerInfo;