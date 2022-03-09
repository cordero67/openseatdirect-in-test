import React, { Fragment } from "react";

import Spinner from "../../../components/UI/Spinner/SpinnerNew";
import { API } from "../../../config";

import classes from "../Authentication.module.css";

const ConfirmationDisplay = (props) => {
  console.log("props: ", props);
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitConfirmation = () => {
    props.spinnerChange(true);
    props.submission({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/confirmcode`;
    let information = {
      email: props.email,
      confirm_code: props.confirmation,
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
        handleConfirmation(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        props.submission({
          message: "Server down please try again",
          error: true,
        });
        props.modalChange("error");
      })
      .finally(() => {
        props.spinnerChange(false);
      });
  };

  const alternateConfirmationInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            props.resend();
          }}
        >
          Resend code
        </button>
      </div>
    </div>
  );

  const confirmationForm = () => {
    const regsuper = /\b\d{6}\b/;
    let disabled = !regsuper.test(props.confirmation);
    console.log("disabled: ", disabled);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.SubmitButton;
    }

    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
          <label style={{ fontSize: "15px" }}>Confirmation Number</label>
          <input
            className={classes.InputBox}
            type="text"
            name="confirmation"
            onChange={props.inputChange}
            value={props.confirmation}
            onFocus={() => {
              props.submission({ message: "", error: false, redirect: "" });
            }}
          />{" "}
          {props.confirmation && !regsuper.test(props.confirmation) ? (
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
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.buttonClass}
            onClick={() => {
              submitConfirmation();
            }}
          >
            SUBMIT YOUR CODE
          </button>
        </div>
      </Fragment>
    );
  };

  const handleConfirmation = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      props.values({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        //expired: false,
        confirmation: "",
        resent: false,
        username: data.user.username,
        resetToken: data.user.passwordToken,
        sessionToken: "",
        userId: "",
      });
      props.modalChange("password");
    } else {
      props.submission({
        message: data.error,
        error: true,
      });
      props.modalChange("confirmation");
    }
  };

  const showError = () => {
    if (props.error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {props.message}
        </div>
      );
    } else if (!props.resent) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Enter the 6-digit code sent to your email:
        </div>
      );
    } else {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          A new 6-digit code was sent to your email,
          <br></br>
          please enter it below:
        </div>
      );
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "445px" }}>
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
          {confirmationForm}
          {alternateConfirmationInputs}
        </div>
      </div>
    );
  }
};
export default ConfirmationDisplay;
