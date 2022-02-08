import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { API } from "../config.js";

import CheckoutForm from "./CheckoutForm";

const Checkout = () => {
  const [displayMain, setDisplayMain] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const stripePromise = loadStripe(
    "pk_test_51KBGMiKV3J6hQOi9xhDbtPjijhRW3oYceglEjVqR55feZPvWvXmI6PO0IAdHxuo0mFs1GUoCHEccdhGfBSiT7N8p00D6vYffDH",
    {
      //stripeAccount: "acct_1KL9zDQPj5AjBgFw",
      stripeAccount: "acct_1KNPhm4DwDsj7HXk",
    }
  );

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
        setDisplayMain(true);
      });
  }, []);

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

  const options = {
    // passing the client secret obtained in step 2
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    appearance: {
      appearance,
    },
  };

  if (displayMain) {
    return (
      <div>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    );
  } else return null;
};

export default Checkout;
