import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { STRIPE_SUCCESS_URL } from "../config.js";

import classes from "./Checkout.module.css";

export default function CheckoutForm(props) {
  console.log("props: ", props);
  console.log("STRIPE_SUCCESS_URL: ", STRIPE_SUCCESS_URL);
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    /*
    const clientSecret = new URLSearchParams(window.location.search).get(
      props.clientSecret
    );
    */

    const clientSecret = props.clientSecret;

    console.log("clientSecret: ", clientSecret);

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          console.log("Payment succeeded!");
          setMessage("Payment succeeded!");
          break;
        case "processing":
          console.log("Your payment is processing.");
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          console.log("Your payment was not successful, please try again.");
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          console.log("Something went wrong.");
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // load event data into local storage

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `transaction`,
        JSON.stringify(props.transactionInfo)
      );
    }
    props.clearStripeError();

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: STRIPE_SUCCESS_URL,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
      props.showError(error.message);
      console.log("ERROR");
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      console.log("SUCCESS");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div
        style={{
          textAlign: "center",
          paddingTop: "40px",
          paddingBottom: "20px",
        }}
      >
        <button disabled={!stripe} className={classes.StripeButton}>
          Submit
        </button>
      </div>
      <div style={{ textAlign: "center", color: "red" }}>
        {props.stripeError !== "none" ? props.stripeError : null}
      </div>
    </form>
  );
}
