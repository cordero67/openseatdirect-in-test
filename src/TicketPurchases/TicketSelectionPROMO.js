import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import dateFormat from "dateformat";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

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
import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
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

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  // tracks ticket order ticket specific information
  const [ticketInfo, setTicketInfo] = useState([]);
  // tracks ticket order general information
  const [orderTotals, setOrderTotals] = useState([]);

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

  useEffect(() => {
    setIsLoadingEvent(true);
    setIsSuccessfull(true);
    eventData(queryString.parse(window.location.search).eventID);
    // determines initial window width and then
    // determines a one or two pane display
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
    // set styling parameters
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
        console.log(
          "Event Data Received from Server in 'getEventData()' api function: ",
          res
        );
        loadEventDetails(res);
        loadTicketInfo(res.ticket);
        loadPromoCodeDetails(res.ticket);
        //createTicketOrder(res);
        loadOrderTotals(res);

        //console.log("About to call 'eventImage()' inside 'TicketSelection'");
        //eventImage(queryString.parse(window.location.search).eventID);
        console.log("About to call 'getEventImage()' inside 'TicketSelection'");
        getEventImage(eventID)
          .then(res => {
            console.log("Event Image Received: ", res);
            eventLogo = res;
            console.log("eventLogo: ", eventLogo);
            setIsLoadingEvent(false);
          })
          .catch(err => {
            console.log("In the catch 'getEventImage'");
            console.log("No image exists");
            eventLogo = DefaultLogo;
          })
          .finally(() => {
            setIsLoadingEvent(false);
          });
      })
      .catch(err => {
        console.log("This is the error from 'getEventData': ", err);
        if (err === "Error: Error: 400") {
          console.log("I'm handling a 400 error");
        }
        if (err === undefined) {
          console.log("I'm handling an undefined error");
        }
        // need to now handle this situation
        setIsLoadingEvent(true);
        setIsSuccessfull(false);
      })
      .finally(() => {});
  };

  const loadEventDetails = event => {
    console.log("Inside 'loadEventDetails' inside 'TicketSelection'");
    let tempGatewayURL;
    // sets the checkout page url
    if (event.accountId.paymentGatewayType === "PayPalExpress") {
      tempGatewayURL = "/checkout_ppPROMO";
    } else if (event.accountId.paymentGatewayType === "Braintree") {
      tempGatewayURL = "/checkout_bt";
    } else {
      tempGatewayURL = "/"
    }

    eventDetails = {
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventStatus: event.eventStatus,
      organizer: event.organizerName,
      organizerEmail: event.accountId.accountEmail,
      gateway: event.accountId.paymentGatewayType,
      gatewayClientID: event.accountId.paypalExpress_client_id,
      gatewayURL: tempGatewayURL,
      startDateTime: dateFormat(
        event.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      ),
      endDateTime: dateFormat(
        event.endDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      ),
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
    console.log("EVENT DETAILS from 'loadEventDetails()': ", eventDetails);
  };
  
  const loadTicketInfo = ticket => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null
    ) {
      let cart = JSON.parse(localStorage.getItem(`cart_${eventDetails.eventNum}`));
      console.log("ORDER EXISTS!");
      setTicketInfo(cart.ticketInfo);
      console.log("Ticket Info: ", ticketInfo)
    } else {
      console.log("Inside 'loadTicketInfo' inside 'TicketSelection'");
      let tempTicketArray = [];
      ticket.forEach(item => {
        let tempPromoCodes = [];
        // determines if the "promoCodes" field exists
        if (item.promoCodesAlt) {
          console.log("Promo Codes exist");
          console.log("Promo Codes: ", item.promoCodesAlt);
          tempPromoCodes = item.promoCodesAlt;
        } else {
          console.log("Promo Codes DOES NOT exist");
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
          ticketPromoCodes: tempPromoCodes,
          ticketPromoCodeApplied: "",
          promoTicketPrice: item.currentTicketPrice
        };
        tempTicketArray.push(tempTicketItem);
      });
      setTicketInfo(tempTicketArray);
      tempTicketArray.forEach(item => {
        console.log(
          "PROMO CODES inside 'loadTicketInfo()': ",
          item.ticketPromoCodes
        );
      });
    }
  };

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
            tempCodesArray.push(item2.code);
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
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null
    ) {
      let cart = JSON.parse(localStorage.getItem(`cart_${eventDetails.eventNum}`));
      console.log("ORDER EXISTS!");
      setOrderTotals(cart.orderTotals);
      console.log("Ticket Info: ", orderTotals)



      // CHECK IF PROMO CODE EXISTS IN ORDER
      if (cart.orderTotals.promoCodeApplied) {
        console.log("Promo code exist")
          // defines an event's specific ticket type promo codes
        setPromoCodeDetails({
          available: true,
          applied: true,
          input: false,
          errorMessage: "",
          appliedPromoCode: cart.orderTotals.promoCodeApplied,
          inputtedPromoValue: "",
          lastInvalidPromoCode: "",
          eventPromoCodes: []    
        });
      } else {
        console.log("Promo code COES NOT exist")
      }

    } else {
      setOrderTotals({
        ticketsPurchased: 0,
        totalPurchaseAmount: 0,
        promoCodeApplied: ""
      });
      console.log("Initial loading of orderTotals: ", orderTotals)
    }
  }

  let eventHeader;

  if (!isLoadingEvent) {
    eventHeader = (
      <Aux>
        <div className={styles.EventTitle}>{eventDetails.eventTitle}</div>
        <div className={styles.EventDate}>{eventDetails.startDateTime}</div>
      </Aux>
    );
  } else eventHeader = null;

  const changeInputHandler = () => {
    // updates "ticketInfo"
    let tempPromoCodeDetails;
    tempPromoCodeDetails = { ...promoCodeDetails };
    tempPromoCodeDetails.input = true;
    setPromoCodeDetails(tempPromoCodeDetails);
  };

