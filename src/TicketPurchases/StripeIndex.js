import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { API } from "../config.js";

import CheckoutForm from "./CheckoutForm";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51KBGMiKV3J6hQOi9xhDbtPjijhRW3oYceglEjVqR55feZPvWvXmI6PO0IAdHxuo0mFs1GUoCHEccdhGfBSiT7N8p00D6vYffDH",
  {
    //stripeAccount: "acct_1KL9zDQPj5AjBgFw",

    stripeAccount: "acct_1KNPhm4DwDsj7HXk",
  }
);

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");

  // LOOKS GOOD
  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  useEffect(() => {
    console.log("Inside useEffect");
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = {
      guestFirstname: "Rafael",
      guestLastname: "Cordero",
      guestEmail: "rafael.h.cordero@gmail.com",
      totalAmount: 40,
      eventNum: 1461985635,
      userPromo: "string",
      tickets: [
        {
          ticketID: "61f6d01de9057df9b9832908",
          ticketsSelected: 2,
        },
      ],
    };

    let url = `${API}/tixorder/stripe/us-create-order`;
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

        //setOrderStatus(data.status);
        //setDisplay("confirmation");
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        //setDisplay("connection");
      })
      .finally(() => {
        //purchaseConfirmHandler();
      });
  }, []);

  return (
    <div>
      STRIPE INDEX COMPONENT
      <Elements stripe={stripePromise}>
        <br></br>
        <br></br>
        <br></br>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};
export default Checkout;
