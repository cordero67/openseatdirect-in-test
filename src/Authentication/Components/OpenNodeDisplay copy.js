import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import RadioForm from "../../components/Forms/RadioForm";
import { API, OPENNODE_USE_TEST } from "../../config";

import classes from "./Components.module.css";

const OpenNodeDisplay = (props) => {
  console.log("props: ", props);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [subValues, setSubValues] = useState({
    opennode_invoice_API_KEY: "", // vendors opennode api key
    opennode_auto_settle: "", // vendors request convesion to USD or keep in BTC?
    opennode_dev: "", // Boolean: dev=true for testnet BTC\
  });

  const handleSubValueChange = (event) => {
    setSubValues({
      ...subValues,
      [event.target.name]: event.target.value,
    });
  };

  const radioChangeSubValues = (event, value, name) => {
    let tempSubValues = { ...subValues };
    tempSubValues[name] = value.value;
    setSubValues(tempSubValues);
  };

  const initializeSubValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("user" in tempUser && "accountId" in tempUser.user) {
        let tempSubValues = {};
        if (tempUser.user.accountId?.opennode_invoice_API_KEY) {
          tempSubValues.opennode_invoice_API_KEY =
            tempUser.user.accountId.opennode_invoice_API_KEY;
        } else {
          tempSubValues.opennode_invoice_API_KEY = "";
        }

        if (tempUser.user.accountId?.opennode_auto_settle === undefined) {
          tempSubValues.opennode_auto_settle = true;
        } else {
          tempSubValues.opennode_auto_settle =
            tempUser.user.accountId?.opennode_auto_settle;
        }

        if (tempUser.user.accountId?.opennode_dev === undefined) {
          tempSubValues.opennode_dev = false;
        } else {
          tempSubValues.opennode_dev = tempUser.user.accountId?.opennode_dev;
        }

        setSubValues(tempSubValues);
        console.log("tempBuyerInfo: ", tempSubValues);
      }
    } else {
      console.log("no user object");
    }
  };

  useEffect(() => {
    initializeSubValues();
  }, []);

  // OSDFREE promo code plans
  const settleOptions = [
    {
      label: "Fiat (e.g. US Dollar)",
      value: true,
    },
    {
      label: "Bitcoin",
      value: false,
    },
  ];

  // OSDFREE promo code plans
  const blockchainOptions = [
    {
      label: "Dev / Testnet",
      value: true,
    },
    {
      label: "Live / Mainnet",
      value: false,
    },
  ];

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const handleOpenNode = (data) => {
    if (data.status) {
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.accountId = data.result;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      let errmsg =
        "unable to validate OpenNode API Key and secret at this time";
      if (data.message) {
        errmsg = data.message;
      }
      setSubmissionStatus({
        message: errmsg,
        error: true,
      });
      props.spinnerChange(false);
    }
  };

  const submitOpenNode = () => {
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
        paymentGatewayType2: "OpenNode",
        opennode_invoice_API_KEY: subValues.opennode_invoice_API_KEY,
        opennode_auto_settle: subValues.opennode_auto_settle,
        opennode_dev: subValues.opennode_dev,
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
        console.log("fetch return got back data on OpenNode:", data);
        handleOpenNode(data);
      })
      .catch((error) => {
        console.log("error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const buttonText = () => {
    if (props.initial === "upgrade") {
      return "Upgrade later";
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

  const openNodeForm = () => {
    let disabled = true;
    if (subValues.opennode_invoice_API_KEY) {
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
        <div style={{ fontSize: "15px", paddingBottom: "20px" }}>
          <div className={classes.Header}>Enter OpenNode Details</div>
          {errorText()}
          <div>
            Don't have an OpenNode account?
            <div style={{ paddingLeft: "20px" }}>
              <a
                className={classes.BlueText}
                href="https://app.opennode.com/signup"
                target="_blank"
                rel="noreferrer"
              >
                Create an OpenNode account
              </a>
              <a
                className={classes.BlueText}
                href="https://drive.google.com/file/d/1-Qs_Gl4U3WdyIvlkMMH-Fv4Bld9qU1yE/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Additional instructions
              </a>
            </div>
          </div>
          <label style={{ width: "200px", fontSize: "15px", margin: "0px" }}>
            <br></br>
            OpenNode API key
            <span style={{ color: "red" }}>* </span>
          </label>
          <div style={{ paddingLeft: "20px" }}>
            <a
              className={classes.BlueText}
              href="https://app.opennode.com/developers/integrations"
              target="_blank"
              rel="noreferrer"
            >
              Extract OpenNode API Key
            </a>
            <a
              className={classes.BlueText}
              href="https://drive.google.com/file/d/1-_L8b43VtDNsJo2YJ-dy9dxBYYyoT7LO/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Additional instructions
            </a>
          </div>
          <input
            onFocus={() => {
              setSubmissionStatus({ message: "", error: false });
            }}
            className={classes.InputBox}
            type="text"
            name="opennode_invoice_API_KEY"
            onChange={handleSubValueChange}
            value={subValues.opennode_invoice_API_KEY}
          />
        </div>
        <div style={{ paddingBottom: "20px" }}>
          <div style={{ fontSize: "15px" }}>
            Settlement Currency:
            <div style={{ paddingLeft: "20px" }}>
              <a
                className={classes.BlueText}
                href="https://developers.opennode.com/reference/create-charge"
                target="_blank"
                rel="noreferrer"
              >
                Edit "auto_settle" field
              </a>
              <br></br>
              <a
                className={classes.BlueText}
                href="https://drive.google.com/file/d/1-L6BdibR3RgtwZ__hPQLbZtSangEW9ZA/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Additional instructions
              </a>
            </div>
          </div>
          <RadioForm
            details={settleOptions}
            group="settleOptioneGroup"
            current={subValues.opennode_auto_settle}
            change={(event, value) => {
              radioChangeSubValues(event, value, "opennode_auto_settle");
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: "15px" }}>
            Bitcoin Blockchain:
            <div style={{ paddingLeft: "20px" }}>
              <a
                className={classes.BlueText}
                href="https://dev.opennode.com/login"
                target="_blank"
                rel="noreferrer"
              >
                Create a development OpenNode account
              </a>
              <br></br>
              <a
                className={classes.BlueText}
                //href="https://drive.google.com/file/d/1ozk3BKzLwLEpzQJCqX7FwAIF0897im0H/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Additional instructions
              </a>
            </div>
          </div>
          <RadioForm
            details={blockchainOptions}
            group="blockchainOptionGroup"
            current={subValues.opennode_dev}
            change={(event, value) => {
              radioChangeSubValues(event, value, "opennode_dev");
            }}
          />
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitOpenNode();
              }
            }}
          >
            Submit OpenNode details
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
              console.log("CLOSING");
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
      style = { paddingTop: "40px", height: "798px" };
    } else {
      style = { paddingTop: "40px", height: "679px" };
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
        <div className={classes.BlankCanvas}>{openNodeForm()}</div>
      </Fragment>
    );
  }
};

export default OpenNodeDisplay;
