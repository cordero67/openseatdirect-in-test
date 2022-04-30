import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API, PAYPAL_USE_SANDBOX } from "../../config";

import classes from "./Components.module.css";

const PaypalDisplay = (props) => {
  console.log("props: ", props);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [subValues, setSubValues] = useState({
    paypalExpress_client_id: "", // vendor's clientID not OSD's
    paypalExpress_client_secret: "", // vendor's secret not OSD's
  });

  const handleSubValueChange = (event) => {
    setSubValues({
      ...subValues,
      [event.target.name]: event.target.value,
    });
  };

  const initializeSubValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("user" in tempUser && "accountId" in tempUser.user) {
        let tempSubValues = {};
        if (tempUser.user.accountId?.paypalExpress_client_id) {
          tempSubValues.paypalExpress_client_id =
            tempUser.user.accountId.paypalExpress_client_id;
        } else {
          tempSubValues.paypalExpress_client_id = "";
        }
        if (tempUser.user.accountId?.paypalExpress_client_secret) {
          tempSubValues.paypalExpress_client_secret =
            tempUser.user.accountId.paypalExpress_client_secret;
        } else {
          tempSubValues.paypalExpress_client_id = "";
        }
        setSubValues(tempSubValues);
        console.log("tempSubValues: ", tempSubValues);
      }
    } else {
      console.log("no user object");
    }
  };

  useEffect(() => {
    initializeSubValues();
  }, []);

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const handlePaypal = (data) => {
    if (data.status) {
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.accountId = data.result;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      let errmsg = "unable to validate ClientId and secret at this time";
      if (data.message) {
        console.log("data.message ", data.message);
        errmsg = data.message;
      }
      console.log("errmsg: ", errmsg);
      setSubmissionStatus({
        message: errmsg,
        error: true,
      });
      props.spinnerChange(false);
    }
  };

  const submitPaypal = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const authstring = `Bearer ${props.sessionToken}`;
    myHeaders.append("Authorization", authstring);
    let url = `${API}/accounts/${props.accountNum}`;
    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        useSandbox: PAYPAL_USE_SANDBOX,
        paymentGatewayType: "PayPalExpress",
        paypalExpress_client_id: subValues.paypalExpress_client_id,
        paypalExpress_client_secret: subValues.paypalExpress_client_secret,
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

  const displayButtons = () => {
    if (props.authOrigin) {
      return (
        <Fragment>
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                initializeSubValues();
                props.displayChange("gateway");
                setSubmissionStatus({
                  message: "",
                  error: false,
                });
              }}
            >
              Back to gateway selection
            </button>
          </div>
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                initializeSubValues();
                if (props.initial === "upgrade") {
                  window.close();
                } else {
                  props.redirect();
                }
              }}
            >
              {buttonText()}
            </button>
          </div>
        </Fragment>
      );
    } else return null;
  };

  const paypalForm = () => {
    let disabled = true;
    if (
      subValues.paypalExpress_client_id &&
      subValues.paypalExpress_client_secret
    ) {
      disabled = false;
    }
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.ButtonBlue;
    }
    return (
      <Fragment>
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          <div className={classes.Header}>Enter Paypal Details</div>
          {errorText()}
          Can't find the Client ID and Secret?
          <div style={{ paddingLeft: "20px" }}>
            <a
              className={classes.BlueText}
              href="https://developer.paypal.com/developer/applications/"
              target="_blank"
              rel="noreferrer"
            >
              PayPal Dashboard
            </a>
          </div>
          <div style={{ paddingLeft: "20px" }}>
            <a
              className={classes.BlueText}
              href="https://drive.google.com/file/d/1ozk3BKzLwLEpzQJCqX7FwAIF0897im0H/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Additional instructions
            </a>
          </div>
          <div style={{ paddingLeft: "20px" }}>
            <a
              className={classes.BlueText}
              href="https://www.youtube.com/watch?v=gXAsubSL-1I"
              target="_blank"
              rel="noreferrer"
            >
              Instructional video
            </a>
          </div>
        </div>

        <div style={{ paddingBottom: "20px" }}>
          <label style={{ fontSize: "15px" }}>
            Paypal Client ID <span style={{ color: "red" }}>* </span>
          </label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            type="text"
            name="paypalExpress_client_id"
            onChange={handleSubValueChange}
            value={subValues.paypalExpress_client_id}
          />
        </div>
        <div>
          <label style={{ fontSize: "15px" }}>
            Paypal Secret <span style={{ color: "red" }}>* </span>
          </label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            type="text"
            name="paypalExpress_client_secret"
            onChange={handleSubValueChange}
            value={subValues.paypalExpress_client_secret}
          />
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitPaypal();
              }
            }}
          >
            Submit Paypal Details
          </button>
        </div>
        {displayButtons()}
      </Fragment>
    );
  };

  const errorText = () => {
    if (error) {
      return <div className={classes.ErrorText}>{message}</div>;
    } else {
      return null;
    }
  };

  const closeIcon = () => {
    return (
      <div className={classes.CloseIcon}>
        {props.authOrigin !== true ? (
          <ion-icon
            name="close-circle-outline"
            cursor="pointer"
            onClick={() => {
              initializeSubValues();
              setSubmissionStatus({
                message: "",
                error: false,
              });
              props.close();
            }}
          />
        ) : null}
      </div>
    );
  };

  if (props.spinner) {
    let style;
    if (props.authOrigin) {
      style = { paddingTop: "40px", height: "494px" };
    } else {
      style = { paddingTop: "40px", height: "427px" };
    }

    return (
      <div style={style}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <Fragment>
        {closeIcon()}
        <div className={classes.BlankCanvas}>{paypalForm()}</div>
      </Fragment>
    );
  }
};

export default PaypalDisplay;
