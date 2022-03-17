import React, { Fragment } from "react";
import GoogleAuthentication from "../GoogleAuthentication";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "../AuthenticationModal.module.css";

const SignInDisplay = (props) => {
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitSignIn = () => {
    props.spinnerChange(true);
    props.submission({
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
        console.log("freeTicketHandler() error.message: ", error.message);
        props.submission({
          message: "Server down please try again",
          error: true,
        });
        props.modalChange("error");
        props.spinnerChange(false);
      })
      .finally(() => {});
  };

  const alternateSignInInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            props.resetValues();
            props.submission({ message: "", error: false, redirect: "" });
            props.modalChange("forgot");
          }}
        >
          Forgot password?
        </button>
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            props.resetValues();
            props.submission({ message: "", error: false, redirect: "" });
            props.modalChange("signup");
          }}
        >
          Create account
        </button>
      </div>
    </div>
  );

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
      buttonClass = classes.SubmitButton;
    }

    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "100%" }}>
          <label style={{ fontSize: "15px" }}>E-mail Address</label>
          <input
            className={classes.InputBox}
            type="email"
            name="email"
            onChange={props.inputChange}
            value={props.email}
            onFocus={() => {
              props.submission({ message: "", error: false, redirect: "" });
            }}
          />
          {props.email && !regEmail.test(props.email) ? (
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
              props.submission({ message: "", error: false, redirect: "" });
            }}
          />
          {props.email && !regPassword.test(props.password) ? (
            <div style={{ paddingTop: "5px" }}>
              <span
                style={{
                  color: "red",
                  fontSize: "14px",
                  paddingTop: "5px",
                  paddingBottom: "10px",
                }}
              >
                Minimum 8 character password including 1 number
              </span>
            </div>
          ) : null}
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
                  redirect: "",
                });
              } else {
                submitSignIn();
              }
            }}
          >
            SIGN IN TO YOUR ACCOUNT
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "calc((100% - 140px)/2) 100px calc((100% - 140px)/2)",
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
          <div style={{ paddingTop: "5px" }}>Or sign in with</div>
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
                vendorIntent: "",
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

  const handleSignIn = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      props.values({
        name: "",
        email: "",
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      props.submit();
    } else {
      props.submission({
        message: data.error,
        error: true,
      });
      props.modalChange("signin");
      props.spinnerChange(false);
    }
  };

  const showDetail = () => {
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
    } else if (props.expired && props.authOrigin !== true) {
      return (
        <div style={{ color: "red", fontSize: "16px", paddingBottom: "20px" }}>
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
        <div className={classes.Header}>
          <div>Welcome back</div>
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
      return <div className={classes.Header}>Welcome back!</div>;
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
          {showDetail()}
          {signInForm()}
          {alternateSignInInputs}
        </div>
      </div>
    );
  }
};

export default SignInDisplay;
