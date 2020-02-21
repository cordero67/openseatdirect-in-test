import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import dateFormat from "dateformat";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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
import OSDLogo from "../assets/BlueLettering_TransparentBackground/BlueLettering_TransparentBackground_1024.png";
import CartLink from "./CartLinkPROMO";
import OrderSummary from "./OrderSummaryPROMO";
import TicketItem from "./TicketItemPROMO";
import styles from "./Order.module.css";

// defines an event's NON ticket type specific information
let eventDetails;

// defines an event's image
let eventLogo = "";

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

  // defines an event's specific ticket type promo codes
  const [promoCodeDetails, setPromoCodeDetails] = useState({
    available: false,
    applied: false,
    input: false,
    errorMessage: "",
    appliedPromoCode: "",
    inputtedPromoValue: "",
    lastInvalidPromoCode: "",
    eventPromoCodes: []
  });

  // tracks ticket order ticket specific information
  const [ticketInfo, setTicketInfo] = useState([]);
  // tracks ticket order general information
  const [orderTotals, setOrderTotals] = useState([]);

  useEffect(() => {
    setIsLoadingEvent(true);
    setIsSuccessfull(true);
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

  // receives Event Data from server and then populates several control variables
  const eventData = eventID => {
    getEventData(eventID)
      .then(res => {
        console.log("EVENT DATA OBJECT received from Server in 'getEventData()': ", res);
        loadEventDetails(res);
        if (
          typeof window !== "undefined" &&
          localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null
        ) {
          let cart = JSON.parse(localStorage.getItem(`cart_${eventDetails.eventNum}`));
          console.log("ORDER EXISTS!");
          setPromoCodeDetails(cart.promoCodeDetails);
          console.log("Ticket Info: ", promoCodeDetails)
          setTicketInfo(cart.ticketInfo);
          console.log("Ticket Info: ", ticketInfo)
          setOrderTotals(cart.orderTotals);
          console.log("Ticket Info: ", orderTotals)
          let event = JSON.parse(localStorage.getItem("eventNum"));
          localStorage.removeItem(`cart_${event}`);
          localStorage.removeItem(`image_${event}`);
        } else {
          loadPromoCodeDetails(res.ticket);
          loadTicketInfo(res.ticket);
          loadOrderTotals(res);
        }
        getEventImage(eventID)
          .then(res => {
            eventLogo = res;
            // setIsLoadingEvent(false);
          })
          .catch(err => {
            eventLogo = DefaultLogo;
          })
          .finally(() => {
            setIsLoadingEvent(false);
          });
      })
      .catch(err => {
        // NEED TO ADDRESS THESE SITUATIONS
        if (err === "Error: Error: 400") {
        }
        if (err === undefined) {
        }
        setIsLoadingEvent(true);
        setIsSuccessfull(false);
      })
      // .finally(() => {});
  };

  const loadEventDetails = event => {
    let tempGatewayURL;
    // sets the checkout page url
    if (event.accountId.paymentGatewayType === "PayPalExpress") {
      tempGatewayURL = "/checkout_ppPROMO";
    } else if (event.accountId.paymentGatewayType === "Braintree") {
      tempGatewayURL = "/checkout_bt";
    } else {
      tempGatewayURL = "/"
    }
    // defines the eniter "eventDetails" variable
    eventDetails = {
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventStatus: event.eventStatus,
      organizer: event.organizerName,
      organizerEmail: event.accountId.accountEmail,
      gateway: event.accountId.paymentGatewayType,
      gatewayClientID: event.accountId.paypalExpress_client_id,
      gatewayURL: tempGatewayURL,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
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
    console.log("EVENT DETAILS variable in 'loadEventDetails()': ", eventDetails);
  };

  const loadTicketInfo = ticket => {
    let tempTicketArray = [];
    ticket.forEach(item => {
      console.log("NEW TICKET ELEMENT ", item.ticketName)
      let promoCodes = [];
      // determines if the "promoCodes" field exists
      // if field does exist it converts all codes to upper case
      if (item.promoCodesAlt) {
        console.log("PROMO CODES ARRAY FOR THIS TICKET TYPE DO EXIST: ", item.promoCodesAlt);
        item.promoCodesAlt.forEach(item => {
          let tempPromoCodes = {code: "", amount: ""};
          tempPromoCodes.code = item.code.toUpperCase();
          tempPromoCodes.amount = item.amount;
          promoCodes.push(tempPromoCodes);
        })
        console.log("PROMO CODES ARRAY: ", promoCodes)
      } else {
        console.log("NO PROMO CODES ARRAY FOR THIS TICKET TYPE")
      }
      const tempTicketItem = {
        ticketID: item._id,
        ticketType: item.ticketType,
        ticketName: item.ticketName,
        ticketDescription: item.ticketDescription,
        ticketsAvailable: item.remainingQuantity,
        ticketPrice: item.currentTicketPrice,
        ticketsSelected: 0,
        maxTicketOrder: item.maxTicketsAllowedPerOrder,
        minTicketOrder: item.minTicketsAllowedPerOrder,
        ticketPromoCodes: promoCodes,
        ticketPromoCodeApplied: "",
        promoTicketPrice: item.currentTicketPrice
      };
      tempTicketArray.push(tempTicketItem);
    });
    setTicketInfo(tempTicketArray);
  }

  // receives ticket field from event data received from server
  const loadPromoCodeDetails = ticket => {
    // defines temporary array that captures all the unique promo codes
    let tempCodesArray = [];
    ticket.forEach(item => {
      console.log("INSIDE loadPromoCodeDetails", item);
      // check if 'promoCodesAlt' field exists in specific ticket type
      if (item.promoCodesAlt) {
        let codes = item.promoCodesAlt;
        console.log("INSIDE loadPromoCodeDetails codes", codes);
        codes.map(item2 => {
          if (!tempCodesArray.includes(item2.code)) {
            tempCodesArray.push(item2.code.toUpperCase());
          }
        });
      }
    });
    console.log("INSIDE loadPromoCodeDetails tempCodesArray", tempCodesArray);

    // populate "promoCodeDetails" with "eventPromoCodes" and "available" properties
    let tempCodeDetail = { ...promoCodeDetails };
    tempCodeDetail.eventPromoCodes = tempCodesArray;
    if (tempCodesArray.length > 0) {
      tempCodeDetail.available = true;
    }
    console.log("INSIDE loadPromoCodeDetails tempCodeDetail", tempCodeDetail);
    setPromoCodeDetails(tempCodeDetail);
    console.log("INSIDE loadPromoCodeDetails promoCodeDetails", promoCodeDetails);
  };

  const loadOrderTotals = event => {
    setOrderTotals({
      ticketsPurchased: 0,
      totalPurchaseAmount: 0,
      promoCodeApplied: ""
    });
  }

  // determines new "ticketsPurchased" and "totalPurchaseAmount" in "orderTOtals"
  const updateOrderTotals = (promoCode) => {
    let tempTicketsPurchased = 0;
    let tempTotalPurchaseAmount = 0;
    let tempTicketInfo2 = [...ticketInfo];
    tempTicketInfo2.forEach(item => {
        tempTicketsPurchased = tempTicketsPurchased + parseInt(item.ticketsSelected);
        tempTotalPurchaseAmount = tempTotalPurchaseAmount + (item.ticketsSelected * item.promoTicketPrice);
    });
    let tempOrderTotals;
    tempOrderTotals = {...orderTotals};
    tempOrderTotals.ticketsPurchased = tempTicketsPurchased;
    tempOrderTotals.totalPurchaseAmount = tempTotalPurchaseAmount;
    if (promoCode) {
      tempOrderTotals.promoCodeApplied = promoCode;
    }
    setOrderTotals(tempOrderTotals);
    console.log("UPDATED 'Order Totals': ", tempOrderTotals)
  }

  const applyPromoCodeHandler = (event, inputtedPromoCode) => {
    event.preventDefault();
    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
      // updates "promoCodeDetails" with valid promo code instance
      let tempPromoCodeDetails = { ...promoCodeDetails };
      tempPromoCodeDetails.applied = true;
      tempPromoCodeDetails.errorMessage = "Valid Promo Code";
      tempPromoCodeDetails.appliedPromoCode = inputtedPromoCode;
      tempPromoCodeDetails.inputtedPromoCode = "";
      tempPromoCodeDetails.lastInvalidPromoCode = "";
      setPromoCodeDetails(tempPromoCodeDetails);
      // updates "ticketInfo"
      let tempTicketInfo;
      tempTicketInfo = [...ticketInfo];
      // checks if ticket type has the code and then extracts and applies the discount amount
      tempTicketInfo.forEach((item, index) => {
        //let discount = 0;
        item.ticketPromoCodes.forEach(element => {      
          if (element.code === inputtedPromoCode) {
            console.log("WE HAVE A MATCH");
            //discount = element.amount;
            item.promoTicketPrice = element.amount;
            item.ticketPromoCodeApplied = inputtedPromoCode;
          } else {
            console.log("NO MATCH");
          }
        });
      });
      setTicketInfo(tempTicketInfo);
    console.log("Ticket Info Before: ", tempTicketInfo)
      updateOrderTotals(inputtedPromoCode);
      //document.getElementById("input box").focus();
    } else {
      // updates "promoCodeDetails" with invalid promo code instance
      let tempobject = {...promoCodeDetails };
      tempobject.errorMessage = "Sorry, that promo code is invalid";
      tempobject.lastInvalidPromoCode = inputtedPromoCode;
      setPromoCodeDetails(tempobject);
      //document.getElementById("input box").focus();
    }
  };

  // *********************************
  // *********************************
  // *********************************
  // STOPPED REFACTORING AT THIS POINT
  // LOOK TO MAKE AN <InputPromoCode> COMPONENT
  let inputPromoCode;
  if (promoCodeDetails.errorMessage === "Sorry, that promo code is invalid") {
    inputPromoCode = (
      <Aux>
        <form onSubmit={(event) => {
          applyPromoCodeHandler(event, promoCodeDetails.inputtedPromoValue.toUpperCase());
        }}>
          <div className={[styles.PromoGrid, styles.Red].join(' ')}>
            <input
              type="text"
              id="input box"
              style={{
                paddingLeft: "10px",
                color: "red",
                backgroundColor: "white",
                border: "none",
                outline: "none" 
              }}
              value={promoCodeDetails.inputtedPromoValue}
              onChange={event => {
                let tempobject = { ...promoCodeDetails };
                tempobject.inputtedPromoValue = event.target.value;
                tempobject.errorMessage = "";
                setPromoCodeDetails(tempobject);
              }}
            ></input>
            <button
              style={{
                fontSize: "14px",
                textAlign: "center",
                color: "red",
                backgroundColor: "white",
                border: "none",
                outline: "none"
              }}
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
    inputPromoCode = (
      <Aux>
        <form onSubmit={(event) => {
          applyPromoCodeHandler(event, promoCodeDetails.inputtedPromoValue.toUpperCase());
        }}>
          <div className={[styles.PromoGrid, styles.Blue].join(' ')}>
            <input
              type="text"
              id="input box"
              placeholder="Enter Promo Code"
              style={{
                paddingLeft: "10px",
                color: "black",
                backgroundColor: "white",
                border: "none",
                outline: "none" 
              }}
              value={promoCodeDetails.inputtedPromoValue}
              onChange={event => {
                let tempDetails = { ...promoCodeDetails };
                tempDetails.inputtedPromoValue = event.target.value;
                tempDetails.errorMessage = "";
                setPromoCodeDetails(tempDetails);
              }}
            ></input>
            <button
              style={{
                fontSize: "14px",
                textAlign: "center",
                color: "blue",
                backgroundColor: "white",
                border: "none",
                outline: "none"
              }}
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

  // adjusts "promoCodeDetails", "ticketInfo" and "orderTotals" variables
  const clearPromoTicektPrices = () => {
    console.log("WILL REMOVE PROMO CODE PRICES")
    let tempPromoCodeDetails;
    let tempTotalPurchaseAmount = 0;
    tempPromoCodeDetails = { ...promoCodeDetails };
    tempPromoCodeDetails.applied = false;
    tempPromoCodeDetails.input = true;
    tempPromoCodeDetails.errorMessage = "";
    tempPromoCodeDetails.appliedPromoCode = "";
    tempPromoCodeDetails.inputtedPromoValue = "";
    tempPromoCodeDetails.lastInvalidPromoCode = "";
    setPromoCodeDetails(tempPromoCodeDetails);
    let tempTicketInfo;
    tempTicketInfo = [...ticketInfo];
    tempTicketInfo.forEach((item, index) => {
      tempTotalPurchaseAmount = tempTotalPurchaseAmount + (item.ticketsSelected * item.ticketPrice);
      item.promoTicketPrice = item.ticketPrice;
      item.ticketPromoCodeApplied = "";
    })
    console.log("Ticket Info After: ", tempTicketInfo);
    setTicketInfo(tempTicketInfo);
    let tempOrderTotals;
    tempOrderTotals = {...orderTotals};
    tempOrderTotals.totalPurchaseAmount = tempTotalPurchaseAmount;
    tempOrderTotals.promoCodeApplied = "";
    setOrderTotals(tempOrderTotals);
  }

  let promoOption;
  if (!promoCodeDetails.available) {
    promoOption = null;
  } else if (promoCodeDetails.available && promoCodeDetails.applied) {
    promoOption = (
      <Aux>
      <div className={styles.AppliedPromoCode}>
        <FontAwesomeIcon
          className={styles.faCheckCircle}
          icon={faCheckCircle}
        />{" "}Code{" "}
        <span style={{ fontWeight: "600" }}>{" ",promoCodeDetails.appliedPromoCode} </span>applied.{" "}
        <span
          className={styles.RemovePromoCode}
          onClick={() => {clearPromoTicektPrices();
          }}
        >
          Remove
        </span></div>
      </Aux>
    );
  } else if (promoCodeDetails.input) {
    promoOption = (
      <Aux>
        {inputPromoCode}
      </Aux>
    );
  } else if (!promoCodeDetails.input) {
    promoOption = (
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
      </Aux>
    );
  }

  const updateTicketsSelected = (event, ticketType) => {
    // updates "ticketInfo"
    let tempTicketInfo = [...ticketInfo];
    tempTicketInfo.forEach(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = event.target.value;
      }
    });
    setTicketInfo(tempTicketInfo);
    // updates "orderTotals"
    updateOrderTotals();
  };

  let eventHeader;
  if (!isLoadingEvent) {
    let dateRange;
    if (dateFormat(eventDetails.startDateTime, "m d yy", true) === dateFormat(eventDetails.endDateTime, "m d yy", true)) {
      dateRange = <Aux>{dateFormat(
        eventDetails.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )} to {dateFormat(
        eventDetails.endDateTime,
        "shortTime",
        true
      )}</Aux>
    } else {
      dateRange = <Aux>{dateFormat(
        eventDetails.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )} to {dateFormat(
        eventDetails.endDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )}</Aux>
    }

    eventHeader = (
      <Aux>
        <div className={styles.EventTitle}>{eventDetails.eventTitle}</div>
        <div className={styles.EventDate}>{dateRange}</div>
      </Aux>
    );
  } else eventHeader = null;

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
  // "showDoublePane" must be false and "orderTotals.totalPurchaseAmount" must be > 0
  const totalAmount = show => {
    if (!isLoadingEvent && !show && orderTotals.totalPurchaseAmount > 0) {
      return <div>${orderTotals.totalPurchaseAmount}</div>;
    } else return null;
  };
  // determines whether or not to display the number of tickets purchased
  // "showDoublePane" must be false and "orderTotals.ticketsPurchased" must be > 0
  const ticketAmount = show => {
    if (!isLoadingEvent && !show && orderTotals.ticketsPurchased > 0) {
      return (
        <Aux>
          <span className={styles.cartBadge}>
            <sup>{orderTotals.ticketsPurchased}</sup>
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
          orderTotals={orderTotals}
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

  // stores "orderTotals" and "eventLogo" in "localStorage"
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`image_${eventDetails.eventNum}`, JSON.stringify(eventLogo));
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));
      localStorage.setItem(`cart_${eventDetails.eventNum}`, JSON.stringify({
        eventDetails: eventDetails,
        promoCodeDetails: promoCodeDetails,
        ticketInfo: ticketInfo,
        orderTotals: orderTotals
      }));
    }
    window.location.href = eventDetails.gatewayURL;
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let checkoutButton;
  if (!isLoadingEvent && orderTotals.totalPurchaseAmount > 0) {
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
  if (!isLoadingEvent && orderTotals.totalPurchaseAmount > 0) {
    orderSummary = <OrderSummary ticketOrder={ticketInfo} />;
  } else if (!isLoadingEvent && orderTotals.totalPurchaseAmount <= 0) {
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
        {promoOption}
        {ticketItems}
        <div className={styles.EventDescription}>
          Powered by{" "}
          <NavLink to="/" exact>
            <img className={styles.ImageBox} src={OSDLogo} alt="OpenSeatDirect Logo" />
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