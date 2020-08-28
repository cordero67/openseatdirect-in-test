import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import dateFormat from "dateformat";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import Aux from "../hoc/Auxiliary/Auxiliary";
import { getEventData, getEventImage } from "./apiCore";
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
} from "./TicketSelectionFunctions";
import { DateRange } from "./pricingFunctions";
import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling,
} from "./Styling";
import Spinner from "../components/UI/Spinner/Spinner";

import DefaultLogo from "../assets/Get_Your_Tickets.png";
import OSDLogo from "../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";
import CartLink from "./CartLink";
import OrderSummary from "./OrderSummary";
import TicketItem from "./TicketItem";
import styles from "./TicketSelection.module.css";

let eventDetails; // defines an event's NON ticket type specific information
let eventLogo = ""; // defines an event's image

let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

const TicketSelection = () => {
  const [showDoublePane, setShowDoublePane] = useState(false);
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // Defines data loading control variables
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

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
  // NEED TO REFACTOR THIS CONTROL VARIABLE

  // tracks ticket order ticket specific information
  const [ticketInfo, setTicketInfo] = useState([]);

  // tracks ticket order general information
  const [orderTotals, setOrderTotals] = useState([]);

  useEffect(() => {
    eventData(queryString.parse(window.location.search).eventID);
    // determines a one or two pane display based on initial window width
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

          //NEED TO REFACTOR THESE THREE LINES
          setTicketInfo(cart.ticketInfo);
          setPromoCodeDetails(cart.promoCodeDetails);
          setOrderTotals(cart.orderTotals);
          //NEED TO REFACTOR THESE THREE LINES

          let event = JSON.parse(localStorage.getItem("eventNum"));
          localStorage.removeItem(`cart_${event}`);
          localStorage.removeItem(`image_${event}`);
        } else {
          console.log("ticketInfo: ", loadTicketInfo(res));
          console.log("res: ", res);

          setTicketInfo(loadTicketInfo(res));
          setPromoCodeDetails(loadPromoCodeDetails(res, promoCodeDetails));
          setOrderTotals(loadOrderTotals(res));
        }

        // CURRENTLY ASKS FOR IMAGE SEPARATELY< IS THIS WHAT WE WANT TO DO?
        // only asks for image if event has been successfully imported
        getEventImage(eventID)
          .then((res) => {
            eventLogo = res;
            console.log("eventLogo: ", eventLogo)
          })
          .catch((err) => {
            eventLogo = DefaultLogo;
          })
          .finally(() => {
            setIsLoadingEvent(false);
          });
      })
      .catch((err) => {
        // NEED TO ADDRESS THESE SITUATIONS
        console.log("Inside the catch, err: ", err);
        if (err === "Error: Error: 400") {
        }
        if (err === undefined) {
        }
        setIsSuccessfull(false);
        setIsLoadingEvent(false);
      });
  };

  // determines width and height of window upon resizing by user
  window.onresize = function (event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
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
    setPromoCodeDetails(clearPromoDetails(promoCodeDetails)); // I THINK THIS IS CORRECT!!!
    setTicketInfo(clearTicketInfo(ticketInfo)); // I THINK THIS IS CORRECT!!!
    setOrderTotals(clearOrderTotals(ticketInfo, orderTotals)); // I THINK THIS IS CORRECT!!!
  };

  const inputPromoCode = () => {
    if (promoCodeDetails.errorMessage === "Sorry, that promo code is invalid") {
      return (
        <Aux>
          <form
            onSubmit={(event) => {
              applyPromoCodeHandler(
                event,
                promoCodeDetails.inputtedPromoValue.toUpperCase()
              );
            }}
          >
            <div className={[styles.PromoGrid, styles.Red].join(" ")}>
              <input
                type="text"
                id="input box"
                className={styles.PromoCodeInputBoxRed}
                value={promoCodeDetails.inputtedPromoValue}
                onChange={(event) => {
                  let tempobject = { ...promoCodeDetails };
                  tempobject.inputtedPromoValue = event.target.value;
                  tempobject.errorMessage = "";
                  setPromoCodeDetails(tempobject);
                }}
              ></input>
              <button
                className={styles.PromoCodeButtonRed}
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
        </Aux>
      );
    } else {
      return (
        <Aux>
          <form
            onSubmit={(event) => {
              applyPromoCodeHandler(
                event,
                promoCodeDetails.inputtedPromoValue.toUpperCase()
              );
            }}
          >
            <div className={[styles.PromoGrid, styles.Blue].join(" ")}>
              <input
                type="text"
                id="input box"
                placeholder="Enter Promo Code"
                className={styles.PromoCodeInputBoxBlack}
                value={promoCodeDetails.inputtedPromoValue}
                onChange={(event) => {
                  let tempDetails = { ...promoCodeDetails };
                  tempDetails.inputtedPromoValue = event.target.value;
                  tempDetails.errorMessage = "";
                  setPromoCodeDetails(tempDetails);
                }}
              ></input>
              <button
                className={styles.PromoCodeButtonBlue}
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
        </Aux>
      );
    }
  };

  // creates contents inside promo code input form
  const promoOption = () => {
    if (!promoCodeDetails.available) {
      return null;
    } else if (promoCodeDetails.applied) {
      return (
        <Aux>
          <div className={styles.AppliedPromoCode}>
            <FontAwesomeIcon
              className={styles.faCheckCircle}
              icon={faCheckCircle}
            />{" "}
            Code{" "}
            <span style={{ fontWeight: "600" }}>
              {(" ", promoCodeDetails.appliedPromoCode)}{" "}
            </span>
            applied.{" "}
            <span
              className={styles.RemovePromoCode}
              onClick={() => {
                clearPromoCodes();
              }}
            >
              Remove
            </span>
          </div>
          <br></br>
        </Aux>
      );
    } else if (promoCodeDetails.input) {
      return (
        <Aux>
          {inputPromoCode()}
          <br></br>
        </Aux>
      );
    } else if (!promoCodeDetails.input) {
      return (
        <Aux>
          <div
            className={styles.EnterPromoCode}
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
        </Aux>
      );
    }
  };

  // updates "ticketInfo" and "orderTotals" after a change in tickets selected
  const updateTicketsSelected = (event, ticketType) => {
    setTicketInfo(changeTicketInfo(event, ticketType, ticketInfo));
    updateOrderTotals();
  };

  // creates event header with date/time range
  const eventHeader = () => {
    if (!isLoadingEvent) {
      return (
        <Aux>
          <div className={styles.EventTitle}>{eventDetails.eventTitle}</div>
          <div className={styles.EventDate}>
            <DateRange
              start={eventDetails.startDateTime}
              end={eventDetails.endDateTime}
            />
          </div>
        </Aux>
      );
    } else {
      return null;
    }
  };

  // creates list of ticket types and ticket selection functionality
  const ticketItems = () => {
    if (!isLoadingEvent) {
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
    if (!isLoadingEvent && !show && orderTotals.ticketsPurchased > 0) {
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
    if (!isLoadingEvent && !show) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          orderTotals={orderTotals}
          isLoading={isLoadingEvent}
          showDoublePane={showDoublePane}
        />
      );
    } else return null;
  };

  // toggles between "order pane" views
  const switchShowOrderSummary = (event) => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // stores "orderTotals" and "eventLogo" in "localStorage"
  const purchaseTicketHandler = (event) => {
    console.log("inside purchaseTicketHandler")
    if (typeof window !== "undefined") {
      console.log("inside defined sectionpurchaseTicketHandler")
      localStorage.setItem(
        `image_${eventDetails.eventNum}`,
        JSON.stringify(eventLogo)
      );
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));
      localStorage.setItem(
        `cart_${eventDetails.eventNum}`,
        JSON.stringify({
          eventDetails: eventDetails,
          promoCodeDetails: promoCodeDetails,
          ticketInfo: ticketInfo,
          orderTotals: orderTotals,
        })
      );
    }
    console.log("eventDetails.gatewayURL: ", eventDetails.gatewayURL);
    console.log("orderTotals: ", orderTotals.finalPurchaseAmount);
    window.location.href = "/checkout";
  };

  // creates checkout button to proceed to checkout page
  const checkoutButton = () => {
    if (!isLoadingEvent && orderTotals.ticketsPurchased > 0) {
      return (
        <button
          onClick={purchaseTicketHandler}
          disabled={false}
          className={styles.ButtonGreen}
        >
          <span style={{ color: "white" }}>Checkout</span>
        </button>
      );
    } else if (!isLoadingEvent) {
      return (
        <button disabled={true} className={styles.ButtonGrey}>
          Checkout
        </button>
      );
    } else return null;
  };

  // creates order summary section
  const orderSummary = () => {
    if (!isLoadingEvent && orderTotals.ticketsPurchased > 0) {
      return (
        <OrderSummary
          ticketOrder={ticketInfo}
          ticketCurrency={orderTotals.currencySym}
        />
      );
    } else if (!isLoadingEvent && orderTotals.ticketsPurchased <= 0) {
      return (
        <div className={styles.EmptyOrderSummary}>
          <FontAwesomeIcon
            className={styles.faShoppingCart}
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
          <img
            className={styles.Image}
            src={eventLogo}
            alt="Event Logo Coming Soon!!!"
          />
          <div style={OrderSummarySection}>{orderSummary()}</div>
        </div>
      );
    } else {
      return (
        <Aux>
          <div>
            <div style={OrderSummarySectionAlt}>{orderSummary()}</div>
          </div>
          <div className={styles.EventFooter}>
            <div className={styles.CartLink}>{cartLink(showDoublePane)}</div>
            <div className={styles.TotalAmount}>
              {totalAmount(showDoublePane)}
            </div>
            <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
          </div>
        </Aux>
      );
    }
  };

  // creates ticket pane with promo form and ticket sections
  const ticketPane = () => {
    return (
      <div className={styles.MainItemLeft}>
        <div className={styles.EventHeader}>{eventHeader()}</div>
        <div style={EventTicketSection}>
          {promoOption()}
          {ticketItems()}
          <div className={styles.EventDescription}>
            Powered by{" "}
            <NavLink to="/" exact>
              <img
                className={styles.ImageBox}
                src={OSDLogo}
                alt="OpenSeatDirect Logo"
              />
            </NavLink>
          </div>
          <br></br>
        </div>
        <div className={styles.EventFooter}>
          <div className={styles.CartLink}>{cartLink(showDoublePane)}</div>
          <div className={styles.TotalAmount}>
            {totalAmount(showDoublePane)}
          </div>
          <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
        </div>
      </div>
    );
  };

  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (isLoadingEvent) {
      return (
        <div className={styles.BlankCanvas}>
          <Spinner></Spinner>
        </div>
      );
    } else {
      if (showDoublePane && isSuccessfull) {
        return (
          <div style={MainGrid}>
            {ticketPane()}
            {orderPane()}
          </div>
        );
      } else if (!showOrderSummaryOnly && isSuccessfull) {
        return <div style={MainGrid}>{ticketPane()}</div>;
      } else if (isSuccessfull) {
        return <div style={MainGrid}>{orderPane()}</div>;
      } else {
        return (
          <div className={styles.BlankCanvas}>
            <h5>
              <span style={{ color: "red" }}>This event does not exist.</span>
            </h5>
          </div>
        );
      }
    }
  };

  return (
    <Aux>
      <div style={MainContainer}>{mainDisplay()}</div>
    </Aux>
  );
};

