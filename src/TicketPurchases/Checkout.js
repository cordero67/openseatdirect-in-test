import React, { useState, useEffect, Fragment } from "react";

import { PayPalButton } from "react-paypal-button-v2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling
} from "./Resources/Styling";
import { DateRange } from "./Resources/PricingFunctions";
import { paymentOnSuccess } from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";
import CartLink from "./CartLink";
import OrderSummary from "./Components/OrderSummary";
import { OrderConfirm } from "./Components/OrderConfirms";
import { loadTransactionInfo } from "./Resources/TicketSelectionFunctions";
import classes from "./Checkout.module.css";

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

const Checkout = props => {
  // defines panel displayed on main page
  const [display, setDisplay] = useState("spinner"); //main, spinner, confirmation, connection

  // defines single or double pane view control variables
  const [showDoublePane, setShowDoublePane] = useState(false);
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);


  const [customerInformation, setCustomerInformation] = useState({});



  // transaction variables for display on confirmation page
  const [transactionInfo, setTransactionInfo] = useState({});

  // THIS MUST GO
  // defines all view control variables
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(false);

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
    if (
      typeof window !== "undefined" && localStorage.getItem("eventNum")
    ) {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
        eventDetails = tempCart.eventDetails;
        ticketInfo = tempCart.ticketInfo;
        orderTotals = tempCart.orderTotals;
        if("guestInfo" in tempCart) {
          setCustomerInformation(tempCart.guestInfo);
        } else if (localStorage.getItem("user") !== null) {
          let tempUser = JSON.parse(localStorage.getItem("user"));
          setCustomerInformation({
            sessionToken: tempUser.token,
            userId: tempUser.user._id
          });
        }
        setPaypalArray();
        console.log("orderTotals: ", orderTotals);
        console.log("ticketInfo: ", ticketInfo);
      } else {
        window.location.href = "/events";
      }
      if (localStorage.getItem(`image_${event}`)) {
        eventLogo = JSON.parse(localStorage.getItem(`image_${event}`));
      }
    } else {
      window.location.href = "/events";
    }
    stylingUpdate(window.innerWidth, window.innerHeight);
    // NEED TO DELETE THIS LINE
    onlyShowPaymentDetails();
    setDisplay("main")
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

  // toggles between "order pane" views
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
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
    localStorage.removeItem(`eventNum`);
  };

  // called by <PaypalButton> on a successful transaction
  const payPalPurchase = details => {
    details.purchase_units[0].items = paypalArray;
    
    const paymentData = details

    setPaypalStatus(true);
    console.log("paypalStatus inside 'payPalPurchase': ", paypalStatus);

    let email;
    let name;

    if ("sessionToken" in customerInformation) {
      email = details.payer.email_address;
      name = `${details.payer.name.given_name} ${details.payer.name.surname}`;
    } else {
      console.log("customerInformation: ", customerInformation)
      email = customerInformation.guestEmail;
      name = `${customerInformation.guestFirstname} ${customerInformation.guestLastname}`;
    }

    setTransactionInfo(loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name));
    
    // NEED TO DELETE THIS LINE
    onlyShowLoadingSpinner();
    setDisplay("spinner");
    console.log("On Success 'details' object: ", details);
    // sends PayPal order object to the server
    paymentOnSuccess(paymentData, customerInformation)
      .then(response => {
        console.log("order received");
        console.log("response: ", response);
        if (response.status) {
          setOrderStatus(true);
          console.log("Order status: ", orderStatus);
        } else {
          throw Error();
        }
      })
      .catch(error => {
        console.log("paymentOnSuccess() error.message: ", error.message);
        setOrderStatus(false);})
      .finally(() => {
        // NEED TO DELETE THIS LINE
        onlyShowPurchaseConfirmation();
        setDisplay("confirmation");
        purchaseConfirmHandler();
      })
  };

  // defines and sets "loadingSpinner" view status
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div className={classes.Spinner}>
          <Spinner></Spinner>;
        </div>
      );
    } else {
      return null;
    }
  }

  // CONTROLS "connectionStatus" VIEW
  const connectionStatus = () => {
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
          <div>There is a problem with OSD Server in processing your tickets. Please try again later.</div>
        </div>
      )
    } else {
      return null;
    }
  }

  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const purchaseConfirmation = () => {
    if (display === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>
            <OrderConfirm
              transactionInfo={transactionInfo}
              orderStatus={orderStatus}>
            </OrderConfirm>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  const appliedCode = () => {
    if (orderTotals.promoCodeApplied) {
      return `${eventDetails.eventNum}: ${orderTotals.promoCodeApplied}`;
    } else {
      return `${eventDetails.eventNum}: NO CODE`;
    }
  }

  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // POTENTIALLY NEED TO ADD BACK THE "onBLur" IN <div>
  // displays the "PayPalButton" or an "empty cart" error message
  const showPayPal = (
    // loads PayPal Smart buttons if order exists
    <div>
      <PayPalButton
        onButtonReady={() => {
          console.log("inside onButtonReady")}}
        createOrder={(data, actions) => {
          console.log("inside createOrder")
          return actions.order.create({
            purchase_units: [
              {
                reference_id: appliedCode(),
                description: eventDetails.eventTitle,
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
          console.log("inside onSuccess")
          payPalPurchase(details);
        }}
        onError = {(err) => {
          console.log("error occurs: ", err);
          setTransactionStatus({
            ...transactionStatus,
            paypalSuccess: false,
            error: err
          });
          onlyShowPurchaseConfirmation();
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
  );
  
  const mainDisplay = () => {
    if (display === "main") {
      // determines whether or not to display the cart and arrow
      const cartLink = show => {
        if (!show) {
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

      // determines whether or not to display the purchase amount
      const totalAmount = show => {
        if (!show && orderTotals.ticketsPurchased > 0) {
          return <div>{orderTotals.currencySym}{orderTotals.finalPurchaseAmount}</div>;
        } else {
          return null;
        }
      };

      let paymentPane = (
        <Fragment>
          <div className={classes.MainItemLeft}>
            <div className={classes.EventHeader}>
              <div className={classes.EventTitle}>
                  {eventDetails.eventTitle}
              </div>
              <div className={classes.EventDate}>
                <DateRange
                  start={eventDetails.startDateTime}
                  end={eventDetails.endDateTime}
                />
              </div>
            </div>
            <div style={EventTicketSection}>
              <span className={classes.TicketType}>Payment Information</span>
              <br></br>
              <span className={classes.TicketTypeSmall}>
                Select a Payment Method
              </span>
              <br></br>
              <br></br>
              {showPayPal}
            </div>
            <div className={classes.EventFooterMod}>
              <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
              <div className={classes.TotalAmount}>
                {totalAmount(showDoublePane)}
              </div>
            </div>
          </div>
        </Fragment>
      );

      // defines and sets "orderSummary" which is displayed in right panel
      let orderSummary;
      if (orderTotals.ticketsPurchased > 0) {
        orderSummary = <OrderSummary ticketOrder={ticketInfo} ticketCurrency={orderTotals.currencySym}/>;
      } else if (orderTotals.finalPurchaseAmount <= 0) {
        orderSummary = (
          <div className={classes.EmptyOrderSummary}>
            <FontAwesomeIcon
              className={classes.faShoppingCart}
              icon={faShoppingCart}
            />
          </div>
        );
      } else {
        orderSummary = null;
      }

      // defines and sets "orderPane" which is the right panel
      let orderPane;
      if (showDoublePane) {
        orderPane = (
          <div>
            <div>
              <img
                className={classes.Image}
                src={eventLogo}
                alt="Event Logo Coming Soon!!!"
              />
            </div>
            <div style={OrderSummarySection}>{orderSummary}</div>
          </div>
        );
      } else {
        orderPane = (
          <Fragment>
            <div>
              <div style={OrderSummarySectionAlt}>{orderSummary}</div>
            </div>
            <div className={classes.EventFooterMod}>
              <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
              <div className={classes.TotalAmount}>
                {totalAmount(showDoublePane)}
              </div>
            </div>
          </Fragment>
        );
      }

      if (showDoublePane) {
        return (
          <div style={MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
        );
      } else if (!showOrderSummaryOnly) {
        return (
          <div style={MainGrid}>{paymentPane}</div>
        );
      } else {
        return (
          <div style={MainGrid}>{orderPane}</div>
        );
      }

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
export default Checkout;