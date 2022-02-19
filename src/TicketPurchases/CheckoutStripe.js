import React, { useState, useEffect} from "react";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutForm from './CheckoutForm';
import StripeModal from "./Modals/StripeModal";

import { API, OSD_STRIPE_ACCOUNT_ID } from "../config.js";
import { useOurApi } from "../Users/useOurApi";

const Checkout =(props)=>{

// expect to get from props
//    let event = JSON.parse(localStorage.getItem("eventNum"));
//    let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
//    let tempUser = JSON.parse(localStorage.getItem("user"));
//    const  isSignedUser = tempUser !=null;
//    const isGuest = "guestInfo" in tempCart && ! isSignedUser;

//    const [stripePromise, setStripePromise] = useState();

  const [stripeUserError, setStripeUserError] = useState(null);

    const event     = props?.event ? props.event: JSON.parse(localStorage.getItem("eventNum"));
    const tempCart  = props?.cart ?  props.cart : JSON.parse(localStorage.getItem(`cart_${event}`));
    const tempUser  = props?.user ?  props.user : JSON.parse(localStorage.getItem("user"));
    const isGuest   =  ('boolean' == typeof props?.isGuest) ? props.isGuest: "guestInfo" in tempCart;

    if (!event || !tempCart) window.location.href ="/events";    // go to events of missing vars
    if (!tempUser && !isGuest ) window.location.href = `/et/${tempCart.eventDetails.vanityLink}?eventID=${tempCart.eventDetails.eventNum}`;

    
    const  email = isGuest ? tempCart?.guestInfo?.email : tempUser?.user?.email;

    let name = "";    
    if (isGuest ){
        name =`${tempCart?.guestInfo?.firstname} ${tempCart?.guestInfo?.email?.lastname}`
    } else if (tempUser?.user?.firstname && tempUser?.user?.lastname){
        name = `${tempUser?.user?.firstname} ${tempUser?.user?.lastname}`
    } else if (tempUser?.user?.lastname){
        name = `${tempUser.user.lastname}`
    } else if (tempUser?.user?.firstname){
        name = `${tempUser.user.firstname} ${tempUser.user.lastname}`
    };

    const eventDetails = tempCart.eventDetails;


//    useEffect(
//        ()=>{
//            console.log ("loading stripe");           
//            setStripePromise (loadStripe(
 //           OSD_STRIPE_ACCOUNT_ID, {stripeAccount: stripeAccount}))
//        }, 
 //       [stripeAccount]
 //           );

    const stripePromise = loadStripe(`${OSD_STRIPE_ACCOUNT_ID}`, {
              stripeAccount: eventDetails.stripeAccountID})

    console.log ("stripePromise=",  stripePromise);


///
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
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
  let body = {
      totalAmount: tempCart.orderTotals.finalPurchaseAmount,
      eventNum: tempCart.eventDetails.eventNum,
      tickets: tickets,
    };

    if (tempCart?.promoCodeDetails?.appliedPromoCode !== "") {
      body.userPromo = tempCart.promoCodeDetails.appliedPromoCode;
    }

    let url = isGuest ? `${API}/tixorder/stripe/us-create-order` : `${API}/tixorder/stripe/sn-create-order`;

    if (isGuest) {
      body.guestFirstname = tempCart.guestInfo.firstname;
      body.guestLastname = tempCart.guestInfo.lastname;
      body.guestEmail = tempCart.guestInfo.email;
    } else {
      myHeaders.append("Authorization", `Bearer ${tempUser.token}`);
    }
    const method = "POST"
    const initialData = { status: true, message: "hi first time " };
    console.log ("url=", url);

    const { isLoading, hasError, setUrl, setBody, data, networkError } =
          useOurApi(method, url, myHeaders, body, initialData);


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


 
  if (isLoading) {
      return (
        <div >
          IS LOADING ...
       </div>
      )
  } else if (hasError) {
      return (
        <div >
          HAS ERROR!!!! ...
       </div>
      )
  } else if (stripeUserError){
      return (
        <StripeModal
          show={true}
          details={stripeUserError?.message}
          closeModal={() => {
            setStripeUserError(false);
          }}
        ></StripeModal>
      )
  } else if (!data.client_secret){
     return (
        <div >
          HAS ERROR!!!! ... Problem with client_secret. 
       </div>
      )
  } else {
    return (
        <div>
            Stripe Checkout
            <Elements 
                stripe={stripePromise} 
                options={{
                    clientSecret: data.client_secret,
                    // Fully customizable with appearance API.
                    appearance: {appearance}
                }}>
                <CheckoutForm 
                    name={name}
                    email={email}
                    onStripeUserError={setStripeUserError}
                    />
            </Elements>
        </div>
    )
  };

}

export default Checkout;