export default TicketSelection;

/*
  // determines whether or not to display the number of tickets purchased
  const ticketAmount = show => {
    if (!isLoadingEvent && !show && orderTotals.ticketsPurchased > 0) {
      return (
          <span className={styles.cartBadge}>
            <sup>{orderTotals.ticketsPurchased}</sup>
          </span>
      );
    } else return null;
  };
  */

/*
  let ticketItems;
  if (!isLoadingEvent) {
    ticketItems = (
      <div>
        {ticketInfo.map((ticket, index) => {
          return (
            <div key={index}>
              <TicketItem
                name={ticket}
                key={ticket.ticketID}
                onChange={event => {
                  updateTicketsSelected(event, ticket);
                }}
              ></TicketItem>
            </div>
          );
        })}
      </div>
    );
  }
  */

/*
  let mainDisplay;
  if (isLoadingEvent) {
    mainDisplay = 
      <div className={styles.BlankCanvas}>
        <Spinner></Spinner>
      </div>
  } else {
    if (showDoublePane && isSuccessfull) {
      mainDisplay = (
        <div style={MainGrid}>
          {ticketPane}
          {orderPane}
        </div>
      );
    } else if (!showOrderSummaryOnly && isSuccessfull) {
      mainDisplay = (
        <div style={MainGrid}>{ticketPane}</div>
      );
    } else if (isSuccessfull) {
      mainDisplay = (
        <div style={MainGrid}>{orderPane}</div>
      );
    } else {
      mainDisplay = (
        <div className={styles.BlankCanvas}>
          <h5>
            <span style={{ color: "red" }}>This event does not exist.</span>
          </h5>
        </div>
      );
    }
  }
  */
