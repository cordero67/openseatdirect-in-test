import React, { useState } from "react";

import { API } from "../config.js";
import { useOurApi } from "../utils/useOurApi";

const CheckoutOpennode = (props) => {
  // expect to get from props
  //    let event = JSON.parse(localStorage.getItem("eventNum"));
  //    let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
  //    let tempUser = JSON.parse(localStorage.getItem("user"));
  //    const  isSignedUser = tempUser !=null;
  //    const isGuest = "guestInfo" in tempCart && ! isSignedUser;

  //    const [stripePromise, setStripePromise] = useState();

  const [onodeError, setOnodeError] = useState(null);

  const event = props?.event
    ? props.event
    : JSON.parse(localStorage.getItem("eventNum"));
  const tempCart = props?.cart
    ? props.cart
    : JSON.parse(localStorage.getItem(`cart_${event}`));
  const tempUser = props?.user
    ? props.user
    : JSON.parse(localStorage.getItem("user"));
  const isGuest =
    "boolean" == typeof props?.isGuest
      ? props.isGuest
      : "guestInfo" in tempCart;

  if (!event || !tempCart) window.location.href = "/events"; // go to events if missing vars
  if (!tempUser && !isGuest)
    window.location.href = `/et/${tempCart.eventDetails.vanityLink}?eventID=${tempCart.eventDetails.eventNum}`;

  const email = isGuest ? tempCart?.guestInfo?.email : tempUser?.user?.email;

  let name = "";
  if (isGuest) {
    name = `${tempCart?.guestInfo?.firstname} ${tempCart?.guestInfo?.email?.lastname}`;
  } else if (tempUser?.user?.firstname && tempUser?.user?.lastname) {
    name = `${tempUser?.user?.firstname} ${tempUser?.user?.lastname}`;
  } else if (tempUser?.user?.lastname) {
    name = `${tempUser.user.lastname}`;
  } else if (tempUser?.user?.firstname) {
    name = `${tempUser.user.firstname} ${tempUser.user.lastname}`;
  }

  const eventDetails = tempCart.eventDetails;

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

  let url = isGuest
    ? `${API}/tixorder/opennode/us-create-order`
    : `${API}/tixorder/opennode/sn-create-order`;

  if (isGuest) {
    body.guestFirstname = tempCart.guestInfo.firstname;
    body.guestLastname = tempCart.guestInfo.lastname;
    body.guestEmail = tempCart.guestInfo.email;
  } else {
    myHeaders.append("Authorization", `Bearer ${tempUser.token}`);
  }
  const method = "POST";
  const initialData = { status: true, message: "hi first time " };
  console.log("url=", url, "body=", body);

  const { isLoading, hasError, setUrl, setBody, data, networkError } =
    useOurApi(method, url, myHeaders, body, initialData);

  if (isLoading) {
    return <div>IS LOADING ...</div>;
  } else if (hasError) {
    return <div>HAS OUR API ERROR!!!! ...</div>;
  } else if (onodeError) {
    console.log("onennodeError=", onodeError);
    return <div>HAS OPENNODE ERROR!!!! ...</div>;
  } else {
    if (data?.success) {
      window.location.href = data.redirect_url;
      return <div>redirecting to Opennode ...</div>;
    } else {
      console.log("Something went wrong");
      return <div>Something went wrong. try again</div>;
    }
  }
};

export default CheckoutOpennode;
