import React, { useState, useEffect, Fragment } from "react";

import { API } from "../config.js";
//import { PayPalButton } from "react-paypal-button-v2";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
import classes from "./Checkout.module.css";

// defines the variables that accept the "cart_" data from "localStorage"
let eventDetails = {};
let ticketInfo = {};
let orderTotals = {};
let osdOrderId;
let orderExpiration;

let eventLogo = "";

// defines the PayPal "purchase_units.items" value populated from "ticketOrder"
let paypalArray = [];

// defines the styling variables
let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

const Checkout = () => {
  const [display, setDisplay] = useState("spinner"); // defines panel displayed: main, spinner, confirmation, paypal

  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page

  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables

  const [orderStatus, setOrderStatus] = useState(false); // defines status of order sent to server
  const [customerInformation, setCustomerInformation] = useState({});
  const [transactionInfo, setTransactionInfo] = useState({}); // defines transaction variables for display on confirmation page
  const [transactionStatus, setTransactionStatus] = useState({
    // defines status of paypal order
    message: null,
    error: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("eventNum")) {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
        eventDetails = tempCart.eventDetails;
        console.log("eventDetails: ", eventDetails);
        ticketInfo = tempCart.ticketInfo;
        orderTotals = tempCart.orderTotals;
        /*
        if (localStorage.getItem("user") === null) {
          osdOrderId = tempCart.osdOrderId;
        } else {
          osdOrderId = null;
        }
        */
        console.log("osdOrderId: ", osdOrderId);
        orderExpiration = tempCart.orderExpiration;
        if ("guestInfo" in tempCart) {
          setCustomerInformation(tempCart.guestInfo);
        } else if (localStorage.getItem("user") !== null) {
          let tempUser = JSON.parse(localStorage.getItem("user"));
          setCustomerInformation({
            sessionToken: tempUser.token,
            userId: tempUser.user._id,
            firstname: tempUser.firstname,
            lastname: tempUser.lastname,
            email: tempUser.user.email,
          });
        } else {
          window.location.href = `/et/${tempCart.eventDetails.vanityLink}?eventID=${tempCart.eventDetails.eventNum}`;
        }
        populatePaypalArray();
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
    setDisplay("main");
  }, []);

  window.onresize = function (event) {
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
  const switchShowOrderSummary = (event) => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // sets the PayPal "purchase_units.items" value populated from "ticketInfo"
  const populatePaypalArray = () => {
    paypalArray = [];

    ticketInfo.forEach((item) => {
      if (item.ticketsSelected > 0) {
        let newElement;
        newElement = {
          //name: `${eventDetails.eventTitle}: ${item.ticketName}`,
          ticketID: item.ticketID,
          ticketsSelected: item.ticketsSelected,
          ticketPrice: item.ticketPrice,
        };
        paypalArray.push(newElement);
      }
    });

    console.log("paypalArray: ", paypalArray);
  };

  // removes order related information from "localStorage"
  const purchaseConfirmHandler = () => {
    console.log("inside purchaseConfirmHandler");
    eventDetails = {};
    ticketInfo = {};
    orderTotals = {};
    eventLogo = "";
    let event = JSON.parse(localStorage.getItem("eventNum"));
    localStorage.removeItem(`cart_${event}`);
    localStorage.removeItem(`image_${event}`);
    localStorage.removeItem(`eventNum`);
  };

  // TICKET DETAILS HANDLERS
  // duped from createEvent
  const changeTicketDetail = () => {
    //let tempDetails = [...ticketDetails];
    //tempDetails.forEach((item) => {
    //  if (item.key === id) {
    //    item[event.target.name] = event.target.value;
    //  }
    //});
    //setTicketDetails(tempDetails);
    console.log("inside changeTicketDetail");
  };

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
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
  };

  // controls "paypalStatus" view
  const paypalStatus = () => {
    if (display === "paypal") {
      return (
        <div className={classes.BlankCanvas}>
          <div>
            PayPal cannot process you order at this time.
            <br></br>
            Please try again later.
          </div>
          <button>Continue</button>
        </div>
      );
    } else {
      return null;
    }
  };

  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const purchaseConfirmation = () => {
    if (display === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>
            <OrderConfirm
              clearOrder={changeTicketDetail}
              transactionInfo={transactionInfo}
              orderStatus={orderStatus}
            />
          </div>
        </div>
      );
    } else return null;
  };

  // REFACTORED TO THIS POINT 3/2/21
  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // displays the "PayPalButton" or an "empty cart" error message
  const showPayPal = (
    <div>
      <PayPalScriptProvider options={{ "client-id": "test" }}>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={(data, actions) => {
            console.log("paypalArray: ", paypalArray);
            console.log("in createOrder w data=", data);
            console.log("in createOrder w actions=", actions);
            console.log("orderTotals: ", orderTotals);
            console.log("customerInformation: ", customerInformation);

            let myHeaders = new Headers();
            let url;

            myHeaders.append("Content-Type", "application/json");

            if (osdOrderId === null) {
              myHeaders.append(
                "Authorization",
                `Bearer ${customerInformation.sessionToken}`
              );
              url = `${API}/api/tixorder/sn-mpp-create-order/${customerInformation.userId}`;
            } else {
              url = `${API}/api/tixorder/us-mpp-create-order`;
            }
            // Display the key/value pairs

            for (var pair of myHeaders.entries()) {
              console.log(pair[0] + ", " + pair[1]);
            }

            return fetch(url, {
              method: "POST",
              headers: myHeaders,
              body: JSON.stringify({
                merchant_id: "9MBSKA59BGFY6",
                eventNum: eventDetails.eventNum,
                totalAmount: orderTotals.finalPurchaseAmount,
                isFree: false,
                userPromo: orderTotals.promoCodeApplied, // optional
                tickets: paypalArray,
                firstname: customerInformation.firstname,
                lastname: customerInformation.lastname,
                email: customerInformation.email,
              }),
            })
              .then(function (res) {
                return res.json();
              })
              .then(function (data) {
                console.log("data: ", data);
                return data.id;
              });
          }}
          onApprove={(data, actions) => {
            console.log("in onApprove w data=", data);
            console.log("in onApprove w actions=", actions);

            let myHeaders = new Headers();
            let url;

            myHeaders.append("Content-Type", "application/json");

            if (osdOrderId === null) {
              myHeaders.append(
                "Authorization",
                `Bearer ${customerInformation.sessionToken}`
              );
              url = `${API}/api/tixorder/sn-mpp-capture-order/${customerInformation.userId}`;
            } else {
              url = `${API}/api/tixorder/us-mpp-capture-order`;
            }

            return fetch(url, {
              method: "POST",
              headers: myHeaders,
              body: JSON.stringify({ id: data.orderID }),
            }).then(function (res) {
              if (!res.ok) {
                alert("OSD Error");
              } else {
                alert("All good bitch");
                let event = JSON.parse(localStorage.getItem("eventNum"));
                localStorage.removeItem(`cart_${event}`);
                localStorage.removeItem(`image_${event}`);
                localStorage.removeItem(`eventNum`);
                window.location.href = `/events`;
              }
            });
          }}
          onCancel={() => {
            //console.log("onCancel 'data': ", data);
          }}
          onError={(err) => {
            console.log("onError 'err': ", err);
            setTransactionStatus({
              ...transactionStatus,
              paypalSuccess: false,
              error: err,
            });
            setDisplay("paypal");
          }}
          catchError={(err) => {
            console.log("catchError 'err': ", err);
            setTransactionStatus({
              ...transactionStatus,
              paypalSuccess: false,
              error: err,
            });
            setDisplay("paypal");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
  // LOOKS GOOD BUT REVIEW LOGIC
  const calculateTimeLeft = () => {
    let timeElapsed = new Date(orderExpiration) - new Date();
    let elapsedTime = {
      days: Math.floor(timeElapsed / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeElapsed / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeElapsed / 1000 / 60) % 60),
      seconds: Math.floor((timeElapsed / 1000) % 60),
    };
    return elapsedTime;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // runs the "timeLeft" hook every 1000 milliseconds === 1 second
  // this causes the page to refresh which updates the time expired numbers
  // these numbers are fed by the "calculateTimeLeft()" function
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });
  // LOOKS GOOD
  const timeRemaining = () => {
    if (+new Date(orderExpiration) >= +new Date()) {
      let twoDigitSec;
      if (calculateTimeLeft().seconds < 10) {
        twoDigitSec = "0" + calculateTimeLeft().seconds;
      } else {
        twoDigitSec = calculateTimeLeft().seconds;
      }

      return (
        <div style={{ fontSize: "16px", textAlign: "center" }}>
          Ticket reservation expires in {calculateTimeLeft().minutes}:
          {twoDigitSec}
        </div>
      );
    } else {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      localStorage.removeItem(`cart_${event}`);
      localStorage.removeItem(`image_${event}`);
      localStorage.removeItem(`eventNum`);
      window.location.href = `/et/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
    }
  };
  // LOOKS GOOD
  // determines whether or not to display the purchase amount
  const totalAmount = (show) => {
    if (!show && orderTotals.ticketsPurchased > 0) {
      return (
        <div>
          {orderTotals.currencySym}
          {orderTotals.finalPurchaseAmount}
        </div>
      );
    } else return null;
  };
  // LOOKS GOOD
  // determines whether or not to display cart and arrow
  const cartLink = (show) => {
    if (!show) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          isLoading={display === "spinner"}
          orderTotals={orderTotals}
          showDoublePane={showDoublePane}
        />
      );
    } else {
      return null;
    }
  };

  const mainDisplay = () => {
    if (display === "main") {
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
              {timeRemaining()}
              <br></br>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                PayPal Marketplace
              </span>
              <br></br>
              <br></br>
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
        orderSummary = (
          <OrderSummary
            cancel={true}
            eventNum={eventDetails.eventNum}
            vanity={eventDetails.vanityLink}
            ticketOrder={ticketInfo}
            ticketCurrency={orderTotals.currencySym}
          />
        );
      } else if (orderTotals.finalPurchaseAmount <= 0) {
        orderSummary = (
          <div className={classes.EmptyOrderSummary}>
            <ion-icon
              style={{ fontSize: "36px", color: "grey" }}
              name="cart-outline"
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
        return <div style={MainGrid}>{paymentPane}</div>;
      } else {
        return <div style={MainGrid}>{orderPane}</div>;
      }
    } else return null;
  };

  return (
    <div style={MainContainer}>
      {loadingSpinner()}
      {mainDisplay()}
      {purchaseConfirmation()}
      {paypalStatus()}
    </div>
  );
};
export default Checkout;
