import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

//import "./Styles.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "red",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CardSection() {
  return (
    <label>
      <div style={{ width: "600px" }}>
        CARD SECTION COMPONENT
        <br></br>
        <br></br>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
    </label>
  );
}
export default CardSection;
