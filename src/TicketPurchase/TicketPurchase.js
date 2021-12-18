// NEED TO COMBINE "customerInformation" and "guestInformation"
import React, { useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
//import queryString from "query-string";
import ReactHtmlParser from "react-html-parser";

import { API } from "../config.js";
//import { getEventData, getEventImage } from "./Resources/apiCore";

import {
  //loadEventDetails,
  loadTicketInfo,
  loadPromoCodeDetails,
  loadOrderTotals,
  changeOrderTotals,
  changeTicketInfo,
  amendPromoCodeDetails,
  amendTicketInfo,
  clearPromoDetails,
  clearTicketInfo,
  clearOrderTotals,
} from "./Resources/TicketSelectionFunctions";
import { DateRange } from "./Resources/PricingFunctions";
import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling,
} from "./Resources/Styling";
import Spinner from "../components/UI/Spinner/Spinner";
import CartLink from "./Components/CartLink";
import OrderSummary from "./Components/OrderSummary";
import CustomerInfoFree from "./Components/CustomerInfoFree";

import CheckoutPayPalExpress from "./Components/CheckoutPayPalExpress";
import { OrderConfirm } from "./Components/OrderConfirms";
import { loadTransactionInfo } from "./Resources/TicketSelectionFunctions";

//import DefaultLogo from "../assets/Get_Your_Tickets.png";
import OSDLogo from "../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

import TicketItem from "./Components/TicketItem";
import classes from "./TicketPurchase.module.css";

import Backdrop from "./Modals/Backdrop";

