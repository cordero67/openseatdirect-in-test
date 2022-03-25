import React, { Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import RadioForm from "../../components/Forms/RadioForm";
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

  const paypalForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "340px" }}>
        <label style={{ width: "340px", fontSize: "15px" }}>
          Paypal Client ID <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            ////setSubValues({ ...subValues, inputError: "" });
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
            ////setSubValues({ ...subValues, inputError: "" });
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
            //submitPaypal();

            console.log("Inside submitPaypal");
            //setDisplay("spinner");
            props.spinnerChange(true);
            props.submission({ message: "", error: false });

            // api static variables
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const authstring = `Bearer ${props.sessionToken}`;
            myHeaders.append("Authorization", authstring);

            let url = `${API}/accounts/${props.accountNum}`;
            let fetcharg = {
              method: "POST",
              headers: myHeaders,
              body: JSON.stringify({
                ////useSandbox: PAYPAL_USE_SANDBOX,
                paymentGatewayType: "PayPalExpress",
                ////paypalExpress_client_id: paypalExpress_client_id,
                ////paypalExpress_client_secret: paypalExpress_client_secret,
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
                //handleConfirmation
                if (data.status) {
                  console.log("INSIDE data.status");
                  let tempData = JSON.parse(localStorage.getItem("user"));
                  console.log("tempData: ", tempData);
                  tempData.user.accountId = data.result;
                  localStorage.setItem("user", JSON.stringify(tempData));
                  //updatePageView();
                  props.submit();
                } else {
                  // this is a friendly error
                  let errmsg =
                    "unable to validate ClientId and secret at this time";
                  if (data.message) {
                    console.log("data.message exist");
                    console.log("data.message ", data.message);
                    errmsg = data.message;
                  }
                  console.log("errmsg: ", errmsg);
                  props.submission({ message: errmsg, error: true });
                  props.displayChange("error");
                }
              })
              .catch((err) => {
                console.log(err);

                props.submission({
                  message: "Server down please try again",
                  error: true,
                });
                props.displayChange("error");
              })
              .finally(() => {
                props.spinnerChange(false);
              });
          }}
        >
          Submit Paypal details
        </button>
      </div>
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            props.displayChange("gateway");
          }}
        >
          Back to Payment Processor selection
        </button>
      </div>
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            ////redirectUser();
          }}
        >
          Stay with Free Forever Plan
        </button>
      </div>
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
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Can't find the Client ID and Secret?
          <div style={{ paddingLeft: "20px" }}>
            <a
              href="https://developer.paypal.com/developer/applications/"
              target="_blank"
              rel="noreferrer"
            >
              PayPal Dashboard
            </a>
          </div>
          <div style={{ paddingLeft: "20px" }}>
            <a
              href="https://drive.google.com/file/d/1ozk3BKzLwLEpzQJCqX7FwAIF0897im0H/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Additional instructions
            </a>
          </div>
          <div style={{ paddingLeft: "20px" }}>
            <a
              href="https://www.youtube.com/watch?v=gXAsubSL-1I"
              target="_blank"
              rel="noreferrer"
            >
              Instructional video
            </a>
          </div>
        </div>
      );
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "500px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        <div className={classes.Header}>Enter PayPal account info.</div>
        <div>
          {showError()}
          {paypalForm}
        </div>
      </div>
    );
  }
};
