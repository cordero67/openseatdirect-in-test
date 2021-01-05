import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";

import { API } from "../config.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling
} from "./Styling";
import { paymentOnSuccess } from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";
import Aux from "../hoc/Auxiliary/Auxiliary";
import CartLink from "./CartLink";
import OrderSummary from "./OrderSummary";
import { OrderConfirmTT, OrderConfirmTF, FreeConfirmTT } from "./OrderConfirms";
import styles from "./Order.module.css";

// defines the variables that accept the "cart_" data from "localStorage"
let eventDetails = {};
let ticketInfo = {};
let orderTotals = {};
let customerInformation = {};

// defines an event's image
let eventLogo = "";

// defines the PayPal "purchase_units.items" value populated from "ticketOrder"
let paypalArray = [];

// defines the styling variables
let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

// stores payment receipt data received from PayPal
let transactionInfo = {};

const Checkout = props => {
  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  // defines contact information to be sent to server
  const [contactInformation, setContactInformation] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  // defines all view control variables
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(
    false
  );

  // defines single or double pane view control variables
  const [showDoublePane, setShowDoublePane] = useState(false);
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // control variables viewing functions, assures only one is "true" at a single point in time
  const onlyShowConnectionStatus = () => {
    setShowConnectionStatus(true);
    setShowLoadingSpinner(false);
    setShowPaymentDetails(false);
    setShowPurchaseConfirmation(false);
  };

  const onlyShowLoadingSpinner = () => {
    setShowConnectionStatus(false);
    setShowLoadingSpinner(true);
    setShowPaymentDetails(false);
    setShowPurchaseConfirmation(false);
  };

  const onlyShowPaymentDetails = () => {
    setShowConnectionStatus(false);
    setShowLoadingSpinner(false);
    setShowPaymentDetails(true);
    setShowPurchaseConfirmation(false);
  };

  const onlyShowPurchaseConfirmation = () => {
    setShowConnectionStatus(false);
    setShowLoadingSpinner(false);
    setShowPaymentDetails(false);
    setShowPurchaseConfirmation(true);
  };

  // THIS REPLACED "braintreeData" INTERFACE VARIABLE
  // transaction status variable
  const [transactionStatus, setTransactionStatus] = useState({
    message: null,
    error: "",
    connection: true
  });

  // transaction status variables
  const [paypalStatus, setPaypalStatus] = useState(false);
  const [freeTicketStatus, setFreeTicketStatus] = useState(false);
  const [orderStatus, setOrderStatus] = useState(false);

  useEffect(() => {
    // downloads "order" information and "image" from "localStorage" and
    if (localStorage.getItem("eventNum")) {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
        eventDetails = tempCart.eventDetails;
        ticketInfo = tempCart.ticketInfo;
        orderTotals = tempCart.orderTotals;
        if("guestInfo" in tempCart) {
          customerInformation = tempCart.guestInfo;
        } else {
          //window.location.href = "/info";
        }
        setPaypalArray();
        console.log("Paypal Array: ", paypalArray);
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

  // sets the PayPal "purchase_units.items" value populated from "ticketInfo"
  const setPaypalArray = () => {
    paypalArray = [];
    ticketInfo.forEach(item => {
      if (item.ticketsSelected > 0) {
        let newElement;
        newElement = {
          name: `${eventDetails.eventTitle}: ${item.ticketName}`,
          sku: item.ticketID,
          unit_amount: {
            currency_code: orderTotals.currencyAbv,
            value: item.ticketPrice.toString()
          },
          quantity: item.ticketsSelected.toString()
        };
        paypalArray.push(newElement);
      }
    });
  };

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

  // **********
  // THIS SECTION NEEDS WORK
  // called by <PaypalButton> on a successful transaction

  // determines whether or not to display the purchase amount
  const totalAmount = show => {
    if (!showLoadingSpinner && !show && orderTotals.ticketsPurchased > 0) {
      return <div>{orderTotals.currencySym}{orderTotals.finalPurchaseAmount}</div>;
    } else {
      return null;
    }
  };

  // ********************************
  // ********************************
  // ********************************
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

  // **********
  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // "showError" WAS USED TO HANDLE NOT RECEIVING BRAINTREE CLIENT TOKEN
  // displays "error" if one exists
  const showError = error => (
    <div style={{ display: error ? "" : "none" }}>
      <span style={{ color: "red" }}>{error}</span>
    </div>
  );


  // **********
  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // POTENTIALLY NEED TO ADD BACK THE "onBLur" IN <div>
  // displays the "PayPalButton" or an "empty cart" error message
  const showPayPal = (
    // loads PayPal Smart buttons if order exists
      <div>
      </div>
  );

  // determines what "contact information" has been filled out by the ticket buyer
  const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let detailsMinimal = () => {
    if(contactInformation.firstName
      && contactInformation.lastName
      && contactInformation.email
      && regsuper.test(contactInformation.email)) {
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
    console.log("regsuper.test(contactInformation.email): ", regsuper.test(contactInformation.email))
  }

  
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

    console.log("transactionInfo: ",transactionInfo)
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
      firstName: contactInformation.firstName,
      lastName: contactInformation.lastName,
      numTickets: orderTotals.ticketsPurchased,
      fullAmount: orderTotals.fullPurchaseAmount,
      discount: orderTotals.discountAmount,
      totalAmount: orderTotals.finalPurchaseAmount,
      tickets: ticketInfo,
      organizerEmail: eventDetails.organizerEmail,
    };
    console.log("Inside freeTicketHandler");
    let order = {orderDetails: {guestInfo: {}}};
    let ticketArray = [];
    order.orderDetails.guestInfo.guestFirstname = contactInformation.firstName;
    order.orderDetails.guestInfo.guestLastname = contactInformation.lastName;
    order.orderDetails.guestInfo.guestEmail = contactInformation.email;
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
    let  myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let url = `${API}/free/freeTickets`;
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
        setOrderStatus(true);
        console.log("Order status: ", orderStatus);
        onlyShowPurchaseConfirmation();
        purchaseConfirmHandler();
    })
    .catch ((error)=>{
        console.log("freeTicketHandler() error.message: ", error.message);
        onlyShowPurchaseConfirmation();
        purchaseConfirmHandler();
    })
  }

  const freePayment = (
    <div>
      <div style={{display: "grid", gridGap: "4%", gridTemplateColumns: "48% 48%"}}>
        <div className="form-group">
          <br></br>
          <label styles={{ fontSize: "16px" }}>
            First Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="firstName"
            className="form-control"
              onChange={changeField}
          />
        </div>

        <div className="form-group">
          <br></br>
          <label styles={{ fontSize: "16px" }}>
            Last Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="lastName"
            className="form-control"
              onChange={changeField}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Email Address<span style={{ color: "red" }}>*</span></label>
        <input
          type="email"
          name="email"
          className="form-control"
          onChange={changeField}
        />
      </div>

      <div>{(contactInformation.email && !regsuper.test(contactInformation.email))
        ? <span style={{ color: "red", padding: "5px"}}>A valid email address is required</span>
        : null
      }</div>
    </div>
  )

  // **********
  // THIS IS THE INFORMATION SHOWN UPON A SUCCESSFULL TRANSACTION.
  const showSuccess = () => {
    if (paypalStatus && orderStatus) {
      return (
        <OrderConfirmTT
          transactionInfo={transactionInfo}
        ></OrderConfirmTT>
      );
    } else if (paypalStatus && !orderStatus) {
      return (
        <OrderConfirmTF
          transactionInfo={transactionInfo}
        ></OrderConfirmTF>
      );
    //} else if (freeTicketStatus) {
    } else if (freeTicketStatus && orderStatus) {
      return (
        <FreeConfirmTT
          transactionInfo={transactionInfo}
        ></FreeConfirmTT>
      )
    } else if (freeTicketStatus && !orderStatus) {
      return (
        <div>Problem with OSD Server in processing your tickets</div>
      )
    }  else {
      return (
        <Aux>
          <span className={styles.SubSectionHeader}>Order Rejection</span>
          <br></br>
          <br></br>
          <div>
            <span style={{ color: "red" }}>
              WE NEED TO DECIDE ON AN ERROR MESSAGE!!!
            </span>
          </div>
        </Aux>
      );
    }
  };

  // creates submit button to send free ticket information to server
  const checkoutButton = () => {
    if (orderTotals.ticketsPurchased > 0 && detailsMinimal()) {
      return (
        <button
          onClick={freeTicketHandler}
          disabled={false}
          className={styles.ButtonGreen}
        >
          <span style={{ color: "white" }}>Submit</span>
        </button>
      );
    } else {
      return (
        <button disabled={true} className={styles.ButtonGrey}>
          Submit
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
            className={styles.Image}
            src={eventLogo}
            alt="Event Logo Coming Soon!!!"
          />
        </div>
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
          <div className={styles.CartLink}>{cartLink(showDoublePane)}</div>
          <div className={styles.TotalAmount}>
            {totalAmount(showDoublePane)}
          </div>
          <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
        </div>
      </Aux>
    );
  }


  // variables that define rendered items
  let connectionStatus = null;
  let loadingSpinner = null;
  let paymentPane = null;
  let purchaseConfirmation = null;

  // ***************
  // THIS NEEDS WORK, DECIDE IF ONLY ERRORS FROM PAYPAL ARE CAUGHT HERE
  // HOW ARE WE GOING TO HANDLE ERROR IF SERVER DOES NOT RECEIVE THE ORDER
  // CONTROLS "connectionStatus" VIEW
  if (showConnectionStatus && transactionStatus.message === null) {
    connectionStatus = (
      <Aux>
        <div className={styles.BlankCanvas}>
          <h4>Connection error, please try back later.</h4>
          <br></br>
        </div>
      </Aux>
    );
  } else if (showConnectionStatus && transactionStatus.message !== null) {
    connectionStatus = (
      <Aux>
        <div className={styles.BlankCanvas}>
          <span className={styles.SubSectionHeader}>Order Status</span>
          <h5>There was a problem with your order</h5>
        </div>
      </Aux>
    );
  } else {
    connectionStatus = null;
  }

  // defines and sets "loadingSpinner" view status
  if (showLoadingSpinner) {
    loadingSpinner = (
      <div className={styles.Spinner}>
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

    paymentPane = (
      <Aux>
        <div className={styles.MainItemLeft}>
          <div className={styles.EventHeader}>
            <div className={styles.EventTitle}>
                {eventDetails.eventTitle}
            </div>
            <div className={styles.EventDate}>
              {dateRange}
            </div>
          </div>

          <Aux>
            <div style={EventTicketSection}>
              <span className={styles.TicketType}>Information (Free tickets)</span>
              <br></br>
              <span className={styles.TicketTypeSmall}>
                Provide the following to receive your free tickets
              </span>
              <br></br>
              <br></br>
              {freePayment}
            </div>
            <div className={styles.EventFooter}>
              <div className={styles.CartLink}>{cartLink(showDoublePane)}</div>
              <div className={styles.TotalAmount}>
                {totalAmount(showDoublePane)}
              </div>
              <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
            </div>
          </Aux>

        </div>
      </Aux>
    );
  }

  // defines and sets "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  if (showPurchaseConfirmation) {
    purchaseConfirmation = (
      <div className={styles.BlankCanvas}>
        <div style={{ paddingTop: "20px" }}>{showSuccess()}</div>
      </div>
    );
  } else {
    purchaseConfirmation = null;
  }

  // defines which of "paymentPane" and/or "orderPane" items to display
  let mainDisplay = null;
  if (showPaymentDetails) {
    if (showDoublePane) {
      mainDisplay = (
        <Aux>
          <div style={MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
        </Aux>
      );
    } else if (!showOrderSummaryOnly) {
      mainDisplay = (
        <Aux>
          <div style={MainGrid}>{paymentPane}</div>
        </Aux>
      );
    } else {
      mainDisplay = (
        <Aux>
          <div style={MainGrid}>{orderPane}</div>
        </Aux>
      );
    }
  } else {
    mainDisplay = null;
  }

  return (
    <Aux>
      <div style={MainContainer}>
        {loadingSpinner}
        {connectionStatus}
        {mainDisplay}
        {purchaseConfirmation}
      </div>
    </Aux>
  );
};
export default Checkout;
