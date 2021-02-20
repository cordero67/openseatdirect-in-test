import React, { useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

import { API } from "../config.js";
import { getEventData, getEventImage } from "./Resources/apiCore";
import {
  loadEventDetails,
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
import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling,
} from "./Resources/Styling";
import { DateRange } from "./Resources/PricingFunctions";
import Spinner from "../components/UI/Spinner/Spinner";
import CartLink from "./Components/CartLink";
import OrderSummary from "./Components/OrderSummary";
import { OrderConfirm } from "./Components/OrderConfirms";
import { loadTransactionInfo } from "./Resources/TicketSelectionFunctions";

import DefaultLogo from "../assets/Get_Your_Tickets.png";
import OSDLogo from "../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

import TicketItem from "./Components/TicketItem";
import classes from "./TicketSelection.module.css";

let eventDetails; // defines an event's NON ticket type specific information
let eventLogo = ""; // defines an event's image

let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

const TicketSelection = () => {
  // defines panel displayed on main page
  const [display, setDisplay] = useState("spinner"); //main, spinner, confirmation, connection

  // defines single or double panel display on main page
  const [showDoublePane, setShowDoublePane] = useState(false);

  // defines panel display for a single panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);
  
  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);
  
  // defines if PayPal order was validated by server
  const [orderStatus, setOrderStatus] = useState(true);

  // NEED TO REFACTOR THIS CONTROL VARIABLE
  // defines an event's specific ticket type promo codes
  const [promoCodeDetails, setPromoCodeDetails] = useState({
    available: false,
    applied: false,
    input: false,
    errorMessage: "",
    appliedPromoCode: "",
    inputtedPromoValue: "",
    lastInvalidPromoCode: "",
    eventPromoCodes: [],
  });

  // tracks specific ticket information in ticket order
  const [ticketInfo, setTicketInfo] = useState([]);

  // tracks general information in ticket order
  const [orderTotals, setOrderTotals] = useState([]);

  // stores payment receipt data received from PayPal
  const [transactionInfo, setTransactionInfo] = useState({});

  // defines contact information to be sent to server
  const [contactInformation, setContactInformation] = useState({
    name: "",
    email: "",
    sessionToken: "",
    userId: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("tempUser: ", tempUser)
      setContactInformation({
        name: tempUser.user.name,
        email: tempUser.user.email,
        sessionToken: tempUser.token,
        userId: tempUser.user._id
      });
    }

  // receives Event Data from server and populates several control variables
  const eventData = (eventID) => {
    getEventData(eventID)
      .then((res) => {
        console.log("EVENT DATA OBJECT from Server: ", res);
        eventDetails = loadEventDetails(res);

        // checks if an order exists in local storage
        if (
          typeof window !== "undefined" &&
          localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null
        ) {
          let cart = JSON.parse(
            localStorage.getItem(`cart_${eventDetails.eventNum}`)
          );
          console.log("cart: ", cart)

          setTicketInfo(cart.ticketInfo);
          setPromoCodeDetails(cart.promoCodeDetails);
          setOrderTotals(cart.orderTotals);
        } else {
          console.log("ticketInfo: ", loadTicketInfo(res));
          console.log("res: ", res);
          setTicketInfo(loadTicketInfo(res));
          setPromoCodeDetails(loadPromoCodeDetails(res, promoCodeDetails));
          setOrderTotals(loadOrderTotals(res));
        }

        // only asks for image if event has been successfully imported
        getEventImage(eventID)
          .then((res) => {
            eventLogo = res;
          })
          .catch((err) => {
            eventLogo = DefaultLogo;
          })
          .finally(() => {
            setDisplay("main")
          });
      })
      .catch((err) => {
        setDisplay("connection")
      });
  };

  eventData(queryString.parse(window.location.search).eventID);
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
      // sets styling parameters
      MainContainer = MainContainerStyling(inWidth, inHeight);
      MainGrid = MainGridStyling(inWidth, inHeight);
      EventTicketSection = EventTicketSectionStyling(inWidth, inHeight);
      OrderSummarySection = OrderSummarySectionStyling(inWidth, inHeight);
      OrderSummarySectionAlt = OrderSummarySectionAltStyling(inWidth, inHeight);
      setIsRestyling(false);
    };

    // determines width and height of window upon resizing by user
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

  // clears entire "ticketInfo" object and "eventLogo", removes "cart" and "image" from "localStorage"
  const purchaseConfirmHandler = () => {
    eventDetails = {};
    setTicketInfo([]);
    setOrderTotals([]);
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

  const freeTicketHandler = () => {
    console.log("Inside freeTicketHandler");
    let email = contactInformation.email;
    let name = contactInformation.name;

    setTransactionInfo(loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name));

    let order = {};
    let ticketArray = [];

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
    myHeaders.append("Authorization", `Bearer ${contactInformation.sessionToken}`);
    console.log("contactInformation: ", contactInformation)

    //let url = `${API}/free/signedFreeTickets/${contactInformation.userId}`
    let url = `${API}/tixorder/signed_expressorder/${customerInformation.userId}`
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
        setDisplay("confirmation")
    })
    .catch ((error)=>{
        console.log("freeTicketHandler() error.message: ", error.message);
        setDisplay("connection")
    })
    .finally(() => {
      purchaseConfirmHandler();
    });
  }

  // determines new "ticketsPurchased" and "totalPurchaseAmount" in "orderTotals"
  const updateOrderTotals = (promoCode) => {
    setOrderTotals(changeOrderTotals(ticketInfo, orderTotals, promoCode));
  };

  // updates "promoCodeDetails", "ticketInfo" and "orderTotals" based on promo code change
  const applyPromoCodeHandler = (event, inputtedPromoCode) => {
    event.preventDefault();
    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
      setPromoCodeDetails(amendPromoCodeDetails(inputtedPromoCode, promoCodeDetails));
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

  const inputPromoCode = () => {
    if (promoCodeDetails.errorMessage === "Sorry, that promo code is invalid") {
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
              ></input>
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
        </Fragment>
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
              ></input>
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
        <Fragment>
          <div className={classes.AppliedPromoCode}>
            <FontAwesomeIcon
              icon={faCheckCircle}
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
          <br></br>
        </Fragment>
      );
    } else if (promoCodeDetails.input) {
      return (
        <Fragment>
          {inputPromoCode()}
          <br></br>
        </Fragment>
      );
    } else if (!promoCodeDetails.input) {
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
          <br></br>
        </Fragment>
      );
    }
  };

  // updates "ticketInfo" and "orderTotals" after a change in tickets selected
  const updateTicketsSelected = (event, ticketType) => {
    setTicketInfo(changeTicketInfo(event, ticketType, ticketInfo));
    updateOrderTotals();
  };

  // creates checkout button to proceed to checkout page
  const checkoutButton = () => {
    console.log("orderTotals.ticketsPurchased: ", orderTotals.ticketsPurchased)
    console.log("eventDetails.forSale: ", eventDetails.forSale)
    console.log("session token: ", contactInformation.sessionToken)
    if (
      orderTotals.finalPurchaseAmount === 0 &&
      orderTotals.ticketsPurchased > 0 &&
      contactInformation.sessionToken !== ""
    ) {
      return (
        <button
          onClick={freeTicketHandler}
          disabled={false}
          className={classes.ButtonGreen}
        >
          SUBMIT ORDER
        </button>
      );
    } else if (orderTotals.ticketsPurchased > 0) {
      return (
        <button
          onClick={storeOrder}
          disabled={false}
          className={classes.ButtonGreen}
        >
          PROCEED TO CHECKOUT
        </button>
      );
    } else {
      return (
        <button
          disabled={true}
          className={classes.ButtonGreenOpac}
        >
          PROCEED TO CHECKOUT
        </button>
      );
    }
  };

  // stores "orderTotals" and "eventLogo" in "localStorage"
  const storeOrder = (event) => {

    console.log("eventDetails.gatewayURL: ", eventDetails.gatewayURL);
    console.log("orderTotals: ", orderTotals.finalPurchaseAmount);

    let signedIn = false;

    if (typeof window !== "undefined") {
      localStorage.setItem(`image_${eventDetails.eventNum}`, JSON.stringify(eventLogo));
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));

      // if the "cart" exists then send "guestInfo"
      // if "guestInfo" does not exit this field will not be stored in localStorage
      if (localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null) {
        let cart = JSON.parse(localStorage.getItem(`cart_${eventDetails.eventNum}`));
        console.log("cart: ", cart)
        localStorage.setItem(
          `cart_${eventDetails.eventNum}`,
          JSON.stringify({
            eventDetails: eventDetails,
            promoCodeDetails: promoCodeDetails,
            ticketInfo: ticketInfo,
            orderTotals: orderTotals,
            guestInfo: cart.guestInfo
          }))
      } else {
        localStorage.setItem(
          `cart_${eventDetails.eventNum}`,
          JSON.stringify({
            eventDetails: eventDetails,
            promoCodeDetails: promoCodeDetails,
            ticketInfo: ticketInfo,
            orderTotals: orderTotals
          })
        )
      }

      if (localStorage.getItem(`user`) !== null) {
        signedIn = true;
      }
    }
    if (signedIn === true) {
      window.location.href = "/checkout";
    } else if (orderTotals.finalPurchaseAmount === 0) {
      window.location.href = "/infofree";
    } else {
      window.location.href = "/infopaid";
    }
  };

  // defines and sets "loadingSpinner" view status
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div className={classes.BlankCanvas}>
          <Spinner></Spinner>
        </div>
      )
    } else {
      return null
    }
  }

  // defines and sets "connectionStatus" view status
  const connectionStatus = () => {
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
          <div>There is a problem with OSD Server in processing your tickets. Please try again later.</div>
        </div>
      )
    } else return null;
  }

  // creates event header with date/time range
  const eventHeader = () => {
    if (display === "main") {
      return (
        <Fragment>
          <div className={classes.EventTitle}>{eventDetails.eventTitle}</div>
          <div className={classes.EventDate}>
            <DateRange
              start={eventDetails.startDateTime}
              end={eventDetails.endDateTime}
            />
          </div>
        </Fragment>
      );
    } else {
      return null;
    }
  };

  // creates list of ticket types and ticket selection functionality
  const ticketItems = () => {
    if (display === "main") {
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
                ></TicketItem>
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  };

  // determines whether or not to display the purchase amount
  const totalAmount = (show) => {
    if (display === "main" && !show && orderTotals.ticketsPurchased > 0) {
      return (
        <div>
          {orderTotals.currencySym}
          {orderTotals.finalPurchaseAmount}
        </div>
      );
    } else return null;
  };

  // determines whether or not to display the cart and arrow
  // "showDoublePane" must be false
  const cartLink = (show) => {
    if (display === "main" && !show) {
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
    if (display === "main" && orderTotals.ticketsPurchased > 0) {
      return (
        <OrderSummary
          ticketOrder={ticketInfo}
          ticketCurrency={orderTotals.currencySym}
        />
      );
    } else if (display === "main" && orderTotals.ticketsPurchased <= 0) {
      return (
        <div className={classes.EmptyOrderSummary}>
          <FontAwesomeIcon
            className={classes.faShoppingCart}
            icon={faShoppingCart}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  // creates order pane with image and order summary sections
  const orderPane = () => {
    if (showDoublePane) {
      return (
        <div>
          <div>
            <img
              className={classes.Image}
              src={eventLogo}
              alt="Event Logo Coming Soon!!!"
            />
            <div style={OrderSummarySection}>{orderSummary()}</div>
          </div>
        </div>
      );
    } else {
      return (
        <Fragment>
          <div>
            <div style={OrderSummarySectionAlt}>{orderSummary()}</div>
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

  // creates ticket pane with promo form and ticket sections
  const ticketPane = () => {
    return (
      <div className={classes.MainItemLeft}>
        <div className={classes.EventHeader}>{eventHeader()}</div>
        <div style={EventTicketSection}>
          {promoOption()}
          {ticketItems()}
          <div className={classes.EventDescription}>
            Powered by{" "}
            <NavLink to="/events" exact>
              <img
                className={classes.ImageBox}
                src={OSDLogo}
                alt="OpenSeatDirect Logo"
              />
            </NavLink>
          </div>
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
  };

  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (display === "main") {

      if (showDoublePane) {
        return (
          <div style={MainGrid}>
            {ticketPane()}
            {orderPane()}
          </div>
        );
      } else if (!showOrderSummaryOnly) {
        return <div style={MainGrid}>{ticketPane()}</div>;
      } else {
        return <div style={MainGrid}>{orderPane()}</div>;
      }
    } else {
      return null
    }
  };

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
      )
    } else {
      return null;
      }
    }

  return (
    <div style={MainContainer}>
      {loadingSpinner()}
      {mainDisplay()}
      {purchaseConfirmation()}
      {connectionStatus()}
    </div>
  );

};

export default TicketSelection;