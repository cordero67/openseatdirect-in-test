import React, { useState, Fragment } from "react";
import GoogleAuthentication from "./GoogleAuthentication";

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
    let url = `${API}/auth/signin/email`;
    let information = {
      email: props.email,
      password: props.password,
    };
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
    const regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regPassword = /^(?=.*\d).{8,}$/;
    let disabled =
      !regEmail.test(props.email) || !regPassword.test(props.password);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.ButtonBlue;
    }

    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "100%" }}>
          <label style={{ fontSize: "15px" }}>Email Address</label>
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
          {props.email && !regEmail.test(props.email) ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.RedText}>
                A valid email address is required
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
                Minimum 8 character password including 1 number
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
            Log in to your account
          </button>
        </div>
        <div className={classes.LineGrid}>
          <hr className={classes.HorizontalLine} />
          <div style={{ paddingTop: "5px", fontWeight: "600" }}>
            OR continue with
          </div>
          <hr className={classes.HorizontalLine} />
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

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.HeaderModal}>
          <div>Welcome Back!</div>
          <div style={{ textAlign: "center" }}>
            <ion-icon
              className={classes.CloseIcon}
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
      return <div className={classes.Header}>Welcome Back!</div>;
    }
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
      <div className={classes.BlankCanvas} style={{ height: "435px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {showError()}
          {signInForm()}
          {bottomDisplay}
        </div>
      </div>
    );
  }
};

export default SignInDisplay;
