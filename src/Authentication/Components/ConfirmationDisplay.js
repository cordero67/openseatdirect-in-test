import React, { Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "../AuthenticationModal.module.css";

const ConfirmationDisplay = (props) => {
  console.log("props: ", props);
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitResend = () => {
    props.submission({
      message: "",
      error: false,
      redirect: "",
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/resendcode`;
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
        handleResend(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        props.submission({
          message: "Server is down, please try later",
          error: true,
          redirect: "confirmation",
        });
        props.displayChange("error");
      });
  };

  const handleResend = (data) => {
    if (data.status) {
      props.values({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: true,
        username: props.username,
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      console.log("SUCCESS");
    } else {
      props.submission({
        message: data.error,
        error: true,
        redirect: "",
      });
      console.log("ERROR: ", data.error);
    }
  };

  const submitConfirmation = () => {
    props.spinnerChange(true);
    props.submission({
      message: "",
      error: false,
      redirect: "",
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
        if (props.authOrigin) {
          props.updateSub();
        }
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        props.submission({
          message: "Server down please try again",
          error: true,
          redirect: "confirmation",
        });
        props.displayChange("error");
        props.spinnerChange(false);
      });
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
        expired: false,
        confirmation: "",
        resent: false,
        resetToken: data.user.passwordToken,
        sessionToken: "",
        userId: data.user.accountId._id,
        accountNum: data.user.accountId.accountNum,
      });
      props.displayChange("password");
      props.spinnerChange(false);
    } else {
      props.submission({
        message: data.error,
        error: true,
        redirect: "",
      });
      props.displayChange("confirmation");
      props.spinnerChange(false);
    }
  };

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
        <div style={{ paddingBottom: "20px", width: "100%" }}>
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
            className={buttonClass}
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

  const showError = () => {
    if (props.error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {props.message}
        </div>
      );
    } else if (!props.resent) {
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter the 6-digit code sent to your email.
          </div>
          <div
            style={{ fontWeight: "600", color: "red", paddingBottom: "20px" }}
          >
            PLEASE CHECK YOUR SPAM/JUNK FOLDER
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter the new 6-digit code sent to your email.
          </div>
          <div
            style={{ fontWeight: "600", color: "red", paddingBottom: "20px" }}
          >
            PLEASE CHECK YOUR SPAM/JUNK FOLDER
          </div>
        </Fragment>
      );
    }
  };

  const alternateConfirmationInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            props.submission({ message: "", error: false, redirect: "" });
            submitResend();
          }}
        >
          Resend code
        </button>
      </div>
    </div>
  );

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.Header}>
          <div>Enter confirmation code</div>
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
      return <div className={classes.Header}>Enter confirmation code</div>;
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "288px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {showError()}
          {confirmationForm()}
          {alternateConfirmationInputs}
        </div>
      </div>
    );
  }
};

export default ConfirmationDisplay;
