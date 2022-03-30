import React, { Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import classes from "../Authentication.module.css";

const PaypalDisplay = (props) => {
  console.log("props: ", props);

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const handlePaypal = (data) => {
    console.log("data: ", data);
    if (data.status) {
      console.log("INSIDE data.status");
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.accountId = data.result;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      let errmsg = "unable to validate ClientId and secret at this time";
      if (data.message) {
        console.log("data.message exist");
        console.log("data.message ", data.message);
        errmsg = data.message;
      }
      console.log("errmsg: ", errmsg);
      props.submission({
        message: errmsg,
        error: true,
        redirect: "",
      });
      props.spinnerChange(false);
    }
  };

  const submitPaypal = () => {
    props.spinnerChange(true);
    props.submission({ message: "", error: false, redirect: "" });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const authstring = `Bearer ${props.sessionToken}`;
    myHeaders.append("Authorization", authstring);
    let url = `${API}/accounts/${props.accountNum}`;
    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        useSandbox: props.sandbox,
        paymentGatewayType: "PayPalExpress",
        paypalExpress_client_id: props.client,
        paypalExpress_client_secret: props.secret,
      }),
    };
    console.log("fetching with: ", url, fetcharg);
    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data on PayPal:", data);
        handlePaypal(data);
      })
      .catch((err) => {
        console.log(err);
        props.submission({
          message: "Server down please try again",
          error: true,
          redirect: "paypal",
        });
        props.displayChange("error");
        props.spinnerChange(false);
      });
  };

  const displayButtons = () => {
    if (props.authOrigin) {
      return (
        <Fragment>
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                props.displayChange("gateway");
                props.submission({ message: "", error: false, redirect: "" });
              }}
            >
              BACK TO GATEWAY SELECTION
            </button>
          </div>
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                if (props.initial === "upgrade") {
                  window.close();
                } else {
                  props.redirect();
                }
              }}
            >
              STAY WITH FREE FOREVER PLAN
            </button>
          </div>
        </Fragment>
      );
    } else return null;
  };

  const paypalForm = (
    <Fragment>
      <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
        Can't find the Client ID and Secret?
        <div style={{ paddingLeft: "20px" }}>
          <a
            style={{ fontWeight: "600", color: "blue" }}
            href="https://developer.paypal.com/developer/applications/"
            target="_blank"
            rel="noreferrer"
          >
            PayPal Dashboard
          </a>
        </div>
        <div style={{ paddingLeft: "20px" }}>
          <a
            style={{ fontWeight: "600", color: "blue" }}
            href="https://drive.google.com/file/d/1ozk3BKzLwLEpzQJCqX7FwAIF0897im0H/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            Additional instructions
          </a>
        </div>
        <div style={{ paddingLeft: "20px" }}>
          <a
            style={{ fontWeight: "600", color: "blue" }}
            href="https://www.youtube.com/watch?v=gXAsubSL-1I"
            target="_blank"
            rel="noreferrer"
          >
            Instructional video
          </a>
        </div>
      </div>

      <div style={{ paddingBottom: "20px", width: "340px" }}>
        <label style={{ width: "340px", fontSize: "15px" }}>
          Paypal Client ID <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            props.submission({ message: "", error: false, redirect: "" });
          }}
          className={classes.InputBox}
          type="text"
          name="paypalExpress_client_id"
          onChange={props.inputChange}
          value={props.client}
        />
      </div>
      <div>
        <label style={{ fontSize: "15px" }}>
          Paypal Secret <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            props.submission({ message: "", error: false, redirect: "" });
          }}
          className={classes.InputBox}
          type="text"
          name="paypalExpress_client_secret"
          onChange={props.inputChange}
          value={props.secret}
        />
      </div>
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <button
          className={classes.ButtonBlue}
          disabled={!props.client || !props.secret}
          onClick={() => {
            console.log("CLICKED SUBMIT");
            submitPaypal();
          }}
        >
          SUBMIT YOUR PAYPAL DETAILS
        </button>
      </div>
      {displayButtons()}
    </Fragment>
  );

  const showError = () => {
    if (props.error) {
      return (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            lineHeight: "25px",
            paddingBottom: "20px",
          }}
        >
          {props.message}
        </div>
      );
    } else {
      return null;
    }
  };

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.Header}>
          <div>Enter Paypal Information</div>
          <div style={{ textAlign: "right" }}>
            <ion-icon
              style={{
                fontWeight: "600",
                fontSize: "28px",
                color: "black",
                paddingBottom: "5px",
              }}
              name="close-outline"
              cursor="pointer"
              onClick={() => {
                props.close();
              }}
            />
          </div>
        </div>
      );
    } else {
      return <div className={classes.Header}>Enter Paypal Information</div>;
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "595px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {showError()}
          {paypalForm}
        </div>
      </div>
    );
  }
};

export default PaypalDisplay;
