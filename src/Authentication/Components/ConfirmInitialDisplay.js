import React, { useState, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "./Components.module.css";

const ConfirmInitialDisplay = (props) => {
  console.log("props: ", props);
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

  const handleResend = (data) => {
    if (data.status) {
      props.values({
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: true,
        resetToken: "",
        sessionToken: "",
        accountNum: "",
      });
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("confirmation");
      props.spinnerChange(false);
    }
  };

  const submitResend = () => {
    setSubmissionStatus({
      message: "",
      error: false,
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
        props.showError();
        props.spinnerChange(false);
      });
  };

  const handleConfirmation = (data) => {
    console.log("data: ", data);
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
        resetToken: data.user.passwordToken,
        sessionToken: "",
        accountNum: data.user.accountId.accountNum,
      });
      props.displayChange("password");
      props.spinnerChange(false);
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("confirmation");
      props.spinnerChange(false);
    }
  };

  const submitConfirmation = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
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
        props.showError();
        props.spinnerChange(false);
      });
  };

  const confirmationForm = () => {
    const regsuper = /\b\d{6}\b/;
    let disabled = !regsuper.test(props.confirmation);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.ButtonBlue;
    }

    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "100%" }}>
          <label style={{ fontSize: "15px" }}>Confirmation code</label>
          <input
            className={classes.InputBox}
            type="text"
            name="confirmation"
            maxLength="6"
            onChange={props.inputChange}
            value={props.confirmation}
            onFocus={() => {
              setSubmissionStatus({ message: "", error: false });
            }}
          />{" "}
          {props.confirmation && !regsuper.test(props.confirmation) ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.ErrorText}>
                A valid 6 digit code is required
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={buttonClass}
            onClick={() => {
              if (!disabled) {
                submitConfirmation();
              }
            }}
          >
            Submit Confirmation Code
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

  const topDisplay = () => {
    if (!props.resent) {
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter 6-digit code sent to your email.
          </div>
          <div className={classes.SpamText}>
            PLEASE CHECK YOUR SPAM/JUNK FOLDER
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter new 6-digit code sent to your email.
          </div>
          <div className={classes.SpamText}>
            PLEASE CHECK YOUR SPAM/JUNK FOLDER
          </div>
        </Fragment>
      );
    }
  };

  const bottomDisplay = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            setSubmissionStatus({
              message: "",
              error: false,
            });
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
        <div className={classes.HeaderModal}>
          <div>Enter confirmation code</div>
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
      return <div className={classes.Header}>Enter confirmation code</div>;
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "308px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {errorText()}
          {topDisplay()}
          {confirmationForm()}
          {bottomDisplay}
        </div>
      </div>
    );
  }
};

export default ConfirmInitialDisplay;