const TicketPurchase = (props) => {
  console.log("Event props: ", props.event);
  const [display, setDisplay] = useState("selection"); // defines panel displayed: main, selection, registration, infofree, infopaid, payment, spinner, confirmation, connection
  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page

  const [orderStatus, setOrderStatus] = useState(true); // defines if PayPal order was validated by server

  const [promoCodeDetails, setPromoCodeDetails] = useState({
    // defines event's specific promo codes
    available: false,
    applied: false,
    input: false,
    errorMessage: "",
    appliedPromoCode: "",
    inputtedPromoValue: "",
    lastInvalidPromoCode: "",
    eventPromoCodes: [],
  });
  const [ticketInfo, setTicketInfo] = useState([]); // ticket order specific ticket information
  // variables to reset on "Cancel Order" button in paypalStatus screen
  /*
  promoCodeDetails;
  orderTotals;
  orderStatus; // ???

  setPromoCodeDetails(clearPromoDetails(promoCodeDetails));
  setTicketInfo(clearTicketInfo(ticketInfo));
  setOrderTotals(clearOrderTotals(ticketInfo, orderTotals));

  //orderExpiration;
  setOrderExpiration();
  //transactionInfo;
  setTransactionInfo({});
  //guestInformation;
  setGuestInformation({
    // defines guest information sent to server
    firstname: "",
    lastname: "",
    email: "",
  });
  */

  // order specific
  const [orderTotals, setOrderTotals] = useState([]); // ticket order general info
  // order specific
  const [orderExpiration, setOrderExpiration] = useState();
  // order specific
  const [transactionInfo, setTransactionInfo] = useState({}); // ticket transaction
  // order specific
  const [guestInformation, setGuestInformation] = useState({
    // defines guest information sent to server
    firstname: "",
    lastname: "",
    email: "",
  });
  const [customerInformation, setCustomerInformation] = useState({
    // defines contact information sent to server
    name: "",
    email: "",
    sessionToken: "",
    userId: "",
  });
  const [registrationIndex, setRegistrationIndex] = useState(0);

  const [mainContainer, setMainContainer] = useState({});
  const [mainGrid, setMainGrid] = useState({});
  const [eventTicketSection, setEventTicketSection] = useState({});
  const [orderSummarySection, setOrderSummarySection] = useState({});
  const [orderSummarySectionAlt, setOrderSummarySectionAlt] = useState({});

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      setCustomerInformation({
        name: tempUser.user.name,
        email: tempUser.user.email,
        sessionToken: tempUser.token,
        userId: tempUser.user._id,
      });
    }

    //eventData(queryString.parse(window.location.search).eventID);
    setTicketInfo(loadTicketInfo(props.event));
    setPromoCodeDetails(loadPromoCodeDetails(props.event, promoCodeDetails));
    setOrderTotals(loadOrderTotals(props.event));

    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  const stylingUpdate = (inWidth, inHeight) => {
    if (inWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
    // sets styling parameters
    setMainContainer(MainContainerStyling(inWidth, inHeight));
    setMainGrid(MainGridStyling(inWidth, inHeight));
    setEventTicketSection(EventTicketSectionStyling(inWidth, inHeight));
    setOrderSummarySection(OrderSummarySectionStyling(inWidth, inHeight));
    setOrderSummarySectionAlt(OrderSummarySectionAltStyling(inWidth, inHeight));
  };

  // determines resized width and height of window
  window.onresize = function (event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };

  // toggles between "order pane" views
  const switchShowOrderSummary = (event) => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };
  // "user" indicates if buyer is signed in or not
  // NEED TO CHECK OTHER CALLS TO THIS FUNCTION
  // THEY NEED TO BE SENDING AN ARGUMENT AS TO WHETEHER OT NOT THE USER IS SIGNED IN
  const freeTicketHandler = () => {
    let order = {
      eventNum: props.event.eventNum,
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

    let url;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (customerInformation.sessionToken !== "") {
      console.log("Signed user inside freeTicketHandler");
      // this assumes a checked-in user and zero purchase amount
      myHeaders.append(
        "Authorization",
        `Bearer ${customerInformation.sessionToken}`
      );
      let email = customerInformation.email;
      let name = customerInformation.name;

      setTransactionInfo(
        loadTransactionInfo(props.event, orderTotals, ticketInfo, email, name)
      );
      url = `${API}/tixorder/signed_place_neworder`;
    } else {
      // this assumes a guest and zero purchase amount
      console.log("Guest user inside freeTicketHandler");
      let email = guestInformation.email;
      let name = `${guestInformation.firstname} ${guestInformation.lastname}`;
      setTransactionInfo(
        loadTransactionInfo(props.event, orderTotals, ticketInfo, email, name)
      );

      order.guestFirstname = guestInformation.firstname;
      order.guestLastname = guestInformation.lastname;
      order.guestEmail = guestInformation.email;

      url = `${API}/tixorder/unsigned_place_neworder`;
    }

    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(order),
    };
    console.log("fetching with: ", url, fetcharg);
    console.log("Free ticket order: ", order);
    setDisplay("spinner");
    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        setOrderStatus(data.status);
        setDisplay("confirmation");
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        //setDisplay("connection");
      });
  };

  // determines new "ticketsPurchased" and "totalPurchaseAmount" in "orderTotals"
  const updateOrderTotals = (promoCode) => {
    setOrderTotals(changeOrderTotals(ticketInfo, orderTotals, promoCode));
  };

  // updates "promoCodeDetails", "ticketInfo" and "orderTotals" based on promo code change
  const applyPromoCodeHandler = (event, inputtedPromoCode) => {
    event.preventDefault();
    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
      setPromoCodeDetails(
        amendPromoCodeDetails(inputtedPromoCode, promoCodeDetails)
      );
      setTicketInfo(amendTicketInfo(inputtedPromoCode, ticketInfo));
      updateOrderTotals(inputtedPromoCode);
    } else {
      let tempobject = { ...promoCodeDetails };
      tempobject.errorMessage = "Sorry, that promo code is invalid";
      tempobject.lastInvalidPromoCode = inputtedPromoCode;
      setPromoCodeDetails(tempobject);
    }
  };

  // updates "promoCodeDetails", "ticketInfo" and "orderTotals" based on promo code removal
  const clearPromoCodes = () => {
    setPromoCodeDetails(clearPromoDetails(promoCodeDetails));
    setTicketInfo(clearTicketInfo(ticketInfo));
    setOrderTotals(clearOrderTotals(ticketInfo, orderTotals));
  };

  // creates promo code display
  const inputPromoCode = () => {
    if (promoCodeDetails.errorMessage === "Sorry, that promo code is invalid") {
      return (
        <form
          onSubmit={(event) => {
            applyPromoCodeHandler(
              event,
              promoCodeDetails.inputtedPromoValue.toUpperCase()
            );
          }}
        >
          <div className={[classes.PromoGrid, classes.Red].join(" ")}>
            <input
              type="text"
              id="input box"
              className={classes.PromoCodeInputBoxRed}
              value={promoCodeDetails.inputtedPromoValue}
              onChange={(event) => {
                let tempobject = { ...promoCodeDetails };
                tempobject.inputtedPromoValue = event.target.value;
                tempobject.errorMessage = "";
                setPromoCodeDetails(tempobject);
              }}
            />
            <button
              className={classes.PromoCodeButtonRed}
              onClick={() => {
                let temp = { ...promoCodeDetails };
                temp.inputtedPromoValue = "";
                temp.errorMessage = "";
                setPromoCodeDetails(temp);
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ color: "red", fontSize: "12px" }}>
            {promoCodeDetails.errorMessage !== ""
              ? promoCodeDetails.errorMessage
              : null}
          </div>
        </form>
      );
    } else {
      return (
        <Fragment>
          <form
            onSubmit={(event) => {
              applyPromoCodeHandler(
                event,
                promoCodeDetails.inputtedPromoValue.toUpperCase()
              );
            }}
          >
            <div className={[classes.PromoGrid, classes.Blue].join(" ")}>
              <input
                type="text"
                id="input box"
                placeholder="Enter Promo Code"
                className={classes.PromoCodeInputBoxBlack}
                value={promoCodeDetails.inputtedPromoValue}
                onChange={(event) => {
                  let tempDetails = { ...promoCodeDetails };
                  tempDetails.inputtedPromoValue = event.target.value;
                  tempDetails.errorMessage = "";
                  setPromoCodeDetails(tempDetails);
                }}
              />
              <button
                className={classes.PromoCodeButtonBlue}
                disabled={!promoCodeDetails.inputtedPromoValue}
              >
                Apply
              </button>
            </div>
          </form>
          <div style={{ color: "blue", fontSize: "12px" }}>
            {promoCodeDetails.errorMessage !== ""
              ? promoCodeDetails.errorMessage
              : null}
          </div>
        </Fragment>
      );
    }
  };

  // creates contents inside promo code input form
  const promoOption = () => {
    if (!promoCodeDetails.available) {
      return null;
    } else if (promoCodeDetails.applied) {
      return (
        <div className={classes.AppliedPromoCode}>
          <ion-icon
            style={{ marginTop: "5px", fontSize: "16px", color: "black" }}
            name="checkmark-circle-outline"
          />{" "}
          Code{" "}
          <span style={{ fontWeight: "600" }}>
            {(" ", promoCodeDetails.appliedPromoCode)}{" "}
          </span>
          applied.{" "}
          <span
            className={classes.RemovePromoCode}
            onClick={() => {
              clearPromoCodes();
            }}
          >
            Remove
          </span>
        </div>
      );
    } else if (promoCodeDetails.input) {
      return (
        <Fragment>
          {inputPromoCode()}
          <br></br>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div
            className={classes.EnterPromoCode}
            onClick={() => {
              let tempPromoCodeDetails;
              tempPromoCodeDetails = { ...promoCodeDetails };
              tempPromoCodeDetails.input = true;
              setPromoCodeDetails(tempPromoCodeDetails);
            }}
          >
            Enter Promo Code
          </div>
        </Fragment>
      );
    }
  };

  // updates "ticketInfo" and "orderTotals" after a change in tickets selected
  const updateTicketsSelected = (event, ticketType) => {
    setTicketInfo(changeTicketInfo(event, ticketType, ticketInfo));
    updateOrderTotals();
  };

  // LOOKS GOOD
  // determines what "contact information" has been filled out by the ticket buyer
  const regsuper =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // LOOKS GOOD
  const detailsMinimal = () => {
    console.log("guestInformation: ", guestInformation);

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

  // creates checkout/submit order button
  // THIS IS NOT IN PRODUCTION CODE
  const checkoutButton = () => {
    if (
      // there is a registration requirement & total ticket amount > zero
      props.event.register &&
      "buttonLabel" in props.event.register &&
      "content" in props.event.register &&
      props.event.register.content.length > 0 &&
      orderTotals.ticketsPurchased > 0 &&
      display === "selection"
    ) {
      return (
        <button
          onClick={() => {
            console.log("Selected the registration button");
            setDisplay("registration");
          }}
          className={classes.ButtonGreen}
        >
          {props.event.register.buttonLabel.toUpperCase()}need to register,
          postive tickets
        </button>
      );
    } else if (
      // there is a registration requirement & total ticket amount = zero
      props.event.register &&
      "buttonLabel" in props.event.register &&
      "content" in props.event.register &&
      props.event.register.content.length > 0 &&
      display === "selection"
    ) {
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          {props.event.register.buttonLabel.toUpperCase()}need to register, zero
          tickets
        </button>
      );
    } else if (
      // there is NOT a registration requirement & a signed order of positive tickets and a zero total value
      orderTotals.finalPurchaseAmount === 0 &&
      orderTotals.ticketsPurchased > 0 &&
      customerInformation.sessionToken !== "" &&
      display === "selection"
    ) {
      return (
        <button
          onClick={() => {
            console.log("Selected the signed zero price order button");
            freeTicketHandler();
          }}
          className={classes.ButtonGreen}
        >
          SUBMIT ORDER
        </button>
      );
    } else if (
      orderTotals.finalPurchaseAmount > 0 &&
      customerInformation.sessionToken !== "" &&
      display === "selection"
    ) {
      // there is NOT a registration requirement & a signed order of positive tickets and a positive total value
      return (
        <button
          onClick={() => {
            console.log("Selected the signed positive price order button");
            setDisplay("payment");
            console.log("Set display to payment");
          }}
          className={classes.ButtonGreen}
        >
          PROCEED TO CHECKOUT
        </button>
      );
    } else if (
      // there is NOT a registration requirement & an unsigned order of positive tickets and a zero total value
      orderTotals.finalPurchaseAmount === 0 &&
      orderTotals.ticketsPurchased > 0 &&
      display === "selection"
    ) {
      return (
        <button
          onClick={() => {
            console.log("Selected an unsigned zero price order button");
            setOrderExpiration(new Date(+new Date() + 7 * 60000));
            setDisplay("infofree");
          }}
          className={classes.ButtonGreen}
        >
          SUBMIT ORDER
        </button>
      );
    } else if (orderTotals.ticketsPurchased > 0 && display === "selection") {
      // there is NOT a registration requirement & a unsigned order of positive tickets and a positive total value
      return (
        <button
          onClick={() => {
            console.log("Selected an unsigned paid price order button");
            setOrderExpiration(new Date(+new Date() + 7 * 60000));
            setDisplay("infopaid");
          }}
          className={classes.ButtonGreen}
        >
          SUBMIT ORDER
        </button>
      );
    } else if (display === "infofree" && detailsMinimal()) {
      return (
        <button
          onClick={() => {
            console.log("Completed guest checkout info");
            freeTicketHandler();
          }}
          className={classes.ButtonGreen}
        >
          SUBMIT ORDER
        </button>
      );
    } else if (display === "infofree") {
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          SUBMIT ORDER
        </button>
      );
    } else if (display === "paypal") {
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          PAYPAL FAILURE
        </button>
      );
    } else {
      // there is NOT a registration requirement & a unsigned order of no tickets
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          PROCEED TO CHECKOUT
        </button>
      );
    }
  };
  /*
  // NEED TO ADD LINKS TO EITHER GATEWAY OR GUEST CHECKOUT FORM
  // stores order and event information into "localStorage"
  const storeOrder = () => {
    let signedIn = false;
    console.log("Inside 'storeOrder'");
    console.log("Event details: ", props.event);

    if (typeof window !== "undefined") {
      setOrderExpiration(new Date(+new Date() + 7 * 60000));
      if (localStorage.getItem(`user`) !== null) {
        signedIn = true;
      }
    }

    if (signedIn === true) {
      // user is signed in therefore skip guest info page
      console.log(
        "eventDetails.gateway: ",
        props.event.accountId.paymentGatewayType
      );
      if (props.event.accountId.paymentGatewayType === "PayPalExpress") {
        //window.location.href = "/checkout-paypalexpress";
        console.log("Going to PayPal Express");
        //
        //
      } else if (
        props.event.accountId.paymentGatewayType === "PayPalMarketplace"
      ) {
        //window.location.href = "/checkout-paypalmerchant";
        console.log("Going to PayPal Merchant");
        //
        //
      } else {
        // no gateway is found
        console.log("Going to back to event details");
        //window.location.href = `/ed/${props.event.vanityLink}?eventID=${props.event.eventNum}`;
      }
    } else if (orderTotals.finalPurchaseAmount === 0) {
      // user is NOT signed in and purchase amount is zero go to infofree form
      //window.location.href = "/infofree";
      console.log("Going to Info Free");
      setDisplay("infofree");
      //
      //
    } else {
      // user is NOT signed in and purchase amount is positive go to infopaid form
      //window.location.href = "/infopaid";
      console.log("Going to Info Paid");
      //
      //
    }
  };
  */

  // LOOKS GOOD
  const changeGuestInfo = (event) => {
    console.log("A change was detected");
    let tempInformation = { ...guestInformation };
    tempInformation[event.target.name] = event.target.value;
    console.log("New guest information: ", tempInformation);
    setGuestInformation(tempInformation);
  };

  // LOOKS GOOD
  // defines and sets "loadingSpinner" view status
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div className={classes.BlankCanvas}>
          <Spinner />
        </div>
      );
    } else return null;
  };
  // LOOKS GOOD
  // defines and sets "connectionStatus" view status
  const connectionStatus = () => {
    /*
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
          <div>
            System error.
            <br></br>Please try again later.
          </div>
          <div style={{ paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                window.location.href = `/`;
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      );
    } else return null;
    */
  };

  // creates event header with date/time range
  const eventHeader = () => {
    if (
      display === "selection" ||
      display === "infofree" ||
      display === "payment" ||
      display === "paypal"
    ) {
      return (
        <Fragment>
          <div className={classes.EventTitle}>{props.event.eventTitle}</div>
          <div className={classes.EventDate}>
            <DateRange
              start={props.event.startDateTime}
              end={props.event.endDateTime}
            />
          </div>
        </Fragment>
      );
    } else return null;
  };

  // creates list of ticket types and ticket selection functionality
  const ticketItems = () => {
    if (display === "selection") {
      return (
        <div>
          {ticketInfo.map((ticket, index) => {
            return (
              <div key={index}>
                <TicketItem
                  name={ticket}
                  key={ticket.ticketID}
                  onChange={(event) => {
                    updateTicketsSelected(event, ticket);
                  }}
                />
              </div>
            );
          })}
        </div>
      );
    } else return null;
  };

  // determines whether or not to display purchase amount
  const totalAmount = (show) => {
    if (
      (display === "selection" ||
        display === "infofree" ||
        display === "payment" ||
        display === "paypal") &&
      !show &&
      orderTotals.ticketsPurchased > 0
    ) {
      return (
        <div>
          {orderTotals.currencySym}
          {orderTotals.finalPurchaseAmount}
        </div>
      );
    } else return null;
  };

  // determines whether or not to display cart and arrow
  const cartLink = (show) => {
    if (
      (display === "selection" ||
        display === "infofree" ||
        display === "payment" ||
        display === "paypal") &&
      !show
    ) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          orderTotals={orderTotals}
          showDoublePane={showDoublePane}
        />
      );
    } else return null;
  };

  // creates order summary section
  const orderSummary = () => {
    if (
      (display === "selection" ||
        display === "infofree" ||
        display === "payment" ||
        display === "paypal") &&
      orderTotals.ticketsPurchased > 0
    ) {
      return (
        <OrderSummary
          cancel={false}
          ticketOrder={ticketInfo}
          ticketCurrency={orderTotals.currencySym}
        />
      );
    } else if (
      (display === "selection" ||
        display === "infofree" ||
        display === "payment" ||
        display === "paypal") &&
      orderTotals.ticketsPurchased <= 0
    ) {
      return (
        <div className={classes.EmptyOrderSummary}>
          <ion-icon
            style={{ fontSize: "36px", color: "grey" }}
            name="cart-outline"
          />
        </div>
      );
    } else return null;
  };

  // creates order pane with image and order summary sections
  const orderPane = () => {
    if (showDoublePane) {
      return (
        <div>
          <div>
            <img
              className={classes.Image}
              src={props.event.largeLogo}
              alt="Event Logo Coming Soon!!!"
            />
            <ion-icon
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                zIndex: "700",
                fontSize: "36px",
                color: "grey",
              }}
              name="close-circle-outline"
              onClick={props.closeModal}
            />
          </div>
          <div style={orderSummarySection}>{orderSummary()}</div>
        </div>
      );
    } else {
      return (
        <Fragment>
          <div>
            <div style={orderSummarySectionAlt}>{orderSummary()}</div>
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
  };

  const detailsBody = () => {
    console.log("display: ", display);
    if (display === "selection") {
      //if (false) {
      return (
        <div style={eventTicketSection}>
          {promoOption()}
          {ticketItems()}
          <div className={classes.EventDescription}>
            Powered by{" "}
            <NavLink to="/" exact>
              <img
                className={classes.ImageBox}
                src={OSDLogo}
                alt="OpenSeatDirect Logo"
              />
            </NavLink>
          </div>
        </div>
      );
    } else if (display === "infofree") {
      //} else if (false) {
      //console.log("trying to open up inforfree form");

      //setOrderExpiration(new Date(+new Date() + 7 * 60000));
      return (
        <div style={eventTicketSection}>
          <CustomerInfoFree
            clicked={() => {
              setDisplay("selection");
            }}
            guestInformation={guestInformation}
            orderExpiration={orderExpiration}
            changeField={changeGuestInfo}
          />
        </div>
      );
    } else if (display === "payment") {
      console.log("trying to open up payment gateway");

      return (
        <div style={eventTicketSection}>
          <CheckoutPayPalExpress
            event={props.event}
            ticketInfo={ticketInfo}
            orderTotals={orderTotals}
            customerInformation={customerInformation}
            guestInformation={guestInformation}
            orderExpiration={orderExpiration}
            display={(display) => {
              console.log("IN TicketPurchase: SUCCESS");
              console.log("status: ", display);
              if (display === false || display === true) {
                setOrderStatus(display);
                let email = customerInformation.email;
                let name = customerInformation.name;

                setTransactionInfo(
                  loadTransactionInfo(
                    props.event,
                    orderTotals,
                    ticketInfo,
                    email,
                    name
                  )
                );
                setDisplay("confirmation");
              } else if (display === "paypal") {
                console.log("paypal failure display");
                setDisplay("paypal");
                console.log("paypal failure display");
              }
              // NEED TO ADD THIS OPTION
              /*
              let email = guestInformation.email;
              let name = `${guestInformation.firstname} ${guestInformation.lastname}`;
              setTransactionInfo(
                loadTransactionInfo(props.event, orderTotals, ticketInfo, email, name)

                
              let email = props.guestInformation.email;
              let name = `${props.guestInformation.firstname} ${props.guestInformation.lastname}`;
              );
*/
            }}
            clicked={() => {
              //console.log("SOMETHING");
            }}
          ></CheckoutPayPalExpress>
        </div>
      );
    } else if (display === "paypal") {
      console.log("");
      return (
        <div style={eventTicketSection}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "20px",
                lineHeight: "36px",
                paddingBottom: "10px",
                color: "red",
              }}
            >
              PayPal cannot process you order at this time.
              <br></br>
              Please try again later.
            </div>
            <div style={{ paddingTop: "20px", paddingBottom: "10px" }}>
              <button
                className={classes.ButtonGreen}
                onClick={() => {
                  console.log("clicked try again");
                  setDisplay("payment");
                }}
              >
                TRY AGAIN
              </button>
            </div>
            <div style={{ paddingTop: "20px" }}>
              <button
                className={classes.ButtonRed}
                onClick={() => {
                  console.log("clicked try again");
                  // NEED TO CLEAR TICKET
                  // NEED TO CLEAR GUEST INFORMATION
                  setDisplay("selection");
                }}
              >
                CANCEL ORDER
              </button>
            </div>
          </div>
        </div>
      );
    } else return null;
  };

  // LOOKS GOOD 12/15/2021
  const paypalStatus = () => {
    console.log("inside paypalStatus");
    console.log("ticketInfo: ", ticketInfo);
    console.log("ticketInfo: ", ticketInfo);
    console.log("ticketInfo: ", ticketInfo);
    console.log("ticketInfo: ", ticketInfo);
    console.log("ticketInfo: ", ticketInfo);
    // variables to reset on "Cancel Order" button in paypalStatus screen
    /*
  promoCodeDetails;
  orderTotals;
  orderStatus; // ???

  setPromoCodeDetails(clearPromoDetails(promoCodeDetails));
  setTicketInfo(clearTicketInfo(ticketInfo));
  setOrderTotals(clearOrderTotals(ticketInfo, orderTotals));

  //orderExpiration;
  setOrderExpiration();
  //transactionInfo;
  setTransactionInfo({});
  //guestInformation;
  setGuestInformation({
    // defines guest information sent to server
    firstname: "",
    lastname: "",
    email: "",
  });
  */

    if (display === "paypal") {
      return (
        <Fragment>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "20px",
                lineHeight: "36px",
                paddingBottom: "10px",
                color: "red",
              }}
            >
              PayPal cannot process you order at this time.
              <br></br>
              Please try again later.
            </div>
            <div style={{ paddingTop: "20px", paddingBottom: "10px" }}>
              <button
                className={classes.ButtonGreen}
                onclick={() => {
                  setDisplay("payment");
                }}
              >
                TRY AGAIN
              </button>
            </div>
            <div style={{ paddingTop: "20px" }}>
              <button
                className={classes.ButtonRed}
                onclick={() => {
                  setDisplay("selection");
                }}
              >
                CANCEL ORDER
              </button>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return null;
    }
  };

  // creates ticket pane with promo form and ticket sections
  const detailsPane = () => {
    return (
      <div className={classes.MainItemLeft}>
        <div className={classes.EventHeader}>{eventHeader()}</div>
        {detailsBody()}
        <div className={classes.EventFooter}>
          <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
          <div className={classes.TotalAmount}>
            {totalAmount(showDoublePane)}
          </div>
          <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
        </div>
      </div>
    );
  };

  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (
      display === "selection" ||
      display === "infofree" ||
      display === "payment" ||
      display === "paypal"
    ) {
      if (showDoublePane) {
        return (
          <div style={mainGrid}>
            {detailsPane()}
            {orderPane()}
          </div>
        );
      } else if (!showOrderSummaryOnly) {
        return <div style={mainGrid}>{detailsPane()}</div>;
      } else {
        return <div style={mainGrid}>{orderPane()}</div>;
      }
    } else return null;
  };

  const purchaseConfirmation = () => {
    if (display === "confirmation") {
      return (
        <div
          className={classes.BlankCanvas}
          style={{ textAlign: "left", color: "black" }}
        >
          <div style={{ paddingTop: "20px" }}>
            <OrderConfirm
              transactionInfo={transactionInfo}
              orderStatus={orderStatus}
            />
          </div>
        </div>
      );
    } else return null;
  };

  /*
   */

  const disagreeButton = (
    <div style={{ textAlign: "center", paddingTop: "15px" }}>
      <button
        className={classes.ButtonRedLarge}
        onClick={() => {
          setRegistrationIndex(0);
          setDisplay("selection");
        }}
      >
        I DISAGREE
      </button>
    </div>
  );

  const agreeButton = () => {
    if (display === "registration") {
      return (
        <div style={{ textAlign: "center", paddingTop: "15px" }}>
          <button
            className={classes.ButtonGreenLarge}
            onClick={() => {
              if (registrationIndex < props.event.register.content.length - 1) {
                setRegistrationIndex(registrationIndex + 1);
              } else {
                // there are no more registration screens
                // guest paid => go to guesctInfoPaid
                // guest free => go to guestInfo Free
                // user paid => go to payment gateway
                if (
                  orderTotals.finalPurchaseAmount === 0 &&
                  orderTotals.ticketsPurchased > 0 &&
                  customerInformation.sessionToken !== ""
                ) {
                  // signed free order => go to freeTicket Handler
                  console.log(
                    "clicked for a signed in free order, heading to 'freeTicketHandler'"
                  );
                  freeTicketHandler();
                } else if (
                  orderTotals.finalPurchaseAmount === 0 &&
                  orderTotals.ticketsPurchased > 0 &&
                  customerInformation.sessionToken !== ""
                ) {
                  // signed paid order => go to payment gateway
                  console.log(
                    "clicked for a signed in paid order, heading to 'paymentGateway'"
                  );
                } else if (
                  orderTotals.finalPurchaseAmount === 0 &&
                  orderTotals.ticketsPurchased > 0 &&
                  customerInformation.sessionToken === ""
                ) {
                  // guest free order => go to guestInfoFree
                  console.log(
                    "clicked for a guest free order, heading to 'guestInfoFree'"
                  );
                  //freeTicketHandler();
                  // signed paid order or an unsigned order
                  //storeOrder();
                } else if (
                  orderTotals.finalPurchaseAmount > 0 &&
                  orderTotals.ticketsPurchased > 0 &&
                  customerInformation.sessionToken === ""
                ) {
                  // guest paid order => go to guestInfoPaid
                  console.log(
                    "clicked for a guest paid order, heading to 'guestInfoPaid'"
                  );
                }
              }
            }}
          >
            I AGREE
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  const registrationButtons = () => {
    if (window.innerWidth >= 500) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 180px",
            columnGap: "20px",
            paddingLeft: "calc(50% - 190px)",
          }}
        >
          {disagreeButton}
          {agreeButton()}
        </div>
      );
    } else {
      return (
        <Fragment>
          {disagreeButton}
          {agreeButton()}
        </Fragment>
      );
    }
  };
  // LOOKS GOOD
  const registration = () => {
    if (display === "registration") {
      return (
        <div
          className={classes.BlankCanvas}
          style={{
            color: "black",
            fontSize: "16px",
            paddingTop: "40px",
          }}
        >
          <div
            style={{
              paddingLeft: "40px",
              paddingRight: "40px",
            }}
          >
            {ReactHtmlParser(props.event.register.content[registrationIndex])}
          </div>
          {registrationButtons()}
        </div>
      );
    } else return null;
  };

  return (
    <Fragment>
      <Backdrop show={true}></Backdrop>
      <div
        style={{
          transform: true ? "translateY(0)" : "translateY(-100vh)",
          opacity: true ? "1" : "0",
        }}
        style={mainContainer}
      >
        {loadingSpinner()}
        {mainDisplay()}
        {registration()}
        {purchaseConfirmation()}
        {/*connectionStatus()*/}
      </div>
    </Fragment>
  );
};

export default TicketPurchase;
