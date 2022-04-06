import React, { useState, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "./Components.module.css";

const ResetDisplay = (props) => {
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

  const handleReset = (data) => {
    if (data.status) {
      console.log("SUCCESS");
      props.close();
      props.spinnerChange(false);
    } else {
      if (data.code === 202) {
        console.log("Status 202 Error");
        props.displayChange("expired");
        props.spinnerChange(false);
      } else {
        setSubmissionStatus({
          message: data.error,
          error: true,
        });
        props.displayChange("password");
        props.spinnerChange(false);
      }
    }
  };

  const submitReset = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${props.sessionToken}`);
    let url = `${API}/auth/password/new`;
    let information = {
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
        handleReset(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const resetForm = () => {
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
              if (!disabled) {
                submitReset();
              }
            }}
          >
            REGISTER PASSWORD
          </button>
        </div>
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

  const header = (
    <div className={classes.HeaderModal}>
      <div>Change your password</div>
      <div style={{ textAlign: "right" }}>
        <ion-icon
          style={{ fontWeight: "600", fontSize: "28px", color: "black" }}
          name="close-outline"
          cursor="pointer"
          onClick={() => {
            props.close();
          }}
        />
      </div>
    </div>
  );

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "197px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header}
        <div>
          {errorText()}
          {resetForm()}
        </div>
      </div>
    );
  }
};

export default ResetDisplay;
