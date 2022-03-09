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

  const confirmationForm = (

    const regsuper = /\b\d{6}\b/
    let disabled = !regsuper.test(props.temporary);
    console.log("disabled: ", disabled);
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.SubmitButton;
    }



    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Confirmation Number</label>
        <input
          className={classes.InputBox}
          type="text"
          name="confirmation"
          onChange={handleChange}
          value={confirmation}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitConfirmation();
          }}
        >
          SUBMIT YOUR CODE
        </button>
      </div>
    </Fragment>
  );

  const handleConfirmation = (data) => {
    if (data.status) {
      // ADDED on 1/9/22
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setValues({
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
      console.log("SUCCESS");
      setModalSetting("password");
    } else {
      console.log("Inside handleConfirmation false");
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("confirmation");
      console.log("ERROR: ", data.error);
    }
  };

  const showError = () => {
    if (error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {message}
        </div>
      );
    } else if (modalSetting === "confirmation" && !resent) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Enter the 6-digit code sent to your email:
        </div>
      );
    } else if (modalSetting === "confirmation" && resent) {
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
                closeModal();
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
