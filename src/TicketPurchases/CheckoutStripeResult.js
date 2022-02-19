
//import React, { useState, useEffect, Fragment } from "react";

import queryString from "query-string";
import StripeModal from "./Modals/StripeModal";

//https://app.bondirectly.com/checkout-stripe-result?result=success
//&payment_intent=pi_3KUgnQ4DwDsj7HXk0xCnm26J
//&payment_intent_client_secret=pi_3KUgnQ4DwDsj7HXk0xCnm26J_secret_WIL78izxMxDp2Mq9y91jpLLkD
//&redirect_status=succeeded

const CheckoutStripeResult =()=>{

    const event     = JSON.parse(localStorage.getItem("eventNum"));

    console.log("event=" , event);

    let result = queryString.parse(window.location.search).result;
//stripe appends these fields ..

    let payment_intent= queryString.parse(window.location.search).payment_intent;
    let payment_intent_client_secret =queryString.parse(window.location.search).payment_intent_client_secret;
    let redirect_status = queryString.parse(window.location.search).redirect_status;

    console.log ("CheckoutStripeResult=", result);
    console.log (payment_intent,payment_intent_client_secret,redirect_status );
    alert (result);

  return (
        <StripeModal
          show={true}
          details={event}
          closeModal={() => {
//            let tempStripeModal = { ...stripeModal };
//            tempStripeModal.display = false;
//            setStripeModal(tempStripeModal);
          }}
        ></StripeModal>
      );


}


export default CheckoutStripeResult;

