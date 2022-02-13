import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";
import StripeModal from "./Modals/StripeModal";

import { API, OSD_STRIPE_ACCOUNT_ID } from "../config.js";
import { PayPalButton } from "react-paypal-button-v2";

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
import { OrderConfirm, StripeConfirm } from "./Components/OrderConfirms";
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
  const [clientReceived, setClientReceived] = useState(false);
  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page
  const [stripeModal, setStripeModal] = useState({ display: false });
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables

  const [orderStatus, setOrderStatus] = useState(false); // defines status of order sent to server
  const [customerInformation, setCustomerInformation] = useState({});
  const [transactionInfo, setTransactionInfo] = useState({}); // defines transaction variables for display on confirmation page
  const [transactionStatus, setTransactionStatus] = useState({
    // defines status of paypal order
    message: null,
    error: "",
  });

  const [clientSecret, setClientSecret] = useState("");
  const [stripePromise, setStripePromise] = useState();

  useEffect(() => {
    setDisplay("spinner");
    let received = true;

    let result = queryString.parse(window.location.search).result;

    if (result === "success") {
      console.log("success");
      setDisplay("success");
      //
    } else {
      if (typeof window !== "undefined" && localStorage.getItem("eventNum")) {
        let event = JSON.parse(localStorage.getItem("eventNum"));
        if (localStorage.getItem(`cart_${event}`)) {
          let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
          eventDetails = tempCart.eventDetails;
          console.log("cart in storage: ", tempCart);
          console.log("eventDetails: ", eventDetails);
          ticketInfo = tempCart.ticketInfo;
          orderTotals = tempCart.orderTotals;
          osdOrderId = tempCart.osdOrderId;
          orderExpiration = tempCart.orderExpiration;
          if ("guestInfo" in tempCart) {
            console.log("tempCart: ", tempCart);
            setCustomerInformation(tempCart.guestInfo);
          } else if (localStorage.getItem("user") !== null) {
            let tempUser = JSON.parse(localStorage.getItem("user"));
            setCustomerInformation({
              sessionToken: tempUser.token,
              userId: tempUser.user._id,
              email: tempUser.user.email,
            });
          } else {
            window.location.href = `/et/${tempCart.eventDetails.vanityLink}?eventID=${tempCart.eventDetails.eventNum}`;
          }
          populatePaypalArray();
          console.log("orderTotals: ", orderTotals);
          console.log("ticketInfo: ", ticketInfo);

          console.log("Inside useEffect");
          let myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          let body;
          let url;
          let tickets = [];
          tempCart.ticketInfo.forEach((item) => {
            if (item.ticketsSelected !== 0) {
              tickets.push({
                ticketID: item.ticketID,
                ticketsSelected: item.ticketsSelected,
              });
            }
          });
          //let promoCode;
          body = {
            totalAmount: tempCart.orderTotals.finalPurchaseAmount,
            eventNum: tempCart.eventDetails.eventNum,
            tickets: tickets,
          };

          if (tempCart.promoCodeDetails.appliedPromoCode !== "") {
            body.userPromo = tempCart.promoCodeDetails.appliedPromoCode;
          }

          if ("guestInfo" in tempCart) {
            console.log("customerInformation: ", customerInformation);

            body.guestFirstname = tempCart.guestInfo.firstname;
            body.guestLastname = tempCart.guestInfo.lastname;
            body.guestEmail = tempCart.guestInfo.email;

            console.log("body: ", body);
            url = `${API}/tixorder/stripe/us-create-order`;
          } else {
            console.log("customerInformation: ", customerInformation);
            console.log("body: ", body);
            url = `${API}/tixorder/stripe/sn-create-order`;

            let tempUser = JSON.parse(localStorage.getItem("user"));
            myHeaders.append("Authorization", `Bearer ${tempUser.token}`);
          }

          let fetcharg = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(body),
          };

          fetch(url, fetcharg)
            .then(handleErrors)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              console.log("fetch return got back data:", data);
              setClientSecret(data.client_secret);
              setClientReceived(true);
              received = true;
            })
            .catch((error) => {
              console.log("freeTicketHandler() error.message: ", error.message);
              received = false;
            })
            .finally(() => {});

          console.log(
            "eventDetails.stripeAccountID: ",
            eventDetails.stripeAccountID
          );

          setStripePromise(
            loadStripe(`${OSD_STRIPE_ACCOUNT_ID}`, {
              stripeAccount: eventDetails.stripeAccountID,
            })
          );
        } else {
          window.location.href = "/";
        }
        if (localStorage.getItem(`image_${event}`)) {
          eventLogo = JSON.parse(localStorage.getItem(`image_${event}`));
        }
      } else {
        window.location.href = "/";
      }
      stylingUpdate(window.innerWidth, window.innerHeight);

      if (
        typeof window !== "undefined" &&
        localStorage.getItem("user") !== null
      ) {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        let email = tempUser.user.email;
        let name = `${tempUser.user.firstname} ${tempUser.user.lastname}`;

        setTransactionInfo(
          loadTransactionInfo(
            eventDetails,
            orderTotals,
            ticketInfo,
            email,
            name
          )
        );
      } else {
        let email = customerInformation.email;
        let name = `${customerInformation.firstname} ${customerInformation.lastname}`;
        console.log("customerInformation for guest: ", customerInformation);

        setTransactionInfo(
          loadTransactionInfo(
            eventDetails,
            orderTotals,
            ticketInfo,
            email,
            name
          )
        );
      }
      if (received) {
        console.log("Display is main");
        setDisplay("main");
      } else {
        console.log("Display is error");
        setDisplay("error");
      }
    }
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
          name: `${eventDetails.eventTitle}: ${item.ticketName}`,
          sku: item.ticketID,
          unit_amount: {
            currency_code: orderTotals.currencyAbv,
            value: item.ticketPrice.toString(),
          },
          quantity: item.ticketsSelected.toString(),
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

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  // submits paypal transaction information to the server
  const payPalPurchase = (details) => {
    console.log("details: ", details);
    setDisplay("spinner");
    let order = {
      eventNum: eventDetails.eventNum,
      totalAmount: orderTotals.finalPurchaseAmount,
      paypalId: details.id, // not required if “isFree === true”
    };

    if (orderTotals.finalPurchaseAmount === 0) {
      order.isFree = true;
    } else {
      order.isFree = false;
    }

    let tickets = [];
    ticketInfo.forEach((item) => {
      if (item.ticketsSelected > 0) {
        let tempObject = {};
        tempObject.ticketID = item.ticketID;
        tempObject.ticketsSelected = item.ticketsSelected;
        tickets.push(tempObject);
        if (
          item.ticketsSelected > 0 &&
          "form" in item.ticketPriceFunction &&
          item.ticketPriceFunction.form === "promo" &&
          item.adjustedTicketPrice !== item.ticketPrice
        ) {
          order.userPromo = item.ticketPriceFunction.args[0].name;
        }
      }
    });

    order.tickets = tickets;

    let url;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let email = tempUser.user.email;
      let name = `${tempUser.user.firstname} ${tempUser.user.lastname}`;

      setTransactionInfo(
        loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name)
      );
      url = `${API}/tixorder/signed_place_neworder`;

      console.log("signed order: ", order);
      console.log(
        "customerInformation for signed in user: ",
        customerInformation
      );

      myHeaders.append(
        "Authorization",
        `Bearer ${customerInformation.sessionToken}`
      );
    } else {
      let email = customerInformation.email;
      let name = `${customerInformation.firstname} ${customerInformation.lastname}`;
      console.log("customerInformation for guest: ", customerInformation);

      setTransactionInfo(
        loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name)
      );

      // USED BY CURRENT CODE APRIL 17, 2021
      url = `${API}/tixorder/unsigned_place_neworder`;

      order.guestFirstname = customerInformation.firstname;
      order.guestLastname = customerInformation.lastname;
      order.guestEmail = customerInformation.email;

      console.log("unsigned order: ", order);
    }

    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(order),
    };

    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        setOrderStatus(data.status);
        setDisplay("confirmation");
      })
      .catch((error) => {
        console.log("paymentOnSuccess() error.message: ", error.message);
        setOrderStatus(false);
        setDisplay("confirmation");
      })
      .finally(() => {
        purchaseConfirmHandler();
      });
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

  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const purchaseConfirmation = () => {
    if (display === "success") {
      console.log("CONFIRMTION");
      //console.log("transactionInfo: ", transactionInfo);
      //console.log("orderStatus: ", orderStatus);
      return (
        <div className={classes.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>
            <StripeConfirm
              transactionInfo={transactionInfo}
              orderStatus={orderStatus}
            />
          </div>
        </div>
      );
    } else return null;
  };

  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const stripeSuccess = () => {
    if (display === "success") {
      console.log("CONFIRMTION");
      //console.log("transactionInfo: ", transactionInfo);
      //console.log("orderStatus: ", orderStatus);
      return (
        <div className={classes.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>
            Your order was successfully processed by Stripe
          </div>
          <button
            className={classes.ButtonGreen}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            CONTINUE
          </button>
          <StripeConfirm
            transactionInfo={transactionInfo}
            //  orderStatus={transactionInfo}
          ></StripeConfirm>
        </div>
      );
    } else {
      console.log("UNSUCCESS");
      return null;
    }
  };

  const appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "4px",
      // See all possible variables below
    },
  };

  const options = () => {
    if (display === "main" || clientReceived) {
      console.log("inside options");
      return {
        // passing the client secret obtained in step 2
        clientSecret: clientSecret,
        // Fully customizable with appearance API.

        appearance: {
          appearance,
        },
      };
    } else return null;
  };

  const showStripe = () => {
    console.log("clientSecret: ", clientSecret);
    if (clientSecret) {
      return (
        <div>
          <Elements stripe={stripePromise} options={options()}>
            <CheckoutForm
              clientSecret={clientSecret}
              transactionInfo={transactionInfo}
              orderStatus={clientSecret}
              orderFailure={(event) => {
                console.log("UNUCCESSFUL ORDER");

                let tempStripeModal = { ...stripeModal };
                tempStripeModal.display = true;
                tempStripeModal.message = event;
                setStripeModal(tempStripeModal);
              }}
              orderSuccess={() => {
                console.log("SUCCESSFUL ORDER");
                let email = customerInformation.email;
                let name = `${customerInformation.firstname} ${customerInformation.lastname}`;

                setTransactionInfo(
                  loadTransactionInfo(
                    eventDetails,
                    orderTotals,
                    ticketInfo,
                    email,
                    name
                  )
                );
                setDisplay("confirmation");
              }}
            />
          </Elements>
        </div>
      );
    } else return null;
  };

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

  //const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // runs the "timeLeft" hook every 1000 milliseconds === 1 second
  // this causes the page to refresh which updates the time expired numbers
  // these numbers are fed by the "calculateTimeLeft()" function
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });
  */

  /*
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
  */
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
    if (display === "main" || display === "error") {
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
              <br></br>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                Stripe Checkout
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
              {showStripe()}
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

  const responseModal = () => {
    if (stripeModal.display) {
      return (
        <StripeModal
          show={true}
          details={stripeModal.message}
          closeModal={() => {
            let tempStripeModal = { ...stripeModal };
            tempStripeModal.display = false;
            setStripeModal(tempStripeModal);
          }}
        ></StripeModal>
      );
    } else return null;
  };

  return (
    <div style={MainContainer}>
      {loadingSpinner()}
      {responseModal()}
      {mainDisplay()}
      {stripeSuccess()}
    </div>
  );
};
export default Checkout;
