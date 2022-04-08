import React, { useState, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "./Components.module.css";

const PasswordDisplay = (props) => {
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

  const handlePassword = (data) => {
    if (data.status) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      tempUser.token = data.token;
      console.log("tempUser: ", tempUser);
      localStorage.setItem("user", JSON.stringify(tempUser));

      props.values({
        email: tempUser.user.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        resetToken: "",
        sessionToken: tempUser.token,
        accountNum: tempUser.user.accountId.accountNum,
      });
      props.submit();
      console.log("success success1");
      props.spinnerChange(false);
      console.log("success success2");
    } else {
      console.log("success failure");
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("password");
      props.spinnerChange(false);
    }
  };

  const submitPassword = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/password`;
    let information = {
      email: props.email,
      passwordToken: props.resetToken,
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
        handlePassword(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const passwordForm = () => {
    const regPassword = /^(?=.*\d).{8,}$/;
    let disabled = !regPassword.test(props.password);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.ButtonBlue;
    }

    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "100%" }}>
          <label style={{ fontSize: "15px" }}>Password</label>
          <input
            className={classes.InputBox}
            type="text"
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
              <span className={classes.ErrorText}>
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
              if (!disabled) {
                submitPassword();
              }
            }}
          >
            Register Your Passowrd
          </button>
        </div>
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

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.HeaderModal}>
          <div>Create your password</div>
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
      return <div className={classes.Header}>Create your password</div>;
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "197px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {errorText()}
          {passwordForm()}
        </div>
      </div>
    );
  }
};

export default PasswordDisplay;
