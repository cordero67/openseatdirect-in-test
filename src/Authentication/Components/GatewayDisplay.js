import React, { useState, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import stripeImg from "../../assets/Stripe/Stripe wordmark - blurple (small).png";
import payPalImg from "../../assets/PayPal/PayPal.PNG";
import opennodeImg from "../../assets/Opennode/opennodeBtc.png";

import classes from "./Components.module.css";

const GatewayDisplay = (props) => {
  console.log("props: ", props);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitStripe = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${props.sessionToken}`);
    console.log("myHeaders: ", myHeaders);
    let url = `${API}/accounts/${props.accountNum}/subscription/stripe/onboard1-genlink`;
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("fetching with: ", url, fetchBody);

    fetch(url, fetchBody)
      .then(handleErrors)
      .then((res) => res.json())
      .then((response) => {
        console.log("made it inside the .then");
        window.location.href = response.url;
      })
      .catch((error) => {
        console.log("error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const buttonText = () => {
    if (props.initial === "upgrade") {
      return "Upgrade Later";
    } else {
      return "Stay with Free Forever Plan";
    }
  };

  const errorText = () => {
    if (error) {
      return <div className={classes.ErrorText}>{message}</div>;
    } else {
      return null;
    }
  };

  const topDisplay = (
    <div
      style={{
        fontSize: "16px",
        liineHeight: "25px",
        paddingBottom: "20px",
      }}
    >
      Link to Stripe or Paypal to get paid instantly in cash, or Opennode for
      bitcoin payments.
    </div>
  );

  const gatewayForm = (
    <Fragment>
      <div className={classes.Header}>How to Get Paid Instantly.</div>
      {errorText()}
      {topDisplay}
      <div className={classes.ImageGrid}>
        <button className={classes.GatewayImage}>
          <img
            src={stripeImg}
            alt="STRIPE"
            width="100%"
            height="auto"
            cursor="pointer"
            onClick={() => {
              console.log("selecting Stripe");
              submitStripe();
            }}
          ></img>
        </button>
        <button className={classes.GatewayImage}>
          <img
            src={payPalImg}
            alt="PAYPAL"
            width="100%"
            height="auto"
            cursor="pointer"
            onClick={() => {
              console.log("selecting PayPal");
              props.displayChange("paypal");
            }}
          ></img>
        </button>
      </div>
      <div className={classes.ImageBox}>
        <button className={classes.GatewayImage}>
          <img
            src={opennodeImg}
            alt="OPENNODE"
            width="100%"
            height="auto"
            cursor="pointer"
            onClick={() => {
              console.log("selecting Opennode");
              props.displayChange("opennode");
            }}
          ></img>
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            console.log("props.initial: ", props.initial);
            if (props.initial === "upgrade") {
              window.close();
            } else {
              props.submit();
            }
          }}
        >
          {buttonText()}
        </button>
      </div>
    </Fragment>
  );

  const closeIcon = () => {
    return (
      <div className={classes.CloseIcon}>
        {props.authOrigin !== true ? (
          <ion-icon
            name="close-circle-outline"
            cursor="pointer"
            onClick={() => {
              props.close();
            }}
          />
        ) : null}
      </div>
    );
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "500px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <Fragment>
        {closeIcon()}
        <div className={classes.BlankCanvas}>{gatewayForm}</div>
      </Fragment>
    );
  }
};

export default GatewayDisplay;
