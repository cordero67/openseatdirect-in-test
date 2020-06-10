import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";

import { PayPalButton } from "react-paypal-button-v2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling
} from "./StylingOLD";
import { expressPaymentOnSuccess } from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";
import Aux from "../hoc/Auxiliary/Auxiliary";
import CartLink from "./CartLink";
import OrderSummary from "./OrderSummary";
import { OrderConfirmationTT, OrderConfirmationTF } from "./OrderConfirmation";
import styles from "./Order.module.css";

// defines the ticket order populated from "localStorage"
//let ticketOrder = {};

// defines the variables that accept the "cart_" data from "localStorage"
let eventDetails = {};
let ticketInfo = {};
let orderTotals = {};

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

  // sets the PayPal "purchase_units.items" value populated from "ticketOrder"
  const setPaypalArray = () => {
    paypalArray = [];
    ticketInfo.forEach(item => {
      if (item.ticketsSelected > 0) {
        let newElement;
        newElement = {
          name: `${eventDetails.eventName}: ${item.ticketName}`,
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

  // clears entire "ticketOrder" object and "eventLogo", removes "cart" and "image" from "localStorage"
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
  const payPalExpressBuy = details => {
      details.purchase_units[0].items = paypalArray;
    const paymentData = {
      paypalOrderDetails: details
    };

    setPaypalStatus(true);
    console.log("paypalStatus inside 'payPalExpressBuy': ", paypalStatus);

    transactionInfo = {
      eventTitle: eventDetails.eventTitle,
      venue: eventDetails.locationVenueName,
      address1: eventDetails.locationAddress1,
      address2: eventDetails.locationAddress2,
      city: eventDetails.locationCity,
      state: eventDetails.locationState,
      zipPostalCode: eventDetails.locationZipPostalCode,
      countryCode: eventDetails.locationCountryCode,
      locationNote: eventDetails.locationNote,
      webinarLink: eventDetails.webinarLink,
      onlineInformation: eventDetails.onlineInformation,
      tbaInformation: eventDetails.tbaInformation,
      startDateTime: eventDetails.startDateTime,
      endDateTime: eventDetails.endDateTime,
      timeZone: eventDetails.timeZone,
      paypalEmail: details.payer.email_address,
      firstName: details.payer.name.given_name,
      lastName: details.payer.name.surname,
      numTickets: orderTotals.ticketsPurchased,
      fullAmount: orderTotals.fullPurchaseAmount,
      discount: orderTotals.discountAmount,
      totalAmount: orderTotals.finalPurchaseAmount,
      tickets: ticketInfo,
      organizerEmail: eventDetails.organizerEmail,
    };

    console.log("transactionInfo: ",transactionInfo)

    onlyShowLoadingSpinner();
    console.log("On Success 'details' object: ", details);
    // sends PayPal order object to the server
    expressPaymentOnSuccess(paymentData)
      .then(response => {
        console.log("order received");
        console.log("response: ", response);
        setOrderStatus(true);
        console.log("Order status: ", orderStatus);
        onlyShowPurchaseConfirmation();
        purchaseConfirmHandler();
      })
      .catch(error => {
        console.log("processExpressPayment() error.message: ", error.message);
        onlyShowPurchaseConfirmation();
        purchaseConfirmHandler();
      });
  };

  // determines whether or not to display the purchase amount
  const totalAmount = show => {
    if (!showLoadingSpinner && !show && orderTotals.finalPurchaseAmount > 0) {
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
  if (!showLoadingSpinner && orderTotals.finalPurchaseAmount > 0) {
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

  const appliedCode = () => {
    if (orderTotals.promoCodeApplied) {
      return `${eventDetails.eventNum}: ${orderTotals.promoCodeApplied}`;
    } else {
      return `${eventDetails.eventNum}: NO CODE`;
    }
  }

  // **********
  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // POTENTIALLY NEED TO ADD BACK THE "onBLur" IN <div>
  // displays the "PayPalButton" or an "empty cart" error message
  const showPayPal = () => (
    // loads PayPal Smart buttons if order exists
    <div>
      {orderTotals.finalPurchaseAmount > 0 ? (
        <div>
          <PayPalButton
            onButtonReady={() => {}}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    reference_id: appliedCode(),
                    description: eventDetails.eventName,
                    payment_descriptor: eventDetails.eventNum,
                    amount: {
                      currency_code: orderTotals.currencyAbv,
                      value: orderTotals.finalPurchaseAmount.toString(),

                      breakdown: {
                        item_total: {
                          currency_code: orderTotals.currencyAbv,
                          value: orderTotals.fullPurchaseAmount.toString()
                        },
                        discount: {
                          currency_code: orderTotals.currencyAbv,
                          value: orderTotals.discountAmount.toString()
                        }
                      }
                    },
                    items: paypalArray
                  }
                ]
              });
            }}
            onCancel={data => {
              console.log("onCancel 'data': ", data);
            }}
            onSuccess={(details, data) => {
              payPalExpressBuy(details);
            }}
            options={{
              clientId: eventDetails.gatewayClientID,
              currency: orderTotals.currencyAbv
            }}
            catchError={err => {
              console.log("catchError 'err': ", err);
              setTransactionStatus({
                ...transactionStatus,
                paypalSuccess: false,
                error: err
              });
              onlyShowPurchaseConfirmation();
            }}
          />
        </div>
      ) : (
        <div>
          <span className={styles.AlertText}>
            Your order is empty, please return to ticket selection page.
          </span>
        </div>
      )}
    </div>
  );

  // **********
  // THIS IS THE INFORMATION SHOWN UPON A SUCCESSFULL TRANSACTION.
  const showSuccess = () => {
    if (paypalStatus && orderStatus) {
      return (
        <OrderConfirmationTT
          transactionInfo={transactionInfo}
        ></OrderConfirmationTT>
      );
    } else if (paypalStatus && !orderStatus) {
      return (
        <OrderConfirmationTF
          transactionInfo={transactionInfo}
        ></OrderConfirmationTF>
      );
    } else {
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
        <div className={styles.EventFooterMod}>
          <div className={styles.CartLink}>{cartLink(showDoublePane)}</div>
          <div className={styles.TotalAmount}>
            {totalAmount(showDoublePane)}
          </div>
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

          <div style={EventTicketSection}>
            <span className={styles.TicketType}>Payment Information</span>
            <br></br>
            <span className={styles.TicketTypeSmall}>
              Select a Payment Method
            </span>
            <br></br>
            <br></br>
            {showPayPal()}
          </div>

          <div className={styles.EventFooterMod}>
            <div className={styles.CartLink}>{cartLink(showDoublePane)}</div>
            <div className={styles.TotalAmount}>
              {totalAmount(showDoublePane)}
            </div>
          </div>
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
