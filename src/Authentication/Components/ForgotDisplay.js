import React, { useState, Fragment } from "react";
import validator from "validator";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "./Components.module.css";

const ForgotDisplay = (props) => {
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

  const handleForgot = (data) => {
    console.log("data.user: ", data.user);
    if (data.status) {
      let value;
      if (data.user.email) {
        console.log("There is an email");
        value = data.user.email;
      } else if (data.user.mobilePhone) {
        console.log("There is a mobile phone");
        value = data.user.mobilePhone;
      } else {
        console.log("there is nothing");
      }
      props.values({
        email: value,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        resetToken: "",
        sessionToken: "",
        accountNum: "",
      });
      props.displayChange("temporary");
      props.spinnerChange(false);
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("forgot");
      props.spinnerChange(false);
    }
  };

  const submitForgot = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });
    let myHeaders = new Headers();
    let url;
    let information;
    myHeaders.append("Content-Type", "application/json");
    if (validator.isEmail(props.email)) {
      console.log("about to send code via email");
      url = `${API}/auth/signin/sendcode`;
      information = {
        email: props.email,
      };
    } else if (validator.isMobilePhone(props.email)) {
      console.log("about to send code via text");
      url = `${API}/auth/signin/phone/sendcode`;
      information = {
        mobilePhone: props.email,
      };
    } else {
    }

    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleForgot(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const forgotForm = () => {
    //const regsuper =
    //  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let disabled =
      !validator.isEmail(props.email) && !validator.isMobilePhone(props.email);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.ButtonBlue;
    }

    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "100%" }}>
          <div className={classes.Header}>Trouble logging in?</div>
          {errorText()}
          <label style={{ fontSize: "15px" }}>E-mail Address/Cell Phone</label>
          <input
            className={classes.InputBox}
            type="email"
            name="email"
            onChange={props.inputChange}
            value={props.email}
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
          />
          {props.email &&
          !validator.isEmail(props.email) &&
          !validator.isMobilePhone(props.email) ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.ErrorText}>
                A valid email address or mobile phone is required
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={buttonClass}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitForgot();
              }
            }}
          >
            Submit
          </button>
        </div>
        {bottomDisplay}
      </Fragment>
    );
  };

  const errorText = () => {
    if (error) {
      return <div className={classes.ErrorText}>{message}</div>;
    } else if (props.expired && props.authOrigin !== true) {
      return (
        <div className={classes.TimerText}>
          Timer has expired, please resubmit your email:
        </div>
      );
    } else {
      return null;
    }
  };

  const bottomDisplay = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        Back to{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            setSubmissionStatus({
              message: "",
              error: false,
            });
            props.displayChange("signin");
          }}
        >
          Log in
        </button>
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ textAlign: "right" }}>
          Not a member?{" "}
          <button
            className={classes.BlueText}
            onClick={() => {
              props.resetValues();
              setSubmissionStatus({
                message: "",
                error: false,
              });
              props.displayChange("signup");
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
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
      <div
        className={classes.BlankCanvas}
        style={{ paddingTop: "40px", height: "288px" }}
      >
        <Spinner />
      </div>
    );
  } else {
    return (
      <Fragment>
        {closeIcon()}
        <div className={classes.BlankCanvas}>{forgotForm()}</div>
      </Fragment>
    );
  }
};

export default ForgotDisplay;
