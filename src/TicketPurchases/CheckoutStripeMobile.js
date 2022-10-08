import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutFormNEW";
import StripeModal from "./Modals/StripeModal";

import { OSD_STRIPE_ACCOUNT_ID } from "../config.js";

import { EventTicketSectionStyling } from "./Resources/Styling";
import Spinner from "../components/UI/Spinner/Spinner";
import classes from "./Checkout.module.css";

// defines the styling variables
let EventTicketSection = {};

const Checkout = () => {
  const [display, setDisplay] = useState("spinner"); // defines panel displayed: main, spinner, confirmation, paypal
  const [clientReceived, setClientReceived] = useState(false);
  const [stripeModal, setStripeModal] = useState({ display: false });
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables
  const [stripeError, setStripeError] = useState("none");

  const [clientSecret, setClientSecret] = useState("");
  const [stripePromise, setStripePromise] = useState();

  useEffect(() => {
    setDisplay("spinner");
    // "https://app.bondirectly.com/checkout-stripe?
    // result=success&
    // payment_intent=pi_3Lqakq4KmDyQDRAL16sizCPO&
    // payment_intent_client_secret=pi_3Lqakq4KmDyQDRAL16sizCPO_secret_qSB9vvfpPkRLDhhKtQ0W9ZFsl&
    // redirect_status=succeeded"

    // stripeAccount: "acct_1LF5yd4KmDyQDRAL",

    // https://app.bondirect.com/checkout-stripe?client-secret=xxxxxxx

    let result = queryString.parse(window.location.search).result;
    let stripeAccount = queryString.parse(window.location.search).account;
    let clientSecret = queryString.parse(window.location.search).clientSecret;

    if (result === "success") {
      console.log("success");
      setDisplay("success");
      //
    } else if (stripeAccount) {
      console.log("There is a stripeAccount: ", stripeAccount);
      console.log("There is a clientSecret: ", clientSecret);

      setClientSecret(clientSecret);
      setClientReceived(true);

      setStripePromise(
        loadStripe(`${OSD_STRIPE_ACCOUNT_ID}`, {
          //stripeAccount: eventDetails.stripeAccountID,
          //stripeAccount: "acct_1LF5yd4KmDyQDRAL",
          stripeAccount: stripeAccount,
        })
      );

      console.log("Display is main");
      setDisplay("main");
    } else {
      console.log("there is NOT a stripeAccount");

      console.log("Display is error");
      setDisplay("error");
    }
  }, []);

  window.onresize = function (event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };

  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    EventTicketSection = EventTicketSectionStyling(inWidth, inHeight);
    setIsRestyling(false);
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
  const stripeSuccess = () => {
    if (display === "success") {
      console.log("CONFIRMTION IN STROPE MOBILE");
      return (
        <div className={classes.BlankCanvas}>
          You have successfully paid through Stripe.
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
    },
  };

  const options = () => {
    if (display === "main" || clientReceived) {
      console.log("inside options");
      return {
        clientSecret: clientSecret,
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
              stripeError={stripeError}
              clearStripeError={() => setStripeError("none")}
              showError={(message) => {
                console.log("message: ", message);
                setStripeError(message);
              }}
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
              }}
            />
          </Elements>
        </div>
      );
    } else return null;
  };

  const mainDisplay = () => {
    if (display === "main" || display === "error") {
      let paymentPane = (
        <Fragment>
          <div style={EventTicketSection}>
            <br></br>
            <span className={classes.TicketType}>Payment Information</span>
            <br></br>
            <br></br>
            {showStripe()}
          </div>
        </Fragment>
      );

      return <div>{paymentPane}</div>;
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
    <div>
      {loadingSpinner()}
      {responseModal()}
      {mainDisplay()}
      {stripeSuccess()}
    </div>
  );
};
export default Checkout;

// defines the variables that accept the "cart_" data from "localStorage"
// let orderExpiration;

// LOOKS GOOD BUT REVIEW LOGIC
/*
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
  */

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
      window.location.href = `/et/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
    }
  };
  */
