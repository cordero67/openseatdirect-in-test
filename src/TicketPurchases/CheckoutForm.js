import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";

import classes from "./Checkout.module.css";

export default function CheckoutForm(props) {
  console.log("props: ", props);
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const handleSubmit2 = async (event) => {
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

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url:
          "https://app.bondirectly.com/checkout-stripe?result=success",
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
      console.log("ERROR");
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      console.log("SUCCESS");
    }
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(props.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Jenny Rosen",
        },
      },
    });

    if (result.error) {
      // Show error to your customer (for example, insufficient funds)
      console.log(result.error.message);
      props.orderFailure(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        console.log("FUCK YEA SUCCESS");
        props.orderSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit2}>
      <PaymentElement />
      <div
        style={{
          textAlign: "center",
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <button disabled={!stripe} className={classes.StripeButton}>
          SUBMIT
        </button>
      </div>
    </form>
  );
}