/*
  setPromoCodeDetails({
    available: true,
    applied: true,
    input: false,
    errorMessage: "",
    appliedPromoCode: "",
    inputtedPromoValue: "",
    lastInvalidPromoCode: "",
    eventPromoCodes: []
  });
*/

  const applyPromoCodeHandler = (event, inputtedPromoCode) => {
    event.preventDefault();
    console.log("ENTERING APPLY PROMO CODE HANDLER");
    console.log("promoCodeDetails", promoCodeDetails);
    console.log("ticketInfo", ticketInfo);

    console.log("TICKET INFO: ", ticketInfo);
if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
      console.log("applyPromoCodeHandler ", inputtedPromoCode);
      let tempPromoCodeDetails = { ...promoCodeDetails };
      tempPromoCodeDetails.applied = true;
      tempPromoCodeDetails.errorMessage = "Valid Promo Code";
      tempPromoCodeDetails.appliedPromoCode = inputtedPromoCode;
      tempPromoCodeDetails.inputtedPromoCode = "";
      tempPromoCodeDetails.lastInvalidPromoCode = "";
      setPromoCodeDetails(tempPromoCodeDetails);
      console.log("tempPromoCodeDetails: ", tempPromoCodeDetails);
      console.log("promoCodeDetails: ", promoCodeDetails);
      console.log("TICKET INFO BEFORE THE CHANGE: ", ticketInfo);
      // updates "ticketInfo"
      let tempTicketInfo;
      tempTicketInfo = [...ticketInfo];

      // checks if ticket type has the code and then extracts the discount amount
      tempTicketInfo.forEach((item, index) => {
        let discount = 0;
        console.log("Individual Ticket Type: ", item);
        console.log("Individual Ticket Type Promo Codes: ", item.ticketPromoCodes);

        item.ticketPromoCodes.forEach(element => {
          console.log("EACH CODE VALUE: ", element.code);          
          if (element.code === inputtedPromoCode) {
            console.log("WE HAVE A MATCH");
            discount = element.amount;
            console.log("Updated Discount Amount: ", discount);
            item.promoTicketPrice = item.ticketPrice - discount;
            console.log("Updated Promo Ticket Price: ", item.promoTicketPrice);
            item.ticketPromoCodeApplied = inputtedPromoCode;
            console.log("Updated Promo Ticket Promo Code Applied: ", item.ticketPromoCodeApplied);
          } else {
            console.log("NO MATCH");
            console.log("Updated Discount Amount: ", discount)
          }
        });
      });
      setTicketInfo(tempTicketInfo);
      console.log("TICKET INFO after promo code applied: ", tempTicketInfo);
      updateOrderTotals(inputtedPromoCode);
      //document.getElementById("input box").focus();
    } else {
      let tempobject = {...promoCodeDetails };
      tempobject.errorMessage = "Sorry, that promo code is invalid";
      tempobject.lastInvalidPromoCode = inputtedPromoCode;
      setPromoCodeDetails(tempobject);
      //document.getElementById("input box").focus();
    }
  };

  let inputPromoCode;

  if (promoCodeDetails.errorMessage === "Sorry, that promo code is invalid") {
    inputPromoCode = (
      <Aux>
        <form onSubmit={(event) => {
          applyPromoCodeHandler(event, promoCodeDetails.inputtedPromoValue);
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
              //disabled={true}
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
          applyPromoCodeHandler(event, promoCodeDetails.inputtedPromoValue);
        }}>
          <div className={[styles.PromoGrid, styles.Blue].join(' ')}>
            <input
              type="text"
              id="input box"
              style={{
                paddingLeft: "10px",
                color: "black",
                backgroundColor: "white",
                border: "none",
                outline: "none" 
              }}
              placeholder="Enter Promo Code"
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


/*
  setPromoCodeDetails({
    available: true,
    applied: true,
    input: false,
    errorMessage: "",
    appliedPromoCode: "",
    inputtedPromoValue: "",
    lastInvalidPromoCode: "",
    eventPromoCodes: []
  });
  */


  let controlData = (null/*
    <div style={{ paddingLeft: "40px", color: "red", fontSize: "14px" }}>
      <div>Ticket Prices</div>
      {ticketInfo.map(item => {
        return (
          <div>
            <div>Ticket Type: {item.ticketName}</div>
            <div>Ticket Price: {item.ticketPrice}</div>
            <div>Adjusted Ticket Price: {item.promoTicketPrice}</div>
            <div>Promo Code Applied: {item.ticketPromoCodeApplied}</div>
          </div>
        );
      })}
      <br></br>
      <div>promoCodeDetails</div>
      <div>available: {promoCodeDetails.available.toString()}</div>
      <div>applied: {promoCodeDetails.applied.toString()}</div>
      <div>input: {promoCodeDetails.input.toString()}</div>
      <div>errorMessage: {promoCodeDetails.errorMessage}</div>
      <div>appliedPromoCode: {promoCodeDetails.appliedPromoCode}</div>
      <div>inputtedPromoValue: {promoCodeDetails.inputtedPromoValue}</div>
      <div>lastInvalidPromoCode: {promoCodeDetails.lastInvalidPromoCode}</div>


      <div>Ticket Promos</div>
      {promoCodeDetails.eventPromoCodes.map(item => {
        return (
          <Aux>
            <div>{item}</div>
          </Aux>
        );
      })}
    </div>
    */
  );

  let promoOption;

  if (!promoCodeDetails.available) {
    promoOption = (
      <Aux>
        <div style={{ color: "red", fontSize: "16px" }}>
          No promo codes exist for this event
        </div>
        {controlData}
      </Aux>
    );
  } else if (promoCodeDetails.available && promoCodeDetails.applied) {
    promoOption = (
      <Aux>
        <div style={{ color: "blue", fontSize: "16px" }}>
          Promo code applied to respective ticket prices.
        </div>
        <br></br>
        {controlData}
      </Aux>
    );
  } else if (promoCodeDetails.input) {
    console.log("TICKETINFO: ", ticketInfo);
    promoOption = (
      <Aux>
        {inputPromoCode}
        <br></br>
        {controlData}
      </Aux>
    );
  } else if (!promoCodeDetails.input) {
    console.log("TICKETINFO: ", ticketInfo);
    promoOption = (
      <Aux>
        <div
          style={{ color: "blue" }}
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
        {controlData}
      </Aux>
    );
  }

  /*
  let tempOrderTotals;
  tempOrderTotals = {...updateOrderTotals}
  tempOrderTotals.promoCodeApplied = inputtedPromoCode;
  setOrderTotals(tempOrderTotals);
  */

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
/*
  OrderTotals({
      ticketsPurchased: 0,
      totalPurchaseAmount: 0
*/
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

// NEEDS WORK
  // stores "orderTotals" and "eventLogo" in "localStorage"
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      //localStorage.setItem(`ticketInfo_${eventDetails.eventNum}`, JSON.stringify(ticketInfo));
      localStorage.setItem(`image_${eventDetails.eventNum}`, JSON.stringify(eventLogo));
      //localStorage.setItem(`orderTotals_${eventDetails.eventNum}`, JSON.stringify(orderTotals));
      //localStorage.setItem(`eventDetails_${eventDetails.eventNum}`, JSON.stringify(eventDetails));
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));
      localStorage.setItem(`cart_${eventDetails.eventNum}`, JSON.stringify({
        eventDetails: eventDetails,
        ticketInfo: ticketInfo,
        orderTotals: orderTotals,
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
            <img src={OSDLogo} alt="OpenSeatDirect Logo" />
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
