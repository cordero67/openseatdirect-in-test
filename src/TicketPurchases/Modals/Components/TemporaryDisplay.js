import React, { Fragment } from "react";

import Spinner from "../../../components/UI/Spinner/SpinnerNew";
import { API } from "../../../config";

import classes from "../Authentication.module.css";

const TemporaryDisplay = (props) => {
  console.log("props: ", props);
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitTemporary = () => {
    props.spinnerChange(true);
    props.submission({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/confirmcode`;
    let information = {
      email: props.email,
      confirm_code: props.temporary,
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
        handleTemporary(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        props.submission({
          message: "Server is down, please try later",
          error: true,
        });
        props.modalChange("error");
      })
      .finally(() => {
        props.spinnerChange(false);
      });
  };

  const alternateTemporaryInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            props.submitReissue();
          }}
        >
          Resend code
        </button>
      </div>
      <div style={{ textAlign: "right" }}>
        Back to{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            props.modalChange("signin");
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  const temporaryForm = () => {
    const regsuper = /\b\d{6}\b/;
    let disabled = !regsuper.test(props.temporary);
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
          <label style={{ fontSize: "15px" }}>Confirmation Code</label>
          <input
            className={classes.InputBox}
            type="text"
            name="temporary"
            onChange={props.inputChange}
            value={props.temporary}
            onFocus={() => {
              props.submission({ message: "", error: false, redirect: "" });
            }}
          />
          {props.temporary && !regsuper.test(props.temporary) ? (
            <div style={{ paddingTop: "5px" }}>
              <span
                style={{
                  color: "red",
                  fontSize: "14px",
                  paddingTop: "5px",
                  paddingBottom: "10px",
                }}
              >
                A valid 6 digit code is required
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
                  message: "Invalid confirmation code",
                  error: true,
                  redirect: "",
                });
              } else {
                submitTemporary();
              }
            }}
          >
            SUBMIT CONFIRMATION CODE
          </button>
        </div>
      </Fragment>
    );
  };

  const handleTemporary = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      props.values({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      props.submit();
    } else {
      props.submission({
        message: data.error,
        error: true,
      });
      props.modalChange("temporary");
    }
  };

  const showError = () => {
    if (!props.reissued) {
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter the 6-digit code sent to:
          </div>
          <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
            {props.email}
          </div>
        </Fragment>
      );
    } else {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Confirmation code resent to your email.
        </div>
      );
    }
  };

  let height;
  if (props.reissued) {
    height = "288px";
  } else {
    height = "319px";
  }

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: height }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        <div className={classes.Header}>
          <div>Enter confirmation code</div>
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
        <div>
          {showError()}
          {temporaryForm()}
          {alternateTemporaryInputs}
        </div>
      </div>
    );
  }
};

export default TemporaryDisplay;