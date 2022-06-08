import React, { useState, Fragment } from "react";
import GoogleAuthentication from "./GoogleAuthentication";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";
import OSDImg from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

import classes from "./Components.module.css";

const SignUpDisplay = (props) => {
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

  const handleSignUp = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      props.values({
        email: data.user.email,
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
      props.displayChange("confirmation");
      props.spinnerChange(false);
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("signup");
      props.spinnerChange(false);
    }
  };

  const submitSignUp = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/email`;
    let information = {
      email: props.email,
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
        handleSignUp(data);
      })
      .catch((error) => {
        console.log("error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const signUpForm = () => {
    const regsuper =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let disabled = !regsuper.test(props.email);
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
          {props.email && !regsuper.test(props.email) ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.ErrorText}>
                A valid email address is required
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
                submitSignUp();
              }
            }}
          >
            Submit your email
          </button>
        </div>
        <div style={{ fontSize: "14px", paddingTop: "10px" }}>
          By clicking 'Submit Your Email' I agree to Open Seat Direct's{" "}
          <a
            className={classes.BlueTextSmall}
            href="https://www.openseatdirect.com/privacy-policy/"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            className={classes.BlueTextSmall}
            href="https://www.openseatdirect.com/terms-and-conditions/"
            target="_blank"
            rel="noreferrer"
          >
            Terms and Conditions
          </a>
          .
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
                name: "",
                email: data.user.email,
                password: "",
                temporary: "",
                reissued: false,
                confirmation: "",
                resent: false,
                username: data.user.username,
                resetToken: "",
                sessionToken: data.token,
                userId: data.user.userId,
                accountNum: data.user.accountId.accountNum,
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
    } else if (props.expired && !props.authOrigin) {
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
        Already a member?{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            props.resetValues();
            setSubmissionStatus({ message: "", error: false });
            props.displayChange("signin");
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.HeaderModal}>
          <div style={{ lineHeight: "30px" }}>
            Ready to join{" "}
            <img
              src={OSDImg}
              alt="OPENNODE"
              width="80px"
              height="auto"
              cursor="pointer"
              onClick={() => {
                console.log("selecting Opennode");
                //setDisplay("opennode");
              }}
            ></img>
          </div>
          <div style={{ textAlign: "right" }}>
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
      return (
        <div className={classes.Header}>
          <div style={{ lineHeight: "30px" }}>
            Ready to join{" "}
            <img src={OSDImg} alt="OPENNODE" width="80px" height="auto"></img>
          </div>
        </div>
      );
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "433px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {showError()}
          {signUpForm()}
          {bottomDisplay}
        </div>
      </div>
    );
  }
};

export default SignUpDisplay;
