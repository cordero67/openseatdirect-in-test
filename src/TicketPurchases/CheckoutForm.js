import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import classes from "./Checkout.module.css";


const REACT_APP_APP_URL= process.env.REACT_APP_APP_URL;


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

    console.log ("about to stripe.confirmPayment w elements=",  elements);

 //https://stripe.com/docs/js/payment_intents/confirm_payment?type=idealBank
 
      //`Elements` instance that was used to create the Payment Element

//4example of real return
// https://app.bondirectly.com/checkout-stript-result?result=success
//    &payment_intent=pi_3KUg4m4DwDsj7HXk1EgiOTD8
//    &payment_intent_client_secret=pi_3KUg4m4DwDsj7HXk1EgiOTD8_secret_QIrROYLBUbPXKoexrvJVAEJPR
//    &redirect_status=succeeded

    let returnurl = `${REACT_APP_APP_URL}/checkout-stripe-result?result=success`;

    let pay_options = {
        elements,
        confirmParams: {
          return_url: returnurl
        }
    };
    if (props.name) pay_options.payment_method_data ={billing_details:props.name};

    const result  = await stripe.confirmPayment(pay_options);

    console.log ("stripe.confirmPayment result=", result );

    if (result.error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      props.onStripeUserError(result.error.message);
      console.log(" stripe.confirmPayment ERROR");
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      console.log(" stripe.confirmPayment SUCCESS");
    }

  };


//PaymentRequestButtonElement

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
