import React, { useState, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "./Components.module.css";

const ConfirmUpdateDisplay = (props) => {
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
        email: props.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: true,
        resetToken: data.user.passwordToken,
        sessionToken: props.sessionToken,
        accountNum: props.accountNum,
      });
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("confirmUpdate");
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
    myHeaders.append("Authorization", `Bearer ${props.sessionToken}`);
    let url = `${API}/auth/password/sendcode`;
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
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
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("tempUser: ", tempUser);
      tempUser.data = data.user;

      props.values({
        email: props.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        resetToken: data.user.passwordToken,
        sessionToken: props.sessionToken,
        accountNum: props.accountNum,
      });
      props.displayChange("reset");
      props.spinnerChange(false);
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("confirmUpdate");
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
    myHeaders.append("Authorization", `Bearer ${props.sessionToken}`);
    let url = `${API}/auth/password/confirmcode`;
    let information = {
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
        props.showError();
        props.spinnerChange(false);
      });
  };

  const confirmationForm = () => {
    const regsuper = /\b\d{6}\b/;
    let disabled = !regsuper.test(props.confirmation);
    console.log("disabled: ", disabled);
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
            onClick={() => {
              if (!disabled) {
                submitConfirmation();
              }
            }}
          >
            Submit confirmation code
          </button>
        </div>
      </Fragment>
    );
  };

  const errorText = () => {
    if (error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {message}
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
            Enter the 6-digit code sent to your email.
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "red",
              paddingBottom: "20px",
            }}
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
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "red",
              paddingBottom: "20px",
            }}
          >
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

  const header = (
    <div className={classes.HeaderModal}>
      <div>Enter confirmation code</div>
      <div style={{ textAlign: "right" }}>
        <ion-icon
          style={{
            fontWeight: "600",
            fontSize: "24px",
            color: "black",
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

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "308px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header}
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

export default ConfirmUpdateDisplay;
