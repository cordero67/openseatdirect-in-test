import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import RadioForm from "../../components/Forms/RadioForm";
import { API, OPENNODE_USE_TEST } from "../../config";

import classes from "./Components.module.css";

const OpennodeDisplay = (props) => {
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

  const handleOpennode = (data) => {
    if (data.status) {
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.accountId = data.result;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      let errmsg =
        "unable to validate Opennode API Key and secret at this time";
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

  const submitOpennode = () => {
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
        paymentGatewayType2: "Opennode",
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
        console.log("fetch return got back data on Opennode:", data);
        handleOpennode(data);
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
              Back to Gateway Selection
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

  const opennodeForm = () => {
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
          <div>
            Setup a new Opennode account{" "}
            <a
              className={classes.BlueText}
              href="https://app.opennode.com/signup"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              here
            </a>
          </div>
          <label style={{ width: "200px", fontSize: "15px" }}>
            <br></br>
            Opennode API key
            <span style={{ color: "red" }}>* </span>
          </label>
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
            Settlement Currency: (see auto_settle field{" "}
            <a
              className={classes.BlueText}
              href="https://developers.opennode.com/reference/create-charge"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            )
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
            Bitcoin Blockchain: (try dev setup{" "}
            <a
              className={classes.BlueText}
              href="https://dev.opennode.com/"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            )
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
                submitOpennode();
              }
            }}
          >
            Submit Opennode Details
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

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.HeaderModal}>
          <div>Enter Opennode Details</div>
          <div style={{ textAlign: "right" }}>
            <ion-icon
              className={classes.CloseIcon}
              name="close-outline"
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
          </div>
        </div>
      );
    } else {
      return <div className={classes.Header}>Enter Opennode Details</div>;
    }
  };

  if (props.spinner) {
    let height;
    if (props.authOrigin) {
      height = { height: "591px" };
    } else {
      height = { height: "471px" };
    }
    return (
      <div className={classes.BlankCanvas} style={height}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {errorText()}
          {opennodeForm()}
        </div>
      </div>
    );
  }
};

export default OpennodeDisplay;
