import React, { useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
import dateFormat from "dateformat";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

import { API } from "../config.js";
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
import { FreeConfirmTT } from "./Components/OrderConfirms";

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

  const [display, setDisplay] = useState("spinner"); // spinner, connection, main, confirmation

  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(false);

  // Defines data loading control variables
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);
  
  const [orderStatus, setOrderStatus] = useState(true);
  const [freeTicketStatus, setFreeTicketStatus] = useState(false);
  
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

  const onlyShowLoadingSpinner = () => {
    setShowLoadingSpinner(true);
    setShowPaymentDetails(false);
    setShowPurchaseConfirmation(false);
  };

  const onlyShowPaymentDetails = () => {
    setShowLoadingSpinner(false);
    setShowPaymentDetails(true);
    setShowPurchaseConfirmation(false);
  };

  const onlyShowPurchaseConfirmation = () => {
    setShowLoadingSpinner(false);
    setShowPaymentDetails(false);
    setShowPurchaseConfirmation(true);
  };

  // stores payment receipt data received from PayPal
  let transactionInfo = {};

  let customerInformation = "";

  // defines contact information to be sent to server
  const [contactInformation, setContactInformation] = useState({
    name: "",
    lastName: "",
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

          console.log("cart: ", cart)

          //NEED TO REFACTOR THESE THREE LINES
          setTicketInfo(cart.ticketInfo);
          setPromoCodeDetails(cart.promoCodeDetails);
          setOrderTotals(cart.orderTotals);
          if ("guestInfo" in cart) {
            customerInformation = cart.guestInfo
            console.log("customerInformation: ", customerInformation)
          }
          //NEED TO REFACTOR THESE THREE LINES

          //let event = JSON.parse(localStorage.getItem("eventNum"));
          //localStorage.removeItem(`cart_${event}`);
          //localStorage.removeItem(`image_${event}`);
        } else {
          console.log("ticketInfo: ", loadTicketInfo(res));
          console.log("res: ", res);

          setTicketInfo(loadTicketInfo(res));

          setPromoCodeDetails(loadPromoCodeDetails(res, promoCodeDetails));
          setOrderTotals(loadOrderTotals(res));

        }
        onlyShowPaymentDetails();
        setDisplay("main")
        // CURRENTLY ASKS FOR IMAGE SEPARATELY< IS THIS WHAT WE WANT TO DO?
        // only asks for image if event has been successfully imported
        getEventImage(eventID)
          .then((res) => {
            eventLogo = res;
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

  
  const handleErrors = response => {
    console.log ("inside handleErrors ", response);
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
  };

  const freeTicketHandler = () => {
    setFreeTicketStatus(true);
    console.log("freeTicketStatus inside 'freeTicketHandler': ", freeTicketStatus);

    console.log("contactInformation: ", contactInformation)

    transactionInfo = {
      eventTitle: eventDetails.eventTitle,//
      eventType: eventDetails.eventType,//
      venue: eventDetails.locationVenueName,//
      address1: eventDetails.locationAddress1,//
      address2: eventDetails.locationAddress2,//
      city: eventDetails.locationCity,//
      state: eventDetails.locationState,//
      zipPostalCode: eventDetails.locationZipPostalCode,//
      countryCode: eventDetails.locationCountryCode,//
      locationNote: eventDetails.locationNote,//
      webinarLink: eventDetails.webinarLink,//
      onlineInformation: eventDetails.onlineInformation,//
      tbaInformation: eventDetails.tbaInformation,//
      startDateTime: eventDetails.startDateTime,//
      endDateTime: eventDetails.endDateTime,//
      timeZone: eventDetails.timeZone,
      email: contactInformation.email,
      firstName: contactInformation.name,
      lastName: contactInformation.name,
      
      numTickets: orderTotals.ticketsPurchased,
      fullAmount: orderTotals.fullPurchaseAmount,
      discount: orderTotals.discountAmount,
      totalAmount: orderTotals.finalPurchaseAmount,
      tickets: ticketInfo,
      
      organizerEmail: eventDetails.organizerEmail,
    };
    console.log("transactionInfo: ",transactionInfo)
    console.log("Inside freeTicketHandler");
    let order = {};
    let ticketArray = [];
    
    //order.orderDetails.guestInfo.guestFirstname = contactInformation.firstName;
    //order.orderDetails.guestInfo.guestLastname = contactInformation.lastName;
    //order.orderDetails.guestInfo.guestEmail = contactInformation.email;
    order.eventNum = eventDetails.eventNum;
    console.log("order: ", order)
    
    console.log("ticketInfo: ", ticketInfo)
    
    ticketInfo.map((item, index) => {
      console.log("item #", index)
      if(item.adjustedTicketPrice === 0 && item.ticketsSelected > 0) {
        let tempObject = {};
        tempObject.ticketID = item.ticketID;
        tempObject.ticketsSelected = item.ticketsSelected;
        console.log("zero ticket #", index);
        ticketArray.push(tempObject);
      }
    });
    console.log("zero tickets:", ticketArray);
    order.tickets = ticketArray;
    console.log("orderobject: ", order)
    

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${contactInformation.sessionToken}`);

    let url = `${API}/free/signedFreeTickets/${contactInformation.userId}`
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
        //setOrderStatus(true);
        //console.log("Order status: ", orderStatus);
        onlyShowPurchaseConfirmation();
        setDisplay("confirmation")
        //purchaseConfirmHandler();
    })
    .catch ((error)=>{
        console.log("freeTicketHandler() error.message: ", error.message);
        onlyShowPurchaseConfirmation();
        setDisplay("confirmation")
        //purchaseConfirmHandler();
    })
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
  };

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
    setPromoCodeDetails(clearPromoDetails(promoCodeDetails)); // I THINK THIS IS CORRECT!!!
    setTicketInfo(clearTicketInfo(ticketInfo)); // I THINK THIS IS CORRECT!!!
    setOrderTotals(clearOrderTotals(ticketInfo, orderTotals)); // I THINK THIS IS CORRECT!!!
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
        </Fragment>
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
        <Fragment>
          <div className={styles.EventTitle}>{eventDetails.eventTitle}</div>
          <div className={styles.EventDate}>
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

    console.log("eventDetails.gatewayURL: ", eventDetails.gatewayURL);
    console.log("orderTotals: ", orderTotals.finalPurchaseAmount);

    let signedIn = false;

    if (typeof window !== "undefined") {
      localStorage.setItem(`image_${eventDetails.eventNum}`, JSON.stringify(eventLogo));
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));

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
      window.location.href = "/freeticket";
    } else {
      window.location.href = "/info";
    }
  };

  // creates checkout button to proceed to checkout page
  const checkoutButton = () => {
    console.log("orderTotals.ticketsPurchased: ", orderTotals.ticketsPurchased)
    console.log("eventDetails.forSale: ", eventDetails.forSale)
    console.log("session token: ", contactInformation.sessionToken)
    if (!isLoadingEvent &&
      orderTotals.finalPurchaseAmount === 0 &&
      contactInformation.sessionToken !== ""
    ) {
      return (
        <button
          onClick={freeTicketHandler}
          disabled={false}
          className={styles.ButtonGreen}
        >
          <span style={{ color: "white" }}>SUBMIT ORDER</span>
        </button>
      );
    } else if (!isLoadingEvent &&
      orderTotals.ticketsPurchased > 0
    ) {
      return (
        <button
          onClick={purchaseTicketHandler}
          disabled={false}
          className={styles.ButtonGreen}
        >
          <span style={{ color: "white" }}>CHECKOUT</span>
        </button>
      );
    } else if (!isLoadingEvent) {
      return (
        <button
          disabled={true}
          className={styles.ButtonGreenOpac}
        >
          CHECKOUT
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
          <div>
            <img
              className={styles.Image}
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
          <div className={styles.EventFooter}>
            <div className={styles.CartLink}>{cartLink(showDoublePane)}</div>
            <div className={styles.TotalAmount}>
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
    if (display === "main") {
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
    } else {
      return null
    }
  };

  

    // THIS IS THE INFORMATION SHOWN UPON A SUCCESSFULL TRANSACTION.
    const showSuccess = () => {
      if (orderStatus) {
        return (
          <FreeConfirmTT
            transactionInfo={transactionInfo}
          ></FreeConfirmTT>
        )
      } else if (!orderStatus) {
        return (
          <div>Problem with OSD Server in processing your tickets</div>
        )
      }  else {
        return (
          <Fragment>
            <span className={styles.SubSectionHeader}>Order Rejection</span>
            <br></br>
            <br></br>
            <div>
              <span style={{ color: "red" }}>
                WE NEED TO DECIDE ON AN ERROR MESSAGE!!!
              </span>
            </div>
          </Fragment>
        );
      }
    };

  
  const purchaseConfirmation = () => {
    if (display === "confirmation") {
      return (
        <div className={styles.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>{showSuccess()}</div>
        </div>
      )
    } else {
      return null;
      }
    }

  
  // defines and sets "loadingSpinner" view status
  const spinner = () => {
    if (display === "spinner") {
      return (
        <div className={styles.BlankCanvas}>
          <Spinner></Spinner>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <Fragment>
      <div style={MainContainer}>
        {spinner()}
        {mainDisplay()}
        {purchaseConfirmation()}
      </div>
    </Fragment>
  );
};

export default TicketSelection;