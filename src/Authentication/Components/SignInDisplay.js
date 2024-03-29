import React, { useState, Fragment } from "react";
import GoogleAuthentication from "./GoogleAuthentication";
import FacebookAuthentication from "./FacebookAuthentication";
import AppleAuthentication from "./AppleAuthentication";
import validator from "validator";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "./Components.module.css";

const SignInDisplay = (props) => {
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

  const handleSignIn = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      props.values({
        email: data.user?.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        resetToken: "",
        sessionToken: data.token,
        accountNum: data.user?.accountId?.accountNum,
      });
      props.submit();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("signin");
      props.spinnerChange(false);
    }
  };

  const submitSignIn = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url;
    let information;

    if (validator.isEmail(props.email)) {
      console.log("about to send email login");
      url = `${API}/auth/signin/email`;
      information = {
        email: props.email,
        password: props.password,
      };
    } else if (validator.isMobilePhone(props.email)) {
      console.log("about to send mobile phone login");
      url = `${API}/auth/signin/phone`;
      information = {
        mobilePhone: props.email,
        password: props.password,
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
        handleSignIn(data);
      })
      .catch((error) => {
        console.log("error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const signInForm = () => {
    console.log("Validator check");

    let validEmail = validator.isEmail(props.email);
    console.log("Email Validator results: ", validEmail);

    let validPhone = validator.isMobilePhone(props.email);
    console.log("Phone Validator results: ", validPhone);

    //const regEmail =
    //  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //const regPassword = /^(?=.*\d).{8,}$/;
    const regPassword = /^([ A-Za-z0-9?=.*]).{8,}$/;
    ///^[ A-Za-z0-9_@./#&+-]*$/

    let disabled =
      (!validator.isEmail(props.email) &&
        !validator.isMobilePhone(props.email)) ||
      !regPassword.test(props.password);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.ButtonBlue;
    }

    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "100%" }}>
          <div className={classes.Header}>Log in</div>
          {showError()}
          <label style={{ fontSize: "15px" }}>Email Address/Cell Phone</label>
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
              <span className={classes.RedText}>
                A valid email address or mobile phone is required
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ paddingBottom: "20px", width: "100%" }}>
          <label style={{ fontSize: "15px" }}>Password</label>
          <input
            className={classes.InputBox}
            type="password"
            name="password"
            onChange={props.inputChange}
            value={props.password}
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
          />
          {props.password && !regPassword.test(props.password) ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.RedText}>
                Minimum 8 character password
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ fontSize: "18px", paddingTop: "10px" }}>
          <button
            className={buttonClass}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitSignIn();
              }
            }}
          >
            Log in
          </button>
        </div>
        <div className={classes.LineGrid}>
          <hr className={classes.HorizontalLine} />
          <div style={{ paddingTop: "5px", fontWeight: "600" }}>
            OR continue with
          </div>
          <hr className={classes.HorizontalLine} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "105px 105px 105px",
            columnGap: "12px",
            paddingBottom: "10px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <FacebookAuthentication
              authOrigin={props.authOrigin}
              error={(message) => {
                if (!message) {
                  setSubmissionStatus({
                    message: "System error please try again.",
                    error: true,
                  });
                } else {
                  setSubmissionStatus({
                    message: message,
                    error: true,
                  });
                }
              }}
              success={(data) => {
                console.log("data: ", data);
                props.values({
                  email: data.user?.email,
                  password: "",
                  temporary: "",
                  reissued: false,
                  expired: false,
                  confirmation: "",
                  resent: false,
                  resetToken: "",
                  sessionToken: data.token,
                  accountNum: data.user?.accountId?.accountNum,
                });
                props.submit();
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <GoogleAuthentication
              authOrigin={props.authOrigin}
              error={(message) => {
                if (!message) {
                  setSubmissionStatus({
                    message: "System error please try again.",
                    error: true,
                  });
                } else {
                  setSubmissionStatus({
                    message: message,
                    error: true,
                  });
                }
              }}
              success={(data) => {
                console.log("data: ", data);
                props.values({
                  email: data.user?.email,
                  password: "",
                  temporary: "",
                  reissued: false,
                  expired: false,
                  confirmation: "",
                  resent: false,
                  resetToken: "",
                  sessionToken: data.token,
                  accountNum: data.user?.accountId?.accountNum,
                });
                props.submit();
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <AppleAuthentication
              authOrigin={props.authOrigin}
              error={(message) => {
                if (!message) {
                  setSubmissionStatus({
                    message: "System error please try again.",
                    error: true,
                  });
                } else {
                  setSubmissionStatus({
                    message: message,
                    error: true,
                  });
                }
              }}
              success={(data) => {
                console.log("data: ", data);
                props.values({
                  email: data.user?.email,
                  password: "",
                  temporary: "",
                  reissued: false,
                  expired: false,
                  confirmation: "",
                  resent: false,
                  resetToken: "",
                  sessionToken: data.token,
                  accountNum: data.user?.accountId?.accountNum,
                });
                props.submit();
              }}
            />
          </div>
        </div>
        {bottomDisplay}
      </Fragment>
    );
  };

  const showError = () => {
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

  const bottomDisplay = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            props.resetValues();
            setSubmissionStatus({
              message: "",
              error: false,
            });
            props.displayChange("forgot");
          }}
        >
          Forgot password?
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

  if (props.spinner) {
    return (
      <div
        className={classes.BlankCanvas}
        style={{ paddingTop: "40px", height: "485px" }}
      >
        <Spinner />
      </div>
    );
  } else {
    return (
      <Fragment>
        {closeIcon()}
        <div className={classes.BlankCanvas}>{signInForm()}</div>
      </Fragment>
    );
  }
};

export default SignInDisplay;
