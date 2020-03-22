//**********
// GOOD FROM HERE
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
import OrderSummary from "./OrderSummaryADVANCED";
import TicketItem from "./TicketItemPROMOADV";
import TicketItemADVANCED from "./TicketItemADVANCED";
import styles from "./Order.module.css";
// TO HERE
//###########

//**********
// GOOD FROM HERE
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

  // defines an event's specific ticket type promo codes
  const [promoCodeDetails2, setPromoCodeDetails2] = useState({
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
  
  // tracks ticket order ticket specific information
  const [ticketInfo2, setTicketInfo2] = useState([]);

  // tracks ticket order general information
  const [orderTotals, setOrderTotals] = useState([]);

  // tracks ticket order general information
  const [orderTotals2, setOrderTotals2] = useState([]);

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
// TO HERE
//###########

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
          setPromoCodeDetails2(cart.promoCodeDetails);
          console.log("Ticket Info: ", promoCodeDetails)
          setTicketInfo2(cart.ticketInfo);
          console.log("Ticket Info: ", ticketInfo)
          setOrderTotals2(cart.orderTotals);
          console.log("Ticket Info: ", orderTotals)
          let event = JSON.parse(localStorage.getItem("eventNum"));
          localStorage.removeItem(`cart_${event}`);
          localStorage.removeItem(`image_${event}`);
        } else {
          //loadPromoCodeDetails(res.ticket);
          loadPromoCodeDetails2(res.ticket);
          //loadTicketInfo(res.ticket);
          loadTicketInfo2(res.ticket);
          //loadOrderTotals(res);
          loadOrderTotals2(res);
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

//**********
// GOOD FROM HERE
  const loadEventDetails = event => {
    let tempGatewayURL;
    // sets the checkout page url
    if (event.accountId.paymentGatewayType === "PayPalExpress") {
      tempGatewayURL = "/checkout_ppADVANCED";
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
// TO HERE
//###########

//**********
// NEED TO TEST WITH REAL DATA START
  const loadTicketInfo2 = ticket => {
    let tempTicketArray = [];
    ticket.forEach(item => {
      //console.log("NEW TICKET ELEMENT ", item.ticketName)
      let priceFunction = {};
      let pricingCode = "";
      //let priceFunctionActive = false;
      // determines if the "priceFunction" field exists
      if (item.priceFunction && item.priceFunction.form && item.usePriceFunction) {
        //console.log("Price Function EXISTS")
        //priceFunctionActive = item.usePriceFunction;
      // determines if the "form" field exists
        if (item.priceFunction.form === "promo" && item.priceFunction.args.promocodes) {
          //console.log("Promo Codes args: ", item.priceFunction.args.promocodes);
          //console.log("Price Function form field EXISTS and is PROMO");
          // make all promo codes upper case
          let newPromoCodes = [];
          item.priceFunction.args.promocodes.forEach(code => {
            let tempElement;
            tempElement = {
              name: code.name.toUpperCase(),
              amount: code.amount
            }
            newPromoCodes.push(tempElement)
            }
          )

          priceFunction = {form: "promo",
            args: newPromoCodes};
          //console.log("Price Function form field EXISTS and is PROMO: ", priceFunction)
        } else if (item.priceFunction.form === "twofer" && item.priceFunction.args) {
          //console.log("Price Function form field EXISTS and is TWOFER");
          priceFunction = {form: "twofer",
            args: item.priceFunction.args};
            pricingCode = "twofer";
          //console.log("Price Function form field EXISTS and is TWOFER: ", priceFunction)
        } else if (item.priceFunction.form === "twoferCapped" && item.priceFunction.args) {
          //console.log("Price Function form field EXISTS and is TWOFERCAPPED");
          priceFunction = {form: "twoferCapped",
            args: item.priceFunction.args};
            pricingCode = "twoferCapped";
          //console.log("Price Function form field EXISTS and is TWOFERCAPPED: ", priceFunction)
        } else if (item.priceFunction.form === "bogo" && item.priceFunction.args) {
          //console.log("Price Function form field EXISTS and is BOGO");
          priceFunction = {form: "bogo",
            args: item.priceFunction.args};
            pricingCode = "bogo";
          //console.log("Price Function form field EXISTS and is BOGO: ", priceFunction)
        }
      } else {
        //console.log("Price Function IS NOT ACTIVE")
      }

      let minOrder = "";
      let maxOrder = "";
      if (item.maxTicketsAllowedPerOrder) {
        maxOrder = item.maxTicketsAllowedPerOrder;
      }
      if (item.minTicketsAllowedPerOrder) {
        minOrder = item.minTicketsAllowedPerOrder;
      }
      const tempTicketItem = {
        ticketID: item._id,
        ticketType: item.ticketType,
        ticketName: item.ticketName,
        ticketDescription: item.ticketDescription,
        ticketsAvailable: item.remainingQuantity,
        ticketPrice: item.currentTicketPrice,
        ticketsSelected: 0,
        maxTicketOrder: maxOrder,
        minTicketOrder: minOrder,
        ticketPriceFunction: priceFunction,
        ticketPricingCodeApplied: pricingCode,
        adjustedTicketPrice: item.currentTicketPrice
      };
      tempTicketArray.push(tempTicketItem);
    });
    console.log("TEMP TICKET ITEMS 2: ",tempTicketArray)
    setTicketInfo2(tempTicketArray);
  }
// NEED TO TEST WITH REAL DATA END
//###########

//**********
// NEED TO TEST WITH REAL DATA START
  // receives ticket field from event data received from server
  const loadPromoCodeDetails2 = ticket => {
    // defines temporary array that captures all the unique promo codes
    let tempCodesArray = [];
    ticket.forEach(tktType => {
      // check if 'promoCodesAlt' field exists in specific ticket type
      if (tktType.priceFunction && (tktType.priceFunction.form === "promo") && tktType.usePriceFunction) {
        let priceFunction = tktType.priceFunction;
        console.log("There are PROMO CODES", priceFunction);
        tktType.priceFunction.args.promocodes.map(tktPromo => {
          if (!tempCodesArray.includes(tktPromo.name.toUpperCase())) {
            tempCodesArray.push(tktPromo.name.toUpperCase());
          }
        })
      }
    });

    console.log("INSIDE loadPromoCodeDetails2 tempCodesArray", tempCodesArray);
    // populate "promoCodeDetails2" with "eventPromoCodes" and "available" properties
    let tempCodeDetail = { ...promoCodeDetails2 };
    tempCodeDetail.eventPromoCodes = tempCodesArray;
    if (tempCodesArray.length > 0) {
      tempCodeDetail.available = true;
    }
    console.log("INSIDE loadPromoCodeDetails2 tempCodeDetail", tempCodeDetail);
    setPromoCodeDetails2(tempCodeDetail);
    //console.log("INSIDE loadPromoCodeDetails2 promoCodeDetails", promoCodeDetails);
  };
// NEED TO TEST WITH REAL DATA END
//###########

  const loadOrderTotals2 = event => {
    setOrderTotals({
      ticketsPurchased: 0,
      fullPurchaseAmount: 0,
      discountAmount: 0,
      finalPurchaseAmount: 0,
      promoCodeApplied: ""
    });
  }

//**********
//THIS SHOULD BE UPDATED START
  // determines new "ticketsPurchased" and "totalPurchaseAmount" in "orderTotals"
  const updateOrderTotals2 = (promoCode) => {
    let tempTicketsPurchased = 0;
    let tempFullAmount = 0;
    let tempDiscountAmount = 0;
    let tempFinalAmount = 0;
    let tempTicketInfo2 = [...ticketInfo2];
    tempTicketInfo2.forEach(item => {
        tempTicketsPurchased = tempTicketsPurchased + parseInt(item.ticketsSelected);
        tempFullAmount = tempFullAmount + (item.ticketsSelected * item.ticketPrice);
        tempFinalAmount = tempFinalAmount + (item.ticketsSelected * item.adjustedTicketPrice);
        tempDiscountAmount = tempFullAmount - tempFinalAmount;
    });
    let tempOrderTotals;
    tempOrderTotals = {...orderTotals2};
    tempOrderTotals.ticketsPurchased = tempTicketsPurchased;
    tempOrderTotals.fullPurchaseAmount = tempFullAmount;
    tempOrderTotals.discountAmount = tempDiscountAmount;
    tempOrderTotals.finalPurchaseAmount = tempFinalAmount;
    if (promoCode) {
      tempOrderTotals.promoCodeApplied = promoCode;
    }
    setOrderTotals2(tempOrderTotals);
    console.log("UPDATED 'Order Totals': ", tempOrderTotals)
  }
//THIS SHOULD BE UPDATED END
//##########

//**********
// NEED TO TEST WITH REAL DATA START
  const applyPromoCodeHandler2 = (event, inputtedPromoCode) => {
    event.preventDefault();
    if (promoCodeDetails2.eventPromoCodes.includes(inputtedPromoCode)) {
      // updates "promoCodeDetails" with valid promo code instance
      let tempPromoCodeDetails = { ...promoCodeDetails2 };
      tempPromoCodeDetails.applied = true;
      tempPromoCodeDetails.errorMessage = "Valid Promo Code";
      tempPromoCodeDetails.appliedPromoCode = inputtedPromoCode;
      tempPromoCodeDetails.inputtedPromoCode = "";
      tempPromoCodeDetails.lastInvalidPromoCode = "";
      setPromoCodeDetails2(tempPromoCodeDetails);
      // updates "ticketInfo"
      let tempTicketInfo2;
      tempTicketInfo2 = [...ticketInfo2];
      // checks if ticket type has the code and then extracts and applies the discount amount
      tempTicketInfo2.forEach((item, index) => {
        if (item.ticketPriceFunction.form === "promo") {
              console.log("WE ARE IN");
          item.ticketPriceFunction.args.forEach(element => {
              console.log("New promo code: ", element);
            if (element.name === inputtedPromoCode) {
              console.log("WE HAVE A MATCH in ticketInfo2");
              item.adjustedTicketPrice = element.amount;
              item.ticketPricingCodeApplied = inputtedPromoCode;
            } else {
              console.log("NO MATCH");
            }
          })
        }
      });
      setTicketInfo2(tempTicketInfo2);
      console.log("Ticket Info Before: ", tempTicketInfo2)
      
      updateOrderTotals2(inputtedPromoCode);
      

    } else {
      // updates "promoCodeDetails" with invalid promo code instance
      let tempobject = {...promoCodeDetails2 };
      tempobject.errorMessage = "Sorry, that promo code is invalid";
      tempobject.lastInvalidPromoCode = inputtedPromoCode;
      setPromoCodeDetails2(tempobject);
    }
  };
//I HAVE UPDATED THIS SECTION END
//##########

//**********
//I HAVE UPDATED THIS SECTION START
  // *********************************
  // *********************************
  // STOPPED REFACTORING AT THIS POINT
  // LOOK TO MAKE AN <InputPromoCode> COMPONENT
  let inputPromoCode2;
  if (promoCodeDetails2.errorMessage === "Sorry, that promo code is invalid") {
    inputPromoCode2 = (
      <Aux>
        <form onSubmit={(event) => {
          applyPromoCodeHandler2(event, promoCodeDetails2.inputtedPromoValue.toUpperCase());
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
              value={promoCodeDetails2.inputtedPromoValue}
              onChange={event => {
                let tempobject = { ...promoCodeDetails2 };
                tempobject.inputtedPromoValue = event.target.value;
                tempobject.errorMessage = "";
                setPromoCodeDetails2(tempobject);
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
                let temp = { ...promoCodeDetails2 };
                temp.inputtedPromoValue = "";
                temp.errorMessage = "";
                setPromoCodeDetails2(temp);
              }}
            >
              Clear
              </button>
          </div>
          <div style={{ color: "red", fontSize: "12px" }}>
            {promoCodeDetails2.errorMessage !== ""
              ? promoCodeDetails2.errorMessage
              : null}
          </div>
        </form>
      </Aux>
    );
  } else {
    inputPromoCode2 = (
      <Aux>
        <form onSubmit={(event) => {
          applyPromoCodeHandler2(event, promoCodeDetails2.inputtedPromoValue.toUpperCase());
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
              value={promoCodeDetails2.inputtedPromoValue}
              onChange={event => {
                let tempDetails = { ...promoCodeDetails2 };
                tempDetails.inputtedPromoValue = event.target.value;
                tempDetails.errorMessage = "";
                setPromoCodeDetails2(tempDetails);
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
              disabled={!promoCodeDetails2.inputtedPromoValue}
            >
              Apply
            </button>
          </div>
        </form>
        <div style={{ color: "blue", fontSize: "12px" }}>
          {promoCodeDetails2.errorMessage !== ""
            ? promoCodeDetails2.errorMessage
            : null}
        </div>
      </Aux>
    );
  }
//I HAVE UPDATED THIS SECTION END
//##########


  const clearPromoTicketPrices2 = () => {
    console.log("WILL REMOVE PROMO CODE PRICES")
    let tempPromoCodeDetails;
    let tempTotalPurchaseAmount = 0;
    let tempFinalPurchaseAmount = 0;
    tempPromoCodeDetails = { ...promoCodeDetails2 };
    tempPromoCodeDetails.applied = false;
    tempPromoCodeDetails.input = true;
    tempPromoCodeDetails.errorMessage = "";
    tempPromoCodeDetails.appliedPromoCode = "";
    tempPromoCodeDetails.inputtedPromoValue = "";
    tempPromoCodeDetails.lastInvalidPromoCode = "";
    setPromoCodeDetails2(tempPromoCodeDetails);
    let tempTicketInfo;
    tempTicketInfo = [...ticketInfo2];
    tempTicketInfo.forEach((item, index) => {
      // clear PROMO CODE from Ticket Info
      if (item.ticketPriceFunction.form === "promo") {
        item.adjustedTicketPrice = item.ticketPrice;
        item.ticketPricingCodeApplied = "";
      }
      tempTotalPurchaseAmount = tempTotalPurchaseAmount + (item.ticketsSelected * item.ticketPrice);
      tempFinalPurchaseAmount = tempFinalPurchaseAmount + (item.ticketsSelected * item.adjustedTicketPrice);
    })
    console.log("Ticket Info After: ", tempTicketInfo);
    setTicketInfo2(tempTicketInfo);
    
    let tempOrderTotals;
    tempOrderTotals = {...orderTotals2};
    tempOrderTotals.fullPurchaseAmount = tempTotalPurchaseAmount;
    tempOrderTotals.finalPurchaseAmount = tempFinalPurchaseAmount;
    tempOrderTotals.discountAmount = 0;

    tempOrderTotals.promoCodeApplied = "";
    setOrderTotals2(tempOrderTotals);
  }

//**********
//I HAVE UPDATED THIS SECTION START
  let promoOption2;
  if (!promoCodeDetails2.available) {
    promoOption2 = null;
  } else if (promoCodeDetails2.available && promoCodeDetails2.applied) {
    promoOption2 = (
      <Aux>
      <div className={styles.AppliedPromoCode}>
        <FontAwesomeIcon
          className={styles.faCheckCircle}
          icon={faCheckCircle}
        />{" "}Code{" "}
        <span style={{ fontWeight: "600" }}>{" ",promoCodeDetails2.appliedPromoCode} </span>applied.{" "}
        <span
          className={styles.RemovePromoCode}
          onClick={() => {clearPromoTicketPrices2();
          }}
        >
          Remove
        </span></div>
        <br></br>
      </Aux>
    );
  } else if (promoCodeDetails2.input) {
    promoOption2 = (
      <Aux>
        {inputPromoCode2}
        <br></br>
      </Aux>
    );
  } else if (!promoCodeDetails2.input) {
    promoOption2 = (
      <Aux>
        <div
          className={styles.EnterPromoCode}
          onClick={() => {
            let tempPromoCodeDetails;
            tempPromoCodeDetails = { ...promoCodeDetails2 };
            tempPromoCodeDetails.input = true;
            setPromoCodeDetails2(tempPromoCodeDetails);
          }}
        >
          Enter Promo Code
        </div>
        <br></br>
      </Aux>
    );
  }
//I HAVE UPDATED THIS SECTION END
//##########

  const bogox = (i,u,n,g,d) => {
    let q = Math.floor (i/(n+g));
    let m = i%(n+g);
    let result =  q*(n*u+g*(1-d)*u) + Math.min(n,m)*u + Math.max(m-n,0)*(1-d)*u;
    return (result);
  }

  const twoferCapped = (i,u,n,tp ) => {
    let result = (Math.floor(i/n)*tp) + Math.min(tp,((i%n)*u));
    return (result);
  }

  const twofer = (i,u,n,tp ) => {
    let result = (Math.floor(i/n)*tp) + (i%n)*u;
    return (result);
  }

  const updateTicketsSelected2 = (event, ticketType) => {
    // updates "ticketInfo"
    let tempTicketInfo = [...ticketInfo2];
    tempTicketInfo.forEach(item => {
      // finds a ticketID match
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = event.target.value;
        console.log("Tickets Selected: ", event.target.value);
        if (item.ticketPriceFunction.form === "bogo") {
          let totalPurchase = bogox(
            event.target.value,
            item.ticketPrice,
            item.ticketPriceFunction.args.buy,
            item.ticketPriceFunction.args.get,
            item.ticketPriceFunction.args.discount
          );
          console.log("Bogo total Purchase: ", totalPurchase)
          item.adjustedTicketPrice = totalPurchase/event.target.value;
        } else if (item.ticketPriceFunction.form === "twofer") {
          console.log("Form field twofer: ", item.ticketPriceFunction.form);
          let totalPurchase = twofer(
            event.target.value,
            item.ticketPrice,
            item.ticketPriceFunction.args.buy,
            item.ticketPriceFunction.args.for
          );
          console.log("Twofor total Purchase: ", totalPurchase)
          item.adjustedTicketPrice = totalPurchase/event.target.value;
        } else if (item.ticketPriceFunction.form === "twoferCapped") {
          console.log("Form field twoferCapped: ", item.ticketPriceFunction.form);
          let totalPurchase = twoferCapped(
            event.target.value,
            item.ticketPrice,
            item.ticketPriceFunction.args.buy,
            item.ticketPriceFunction.args.for
          );
          console.log("TwoferCapped total Purchase: ", totalPurchase)
          item.adjustedTicketPrice = totalPurchase/event.target.value;
        }
        else {
          console.log("No DISCOUNT PRICING AVAILABLE")
        }
      }
    });
    console.log("UPDATED TICKET INFO POST TICKET SELECTION: ", tempTicketInfo)
    setTicketInfo2(tempTicketInfo);
    // updates "orderTotals"
  
    updateOrderTotals2();
    
  };

//**********
// GOOD FROM HERE
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
// TO HERE
//##########

//**********
// NEED TO TEST WITH REAL DATA START
  let ticketItems2;
  if (!isLoadingEvent) {
    ticketItems2 = (
      <div>
        {ticketInfo2.map(item => {
          return (
            <TicketItemADVANCED
              name={item}
              key={item.ticketID}
              onChange={event => {
                updateTicketsSelected2(event, item);
              }}
            ></TicketItemADVANCED>
          );
        })}
      </div>
    );
  } else {
    ticketItems2 = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  }
// NEED TO TEST WITH REAL DATA END
//###########

//**********
//ALL GOOD HERE START
  window.onresize = function(event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };

  // determines whether or not to display the purchase amount
  // "showDoublePane" must be false and "orderTotals.totalPurchaseAmount" must be > 0
  const totalAmount = show => {
    if (!isLoadingEvent && !show && orderTotals2.finalPurchaseAmount > 0) {
      return <div>${orderTotals2.finalPurchaseAmount}</div>;
    } else return null;
  };
  // determines whether or not to display the number of tickets purchased
  // "showDoublePane" must be false and "orderTotals.ticketsPurchased" must be > 0
  const ticketAmount = show => {
    if (!isLoadingEvent && !show && orderTotals2.ticketsPurchased > 0) {
      return (
        <Aux>
          <span className={styles.cartBadge}>
            <sup>{orderTotals2.ticketsPurchased}</sup>
          </span>
        </Aux>
      );
    } else return null;
  };
//ALL GOOD HERE END
//##########

  // determines whether or not to display the cart and arrow
  // "showDoublePane" must be false
  const cartLink = show => {
    if (!isLoadingEvent && !show) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          orderTotals={orderTotals2}
          isLoading={isLoadingEvent}
          showDoublePane={showDoublePane}
        />
      );
    } else return null;
  };

//**********
//ALL GOOD HERE START
  // toggles between "order pane" views
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };
//ALL GOOD HERE END
//##########

  // stores "orderTotals" and "eventLogo" in "localStorage"
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`image_${eventDetails.eventNum}`, JSON.stringify(eventLogo));
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));
      localStorage.setItem(`cart_${eventDetails.eventNum}`, JSON.stringify({
        eventDetails: eventDetails,
        promoCodeDetails: promoCodeDetails2,
        ticketInfo: ticketInfo2,
        orderTotals: orderTotals2
      }));
    }
    window.location.href = eventDetails.gatewayURL;
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let checkoutButton;
  if (!isLoadingEvent && orderTotals2.finalPurchaseAmount > 0) {
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
  let orderSummary2;
  if (!isLoadingEvent && orderTotals2.ticketsPurchased > 0) {
    orderSummary2 = <OrderSummary ticketOrder={ticketInfo2} />;
  } else if (!isLoadingEvent && orderTotals2.ticketsPurchased <= 0) {
    orderSummary2 = (
      <div className={styles.EmptyOrderSummary}>
        <FontAwesomeIcon
          className={styles.faShoppingCart}
          icon={faShoppingCart}
        />
      </div>
    );
  } else {
    orderSummary2 = null;
  }

//**********
//JUST MINOR CODE REMOVAL OF ORIGINAL VARIABLES START
  let orderPane;
  if (showDoublePane) {
    orderPane = (
      <div>
        <img
          className={styles.Image}
          src={eventLogo}
          alt="Event Logo Coming Soon!!!"
        />

        <div style={OrderSummarySection}>{orderSummary2}</div>
      </div>
    );
  } else {
    orderPane = (
      <Aux>
        <div>
          <div style={OrderSummarySectionAlt}>{orderSummary2}</div>
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
        {promoOption2}
        {ticketItems2}
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

//JUST MINOR CODE REMOVAL OF ORIGINAL VARIABLES END
//##########