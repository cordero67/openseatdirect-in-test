import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import CardSection from "./CardSection";

export default function CheckoutForm(props) {
  //console.log("props: ", props);
  const stripe = useStripe();
  const elements = useElements();

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
      props.orderFailure();
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        console.log("FUCK YEA SUCCESS");
        props.orderSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      CHECKOUT FORM COMPONENT
      <br></br>
      <br></br>
      <br></br>
      <CardSection />
      <button disabled={!stripe}>Confirm order</button>
    </form>
  );
}
