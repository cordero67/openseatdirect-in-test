import React, { useState, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/Spinner";
import { API } from "../../config";

import classes from "./Components.module.css";

const ConfirmTempDisplay = (props) => {
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

  const handleReissue = (data) => {
    if (data.status) {
      props.values({
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: true,
        expired: false,
        confirmation: "",
        resent: false,
        resetToken: "",
        sessionToken: "",
        accountNum: "",
      });
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("temporary");
      props.spinnerChange(false);
    }
  };

  const submitReissue = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/sendcode`;
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
        handleReissue(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };
  const handleTemporary = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      props.values({
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        resetToken: "",
        sessionToken: "",
        accoutNum: "",
      });
      props.submit();
    } else {
      console.log("data.error: ", data.error);
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("temporary");
      props.spinnerChange(false);
    }
  };

  const submitTemporary = () => {
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signinnnn/confirmcode`;
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
        props.showError();
        props.spinnerChange(false);
      });
  };
  const temporaryForm = () => {
    const regsuper = /\b\d{6}\b/;
    let disabled = !regsuper.test(props.temporary);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.ButtonBlue;
    }

    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "100%" }}>
          <div className={classes.Header}>Enter confirmation code</div>
          {errorText()}
          {topDisplay()}
          <label style={{ fontSize: "15px" }}>Confirmation Code</label>
          <input
            className={classes.InputBox}
            type="text"
            maxlength="6"
            name="temporary"
            onChange={props.inputChange}
            value={props.temporary}
            onFocus={() => {
              setSubmissionStatus({ message: "", error: false });
            }}
          />
          {props.temporary && !regsuper.test(props.temporary) ? (
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
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitTemporary();
              }
            }}
          >
            Submit confirmation code
          </button>
        </div>
        {bottomDisplay}
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
    if (!props.reissued) {
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter the 6-digit code sent to your email.
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
            Confirmation code resent to your email.
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
            submitReissue();
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
            props.resetValues();
            setSubmissionStatus({
              message: "",
              error: false,
            });
            props.displayChange("signin");
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );

  const closeIcon = () => {
    return (
      <div className={classes.CloseIcon}>
        {props.authOrigin !== true ? (
          <ion-icon
            name="close-circle-outline"
            cursor="pointer"
            onClick={() => {
              props.close();
            }}
          />
        ) : null}
      </div>
    );
  };

  if (props.spinner) {
    return (
      <div
        className={classes.BlankCanvas}
        style={{ paddingTop: "40px", height: "360px" }}
      >
        <Spinner />
      </div>
    );
  } else {
    return (
      <Fragment>
        {closeIcon()}
        <div className={classes.BlankCanvas}>{temporaryForm()}</div>{" "}
      </Fragment>
    );
  }
};

export default ConfirmTempDisplay;
