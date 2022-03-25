import React, { useState, useEffect, Fragment } from "react";

import { API } from "../../../config";

import Backdrop from "./Backdrop";
import classes from "./ResetModal.module.css";

const Reset = (props) => {
  const [values, setValues] = useState({
    password: "",
    confirmation: "",
    resent: false,
    resetToken: "",
    sessionToken: "",
    userId: "",
  });

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [modalSetting, setModalSetting] = useState("confirmation"); // confirmation, password, error
  const { password, confirmation, resent, resetToken, sessionToken, userId } =
    values;
  // LOOKS GOOD
  const getStatus = (user) => {
    if ("accountId" in user && "status" in user.accountId) {
      return user.accountId.status;
    } else {
      return 0;
    }
  };

  // LOOKS GOOD
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempValues = { ...values };
      tempValues.sessionToken = tempUser.token;
      tempValues.userId = tempUser.user._id;
      setValues(tempValues);
    } else {
      window.location.href = "/auth";
    }
  }, []);
  // LOOKS GOOD
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };
  // LOOKS GOOD
  const submitConfirmation = () => {
    console.log("values: ", values);
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${values.sessionToken}`);
    let url = `${API}/auth/password/confirmcode`;
    let information = {
      confirm_code: confirmation,
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
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleConfirmation(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };
  // LOOKS GOOD
  const submitPassword = () => {
    console.log("values: ", values);
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${values.sessionToken}`);
    let url = `${API}/auth/password/new`;
    let information = {
      passwordToken: resetToken,
      password: password,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url);
    console.log("fetching body: ", fetchBody);
    console.log("Information: ", information);
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
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };
  // LOOKS GOOD
  const submitExpired = () => {
    console.log("values: ", values);
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${values.sessionToken}`);
    let url = `${API}/auth/password/sendcode`;
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("url: ", url);
    console.log("fetcharg: ", fetchBody);

    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleExpired(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  // LOOKS GOOD
  const submitResend = () => {
    console.log("values: ", values);
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${values.sessionToken}`);
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
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  const handleConfirmation = (data) => {
    if (data.status) {
      let tempValues = { ...values };
      tempValues.resetToken = data.user.passwordToken;
      setValues(tempValues);
      console.log("SUCCESS");
      setModalSetting("password");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

  // LOOKS GOOD
  const handlePassword = (data) => {
    if (data.status) {
      console.log("SUCCESS");
      closeModal();
    } else {
      if (data.code === 202) {
        console.log("Status 202 Error");
        setModalSetting("expired");
      } else {
        setSubmissionStatus({
          message: data.error,
          error: true,
        });
        console.log("ERROR: ", data.error);
      }
    }
  };
  const handleExpired = (data) => {
    if (data.status) {
      resetValues();
      console.log("SUCCESS");
      setModalSetting("confirmation");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };
  // LOOKS GOOD
  const resetValues = () => {
    let tempValues = {
      password: "",
      confirmation: "",
      resent: false,
      resetToken: "",
      sessionToken: values.sessionToken,
      userId: values.userId,
    };
    setValues(tempValues);
  };
  // LOOKS GOOD
  const handleResend = (data) => {
    if (data.status) {
      let tempValues = { ...values };
      tempValues.confirmation = "";
      tempValues.resent = true;
      setValues(tempValues);
      console.log("SUCCESS");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };
  // LOOKS GOOD
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  // LOOKS GOOD
  const showError = () => {
    if (error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {message}
        </div>
      );
    } else if (modalSetting === "password") {
      return null;
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

  const confirmationForm = (
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
          className={classes.OSDBlueButton}
          onClick={() => {
            submitConfirmation();
          }}
        >
          Submit your code
        </button>
      </div>
    </Fragment>
  );

  const passwordForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Password</label>
        <input
          className={classes.InputBox}
          type="text"
          name="password"
          onChange={handleChange}
          value={password}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.OSDBlueButton}
          onClick={() => {
            console.log("clicked submit button");
            submitPassword();
          }}
        >
          Register your password
        </button>
      </div>
    </Fragment>
  );

  const expiredForm = (
    <Fragment>
      <div style={{ width: "100%", paddingBottom: "10px", fontSize: "16px" }}>
        Would you still like to set your password?
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.OSDBlueButton}
          onClick={() => {
            console.log("clicked yes button");
            submitExpired();
          }}
        >
          Yes resend code
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            closeModal();
          }}
        >
          Not at this time
        </button>
      </div>
    </Fragment>
  );

  const errorForm = (
    <Fragment>
      <div
        style={{
          fontSize: "16px",
          color: "red",
          paddingBottom: "20px",
          width: "340px",
          height: "40px",
        }}
      >
        Please try again later
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            closeModal();
          }}
        >
          Continue
        </button>
      </div>
    </Fragment>
  );

  const alternateConfirmationInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            submitResend();
          }}
        >
          Resend code
        </button>
      </div>
    </div>
  );
  // LOOKS GOOD
  const closeModal = () => {
    resetValues();
    setSubmissionStatus({
      message: "",
      error: false,
    });
    setModalSetting(props.start);
    props.closeModal();
  };

  const confirmationDisplay = () => {
    if (modalSetting === "confirmation") {
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
    } else return null;
  };

  const passwordDisplay = () => {
    if (modalSetting === "password") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Create your password</div>
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
            {passwordForm}
          </div>
        </div>
      );
    } else return null;
  };

  const expiredDisplay = () => {
    if (modalSetting === "expired") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Time expired</div>
          </div>
          <div>
            {showError()}
            {expiredForm}
          </div>
        </div>
      );
    } else return null;
  };

  const errorDisplay = () => {
    if (modalSetting === "error") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>System Error</div>
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
          <div>{errorForm}</div>
        </div>
      );
    } else return null;
  };

  return (
    <Fragment>
      <Backdrop show={props.show} clicked={null}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
          fontSize: "20px",
        }}
        className={classes.Modal}
      >
        {confirmationDisplay()}
        {passwordDisplay()}
        {expiredDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};

export default Reset;
