import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import classes from "./Components.module.css";

const PersonalDisplay = (props) => {
  console.log("props: ", props);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [subValues, setSubValues] = useState({
    firstName: "",
    lastName: "",
    userName: "",
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
        if (tempUser.user.firstname) {
          tempSubValues.firstName = tempUser.user.firstname;
        } else {
          tempSubValues.firstName = "";
        }
        if (tempUser.user.lastname) {
          tempSubValues.lastName = tempUser.user.lastname;
        } else {
          tempSubValues.lastName = "";
        }
        if (tempUser.user.username) {
          tempSubValues.userName = tempUser.user.username;
        } else {
          tempSubValues.userName = "";
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

  const handlePersonal = (data) => {
    if (data.status) {
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.accountId = data.result;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      console.log("errmsg: ", data.message);
      setSubmissionStatus({
        message: data.message,
        error: true,
      });
      props.spinnerChange(false);
    }
  };

  const submitPersonal = () => {
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
        //useSandbox: PAYPAL_USE_SANDBOX,
        //paymentGatewayType: "PayPalExpress",
        //paypalExpress_client_id: subValues.paypalExpress_client_id,
        //paypalExpress_client_secret: subValues.paypalExpress_client_secret,
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
        handlePersonal(data);
      })
      .catch((error) => {
        console.log("error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const buttonText = () => {
    if (props.initial === "upgrade") {
      return "UPGRADE LATER";
    } else {
      return "STAY WITH FREE FOREVER PLAN";
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
              BACK TO GATEWAY SELECTION
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

  const personalForm = () => {
    let disabled = true;
    if (true) {
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
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <label style={{ width: "340px", fontSize: "15px" }}>
            First Name <span style={{ color: "red" }}>* </span>
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
            name="firstName"
            onChange={handleSubValueChange}
            value={subValues.firstName}
          />
        </div>
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <label style={{ width: "340px", fontSize: "15px" }}>
            Last Name <span style={{ color: "red" }}>* </span>
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
            name="lastName"
            onChange={handleSubValueChange}
            value={subValues.lastName}
          />
        </div>
        <div>
          <label style={{ fontSize: "15px" }}>
            User Name <span style={{ color: "red" }}>* </span>
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
            name="userName"
            onChange={handleSubValueChange}
            value={subValues.userName}
          />
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            style={{ fontSize: "18px" }}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitPersonal();
              }
            }}
          >
            Submit Your Information
          </button>
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            style={{ fontSize: "16px" }}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitPersonal();
              }
            }}
          >
            SUBMIT YOUR INFORMATION
          </button>
        </div>
        <div style={{ textAlign: "right", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            style={{ fontSize: "18px" }}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitPersonal();
              }
            }}
          >
            SUBMIT YOUR INFORMATION
          </button>
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            style={{ fontSize: "20px" }}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitPersonal();
              }
            }}
          >
            Submit Your Information
          </button>
        </div>
        {displayButtons()}
      </Fragment>
    );
  };

  const errorText = () => {
    if (error) {
      return (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            lineHeight: "25px",
            paddingBottom: "20px",
          }}
        >
          {message}
        </div>
      );
    } else {
      return null;
    }
  };

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.HeaderModal}>
          <div>Edit Your Information</div>
          <div style={{ textAlign: "right", top: "10%" }}>
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
      return <div className={classes.Header}>Edit Your Information</div>;
    }
  };

  if (props.spinner) {
    let height;
    if (props.authOrigin) {
      height = { height: "494px" };
    } else {
      height = { height: "377px" };
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
          {personalForm()}
        </div>
      </div>
    );
  }
};

export default PersonalDisplay;
