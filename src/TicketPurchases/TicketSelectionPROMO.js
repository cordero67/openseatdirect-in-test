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
import CartLink from "./CartLink";
import OrderSummary from "./OrderSummary";
import TicketItemPROMO from "./TicketItemPROMO";
import styles from "./Order.module.css";

// defines an event's NON ticket type specific information
let eventDetails;

// defines an event's image
let eventLogo = "";

// defines checkout page address based on payment gateway
let paymentGateway = "/";

// defines ticket order object sent to "Checkout" page: event information and ticket type specific data
let ticketOrder;

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

  // defines an event's specific ticket type information
  // also tracks the number of tickets selected throughout selection process
  const [ticketInfo, setTicketInfo] = useState([]);
  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  
  // defines an event's specific ticket type promo codes
  const [promoCodeDetails, setPromoCodeDetails] = useState({
    available: true,
    applied: false,
    input: false,
    errorMessage: "",
    currentPromoValue: "",
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
          "EVENT DATA FROM SERVER inside 'getEventData()': ",
          res
        );
        loadEventDetails(res);
        loadTicketInfo(res.ticket);
        loadPromoCodeDetails(res.ticket);
        createTicketOrder(res);

        //console.log("About to call 'eventImage()' inside 'TicketSelection'");
        //eventImage(queryString.parse(window.location.search).eventID);
        console.log("About to call 'getEventImage()' inside 'eventData()'");
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
        // need to know handle this situation
        setIsLoadingEvent(true);
        setIsSuccessfull(false);
      })
      .finally(() => {});
  };

  const loadEventDetails = event => {
    eventDetails = {
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventCategory: event.eventCategory,
      eventStatus: event.eventStatus,
      longDescription: event.longDescription,
      organizer: event.organizerName,
      organizerEmail: event.accountId.accountEmail,
      gateway: event.accountId.paymentGatewayType,
      gatewayClientID: event.accountId.paypalExpress_client_id,
      shortDescription: event.shortDescription,
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
    // sets the checkout page url based on payment gateway identified
    if (eventDetails.gateway === "PayPalExpress") {
      paymentGateway = "/checkout_pp";
    } else if (eventDetails.gateway === "Braintree") {
      paymentGateway = "/checkout_bt";
    }
    console.log("EVENT DETAILS from 'loadEventDetails()': ", eventDetails);
  };


  const loadTicketInfo = ticket => {
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
    console.log("TEMP TICKET INFO inside 'loadTicketInfo()': ", tempTicketArray);

    tempTicketArray.forEach(item => {
    console.log("PROMO CODES inside 'loadTicketInfo()': ", item.ticketPromoCodes)
    })

  };

  // receives ticket field from event data received from server
  const loadPromoCodeDetails = (ticket) => {
    // defines temporary array that captures all the unique promo codes
    let tempCodesArray = [];
    
    ticket.forEach(item => {
      console.log("INSIDE loadPromoCodeDetails", item);
      let codes = item.promoCodesAlt
      console.log("INSIDE loadPromoCodeDetails codes", codes);
      codes.map(item2 => {
        if (!tempCodesArray.includes(item2.code)) {
      tempCodesArray.push(item2.code);}})
    })
    console.log("INSIDE loadPromoCodeDetails tempCodesArray", tempCodesArray);

    // populate "promoCodeDetails" with "eventPromoCodes" and "available" properties
    let tempCodeDetail = {...promoCodeDetails};
    tempCodeDetail.eventPromoCodes = tempCodesArray
    if (tempCodesArray.length > 0) {

    tempCodeDetail.available = true;
    }
    console.log("INSIDE loadPromoCodeDetails tempCodeDetail", tempCodeDetail);

    setPromoCodeDetails(tempCodeDetail);
    console.log("INSIDE loadPromoCodeDetails promoCodeDetails", promoCodeDetails);

  };

  const createTicketOrder = event => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null
    ) {
      console.log("ORDER EXISTS!");
      ticketOrder = JSON.parse(
        localStorage.getItem(`cart_${eventDetails.eventNum}`)
      );
      setTicketInfo(ticketOrder.tickets);
    } else {
      const ticketParameters = [];
      event.ticket.forEach(item => {
        const newTicketItem = {
          ticketID: item._id,
          ticketPrice: item.currentTicketPrice,
          promoTicketPrice: item.promoTicketPrice,
          ticketPromoCodeApplied: item.ticketPromoCodeApplied,
          ticketName: item.ticketName,
          ticketsSelected: 0,
          ticketDescription: item.ticketDescription
        };
        ticketParameters.push(newTicketItem);
      });

      ticketOrder = {
        gateway: eventDetails.gateway,
        clientID: eventDetails.gatewayClientID,
        location: eventDetails.location,
        userEmail: eventDetails.organizerEmail,
        eventNum: event.eventNum,
        eventUrl: event.eventUrl,
        eventName: event.eventTitle,
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
        totalPurchaseAmount: 0,
        ticketsPurchased: 0,
        tickets: ticketParameters
      };
      console.log("TICKET ORDER from 'createTicketOrder()': ", ticketOrder);
    }
  };

  let eventHeader;

  if (!isLoadingEvent) {
    eventHeader = (
      <Aux>
        <div className={styles.EventTitle}>
          {eventDetails.eventTitle}
        </div>
        <div className={styles.EventDate}>
          {eventDetails.startDateTime}
        </div>
      </Aux>
    );
  } else eventHeader = null;

  const changeInputHandler = () =>  {
    let tempPromoCodeDetails;
    tempPromoCodeDetails = {...promoCodeDetails};
    tempPromoCodeDetails.input = true;
    setPromoCodeDetails(tempPromoCodeDetails);
  };

  const applyPromoCodeHandler = (event, inputtedPromoCode) => {
    event.preventDefault()
    console.log("ENTERING APPLY PROMO CODE HANDLER");
    console.log("promoCodeDetails", promoCodeDetails);
    console.log("ticketInfo", ticketInfo);

    console.log("TICKET INFO: ", ticketInfo);
    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
      console.log("applyPromoCodeHandler ", inputtedPromoCode);
      let tempPromoCodeDetails = { ...promoCodeDetails };
      tempPromoCodeDetails.applied = true;
      tempPromoCodeDetails.errorMessage = "VALID PROMO CODE";
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
        console.log("Individual Ticket Type: ",item)
        console.log("Individual Ticket Type Promo Codes: ",item.ticketPromoCodes)

        item.ticketPromoCodes.forEach(element => {
          console.log("EACH CODE VALUE: ", element.code)
          if(element.code === inputtedPromoCode) {
            console.log("WE HAVE A MATCH")
            discount = element.amount;
            // add ticket price code
            item.promoTicketPrice = item.ticketPrice - discount
            item.ticketPromoCodeApplied = inputtedPromoCode
            console.log("Updated Discount Amount: ", discount)
          } else {
            console.log("NO MATCH")
            console.log("Updated Discount Amount: ", discount)
          } 
        })
      })
      setTicketInfo(tempTicketInfo);
      console.log("TICKET INFO after promo code applied: ",tempTicketInfo)
    } else {
      let tempobject = {...promoCodeDetails};
      tempobject.errorMessage = "INVALID PROMO CODE";
      setPromoCodeDetails(tempobject);
    }
  };

  let inputPromoCode;

  if (promoCodeDetails.errorMessage === "INVALID PROMO CODE") {
    inputPromoCode = (
      <Aux>
        <div className={styles.PromoGrid} >
          <input
            type="text"
            style={{ color: "grey", outline: "none" }}
            placeholder="Enter code"
            value={promoCodeDetails.currentPromoValue}
            onChange={event => {
              let tempobject = {...promoCodeDetails};
              tempobject.currentPromoValue = event.target.value;
              tempobject.errorMessage = "";
              setPromoCodeDetails(tempobject);}}
          ></input>

          <div style={{fontSize: "14px", border: "2px solid red", padding: "10px", textAlign: "right" }} onClick={() => {
            let temp = {...promoCodeDetails};
            temp.currentPromoValue = "";
            temp.errorMessage = "";
            setPromoCodeDetails(temp);
          }}>
            Clear
          </div>
        </div>
        <div style={{color: "red"}}>{promoCodeDetails.errorMessage !== "" ? promoCodeDetails.errorMessage : null}</div>
      </Aux>
      )
  } else { inputPromoCode = (
    <Aux>
    <div className={styles.PromoGrid}>
      <input
        type="text"
        style={{ color: "grey", outline: "none" }}
        placeholder="Enter code"
        value={promoCodeDetails.currentPromoValue}
        onChange={event => {
          let tempobject = {...promoCodeDetails};
          tempobject.currentPromoValue = event.target.value;
          tempobject.errorMessage = "";
          setPromoCodeDetails(tempobject);}}
      ></input>

      <div style={{fontSize: "14px", border: "2px solid red", padding: "10px", textAlign: "right" }} onClick={event => {
        applyPromoCodeHandler(event, promoCodeDetails.currentPromoValue)}
      }>Apply
      </div>
      </div>
      <div>{promoCodeDetails.errorMessage !== "" ? promoCodeDetails.errorMessage : null}</div>
    </Aux>
  )}

  let controlData = (null
    /*
    <div style={{  paddingLeft: "40px", color: "red", fontSize: "14px" }}>
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
  )

  let promoOption;

  if (!promoCodeDetails.available) {
    promoOption = (null
      /*
      <Aux>
        <div style={{color: "red", fontSize: "16px" }}>
          No promo codes exist for this event
        </div>
        {controlData}
      </Aux>*/
    );
  } else if (promoCodeDetails.available && promoCodeDetails.applied) {
    promoOption = (
      <Aux>
        <div style={{ color: "blue", fontSize: "16px" }}>
          Promo code has been applied to all respective ticket prices.
        </div>
        <br></br>
        {controlData}
      </Aux>
    );
  } else if (promoCodeDetails.input) {
    console.log("TICKETINFO: ",ticketInfo);
    promoOption = (
      <Aux>
        {inputPromoCode}
        <br></br>
        {controlData}
      </Aux>
    );
  } else if (!promoCodeDetails.input) {
    console.log("TICKETINFO: ",ticketInfo);
    promoOption = (<Aux>
      <div style={{color: "blue"}} onClick={() =>  {
        let tempPromoCodeDetails;
        tempPromoCodeDetails = {...promoCodeDetails};
        tempPromoCodeDetails.input = true;
        setPromoCodeDetails(tempPromoCodeDetails);
      }}>Enter Promo Code</div>
        <br></br>
        {controlData}
      </Aux>)}

  const updateTicketsSelected = (event, ticketType) => {
    // updates "ticketInfo"
    let tempTicketInfo = [...ticketInfo];
    tempTicketInfo.forEach(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = event.target.value;
      }
    });
    setTicketInfo(tempTicketInfo);
    // updates "ticketOrder.tickets"
    console.log("Ticket Order before modifying ticketsSelected: ",ticketOrder)
    ticketOrder.tickets.forEach(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = parseInt(ticketType.ticketsSelected);
      }
    });
    console.log("Ticket Order after modifying ticketsSelected: ",ticketOrder)
    // updates "ticketOrder.totalPurchaseAmount" and "ticketOrder.ticketsPurchased"
    let tempTotalPurchaseAmount = 0;
    let temptTicketsPurchased = 0;
    ticketOrder.tickets.forEach(item => {
      tempTotalPurchaseAmount += item.ticketsSelected * item.ticketPrice;
      temptTicketsPurchased += item.ticketsSelected;
    });
    ticketOrder.totalPurchaseAmount = tempTotalPurchaseAmount;
    ticketOrder.ticketsPurchased = temptTicketsPurchased;
    console.log("ticketOrder.tickets: ", ticketOrder.tickets);
    console.log("ticketOrder: ", ticketOrder);
  };

  let ticketItems;

  if (!isLoadingEvent) {
    ticketItems = (
      <div>
        {ticketInfo.map(item => {
          return (
            <TicketItemPROMO
              name={item}
              key={item.ticketID}
              onChange={event => {
                updateTicketsSelected(event, item);
              }}
            ></TicketItemPROMO>
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
  // "showDoublePane" must be false and "ticketOrder.totalPurchaseAmount" must be > 0
  const totalAmount = show => {
    if (!isLoadingEvent && !show && ticketOrder.totalPurchaseAmount > 0) {
      return <div>${ticketOrder.totalPurchaseAmount}</div>;
    } else return null;
  };

  // determines whether or not to display the number of tickets purchased
  // "showDoublePane" must be false and "ticketOrder.ticketsPurchased" must be > 0
  const ticketAmount = show => {
    if (!isLoadingEvent && !show && ticketOrder.ticketsPurchased > 0) {
      return (
        <Aux>
          <span className={styles.cartBadge}>
            <sup>{ticketOrder.ticketsPurchased}</sup>
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
          ticketOrder={ticketOrder}
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

  // stores "ticketOrder" and "eventLogo" in "localStorage"
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `cart_${eventDetails.eventNum}`,
        JSON.stringify(ticketOrder)
      );
      localStorage.setItem(`image`, JSON.stringify(eventLogo));
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));
    }
    window.location.href = paymentGateway;
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let checkoutButton;
  if (!isLoadingEvent && ticketOrder.totalPurchaseAmount > 0) {
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
  if (!isLoadingEvent && ticketOrder.totalPurchaseAmount > 0) {
    orderSummary = <OrderSummary ticketOrder={ticketOrder} />;
  } else if (!isLoadingEvent && ticketOrder.totalPurchaseAmount <= 0) {
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
