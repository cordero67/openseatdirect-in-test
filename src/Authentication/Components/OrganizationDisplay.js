import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import classes from "./Components.module.css";

const OrganizationDisplay = (props) => {
  console.log("props: ", props);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [subValues, setSubValues] = useState({
    accountName: "",
    accountEmail: "",
    phoneNumber: "",
    website: "",
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
        if (tempUser.user.accountId.accountName) {
          tempSubValues.accountName = tempUser.user.accountId.accountName;
        } else {
          tempSubValues.accountName = "";
        }
        if (tempUser.user.accountId.accountEmail) {
          tempSubValues.accountEmail = tempUser.user.accountId.accountEmail;
        } else {
          tempSubValues.accountEmail = "";
        }
        if (tempUser.user.accountId.phoneNumber) {
          tempSubValues.phoneNumber = tempUser.user.accountId.phoneNumber;
        } else {
          tempSubValues.phoneNumber = "";
        }
        if (tempUser.user.accountId.website) {
          tempSubValues.website = tempUser.user.accountId.website;
        } else {
          tempSubValues.website = "";
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

  const organizationForm = () => {
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
            Organization Name <span style={{ color: "red" }}>* </span>
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
            name="accountName"
            onChange={handleSubValueChange}
            value={subValues.accountName}
          />
        </div>
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <label style={{ width: "340px", fontSize: "15px" }}>
            Organization E-mail <span style={{ color: "red" }}>* </span>
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
            name="accountEmail"
            onChange={handleSubValueChange}
            value={subValues.accountEmail}
          />
        </div>
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <label style={{ width: "340px", fontSize: "15px" }}>
            Phone Number <span style={{ color: "red" }}>* </span>
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
            name="phoneNumber"
            onChange={handleSubValueChange}
            value={subValues.phoneNumber}
          />
        </div>
        <div>
          <label style={{ width: "340px", fontSize: "15px" }}>
            Website <span style={{ color: "red" }}>* </span>
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
            name="website"
            onChange={handleSubValueChange}
            value={subValues.website}
          />
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            style={{ fontSize: "19px" }}
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
            style={{ fontSize: "17px" }}
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
          <div>Edit Your Information</div>
          <div style={{ textAlign: "right", top: "10%" }}>
            <ion-icon
              className={classes.CloseIcon}
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
          {organizationForm()}
        </div>
      </div>
    );
  }
};

export default OrganizationDisplay;
