import React, { Fragment } from "react";
import GoogleAuthentication from "./GoogleAuthentication";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";
import OSDImg from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

import classes from "../AuthenticationModal.module.css";

const SignUpDisplay = (props) => {
  console.log("props: ", props);
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
        username: data.user.username,
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      props.displayChange("confirmation");
      props.spinnerChange(false);
    } else {
      props.submission({
        message: data.error,
        error: true,
      });
      props.displayChange("signup");
      props.spinnerChange(false);
    }
  };

  const submitSignUp = () => {
    props.spinnerChange(true);
    props.submission({
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
    console.log("Information: ", information);
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
        console.log("freeTicketHandler() error.message: ", error.message);
        props.submission({
          message: "Server down please try again",
          error: true,
        });
        props.displayChange("error");
        props.spinnerChange(false);
      });
  };

  const signUpForm = () => {
    const regsuper =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let disabled = !regsuper.test(props.email);
    console.log("disabled: ", disabled);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.SubmitButton;
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
              props.submission({ message: "", error: false });
            }}
          />
          {props.email && !regsuper.test(props.email) ? (
            <div style={{ paddingTop: "5px" }}>
              <span
                style={{
                  color: "red",
                  fontSize: "14px",
                  paddingTop: "5px",
                  paddingBottom: "10px",
                }}
              >
                A valid email address is required
              </span>
            </div>
          ) : null}
          <div></div>
        </div>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={buttonClass}
            disabled={disabled}
            onClick={() => {
              if (disabled) {
                props.submission({
                  message: "Invalid email address",
                  error: true,
                });
              } else {
                submitSignUp();
              }
            }}
          >
            SUBMIT YOUR EMAIL
          </button>
        </div>
        <div style={{ paddingTop: "10px" }}>
          By clicking 'Submit Your Email' I agree to Open Seat Direct's{" "}
          <a
            className={classes.BlueText}
            styles={{ border: "none", outline: "none" }}
            href="https://www.openseatdirect.com/privacy-policy/"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            className={classes.BlueText}
            styles={{ border: "none", outline: "none" }}
            href="https://www.openseatdirect.com/terms-and-conditions/"
            target="_blank"
            rel="noreferrer"
          >
            Terms and Conditions
          </a>
          .
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "calc((100% - 150px)/2) 110px calc((100% - 150px)/2)",
            columnGap: "20px",
            textAlign: "center",
            fontSize: "14px",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <hr
            style={{
              display: "block",
              height: "1px",
              border: "0",
              borderTop: "1px solid #ccc",
              margin: "1em 0",
              padding: "0",
            }}
          />
          <div style={{ paddingTop: "5px", fontWeight: "600" }}>
            OR continue with
          </div>
          <hr
            style={{
              display: "block",
              height: "1px",
              border: "0",
              borderTop: "1px solid #ccc",
              margin: "1em 0",
              padding: "0",
            }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <GoogleAuthentication
            authOrigin={props.authOrigin}
            error={(message) => {
              if (!message) {
                props.submission({
                  message: "System error please try again.",
                  error: true,
                });
              } else {
                props.submission({
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
    } else if (props.expired && !props.authOrigin) {
      return (
        <div style={{ color: "red", fontSize: "16px", paddingBottom: "20px" }}>
          Timer has expired, please resubmit your email:
        </div>
      );
    } else {
      return null;
    }
  };

  const alternateSignUpInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        Already a member?{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            props.submission({ message: "", error: false });
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
        <div className={classes.Header}>
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
              style={{
                fontWeight: "600",
                fontSize: "28px",
                color: "black",
                paddingBottom: "5px",
              }}
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
        </div>
      );
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "363px" }}>
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
          {alternateSignUpInputs}
        </div>
      </div>
    );
  }
};

export default SignUpDisplay;
