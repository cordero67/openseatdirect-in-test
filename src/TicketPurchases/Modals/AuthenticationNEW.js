import React, { useState, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import SignInDisplay from "./Components/SignInDisplay";
import ForgotDisplay from "./Components/ForgotDisplay";
import TemporaryDisplay from "./Components/TemporaryDisplay";
import SignUpDisplay from "./Components/SignUpDisplay";
import ConfirmationDisplay from "./Components/ConfirmationDisplay";
import PasswordDisplay from "./Components/PasswordDisplay";

import Backdrop from "./Backdrop";
import classes from "./Authentication.module.css";

const Authentication = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const [values, setValues] = useState({
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

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });

  const [modalSetting, setModalSetting] = useState(props.start); // signin, forgot, temporary, signup, confirmation, password, username, error

  const {
    name,
    email,
    password,
    temporary,
    reissued,
    expired,
    confirmation,
    resent,
    username,
    resetToken,
    sessionToken,
    userId,
  } = values;

  const { message, error } = submissionStatus;

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
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
      email: email,
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
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
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
      email: email,
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
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  const handleReissue = (data) => {
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: true,
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

  const resetValues = () => {
    setValues({
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
  };

  const handleResend = (data) => {
    if (data.status) {
      //localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: true,
        username: username,
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

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
          CONTINUE
        </button>
      </div>
    </Fragment>
  );

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
    } else {
      return null;
    }
  };

  const closeModal = () => {
    resetValues();
    setSubmissionStatus({
      message: "",
      error: false,
    });
    setModalSetting(props.start);
    props.closeModal();
  };

  const spinnerDisplay = () => {
    if (modalSetting === "spinner") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <Spinner />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const signInDisplay = () => {
    if (modalSetting === "signin") {
      return (
        <SignInDisplay
          close={closeModal}
          email={email}
          error={error}
          expired={expired}
          message={message}
          password={password}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
          resetValues={() => resetValues()}
          submit={() => props.submit()}
        ></SignInDisplay>
      );
    } else {
      return null;
    }
  };

  const forgotDisplay = () => {
    if (modalSetting === "forgot") {
      return (
        <ForgotDisplay
          close={closeModal}
          email={email}
          error={error}
          expired={expired}
          message={message}
          password={password}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
          resetValues={() => resetValues()}
          submit={() => props.submit()}
        ></ForgotDisplay>
      );
    } else {
      return null;
    }
  };

  const temporaryDisplay = () => {
    if (modalSetting === "temporary") {
      console.log("TEMPORARY");
      return (
        <TemporaryDisplay
          close={closeModal}
          email={email}
          error={error}
          expired={expired}
          message={message}
          password={password}
          reissued={reissued}
          temporary={temporary}
          spinner={showSpinner}
          inputChange={handleChange}
          submitReissue={submitReissue}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
          resetValues={() => resetValues()}
          submit={() => props.submit()}
        ></TemporaryDisplay>
      );
    } else {
      return null;
    }
  };

  const signUpDisplay = () => {
    console.log("INSIDE OUTER");
    if (modalSetting === "signup") {
      console.log("INSIDE INNER");
      return (
        <SignUpDisplay
          close={closeModal}
          email={email}
          error={error}
          expired={expired}
          message={message}
          password={password}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
          resetValues={() => resetValues()}
          submit={() => props.submit()}
        ></SignUpDisplay>
      );
    } else {
      return null;
    }
  };

  const confirmationDisplay = () => {
    if (modalSetting === "confirmation") {
      return (
        <ConfirmationDisplay
          close={closeModal}
          email={email}
          error={error}
          expired={expired}
          message={message}
          password={password}
          confirmation={confirmation}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
          submitResend={() => submitResend()}
          resetValues={() => resetValues()}
          submit={() => props.submit()}
        ></ConfirmationDisplay>
      );
    } else {
      return null;
    }
  };

  const passwordDisplay = () => {
    if (modalSetting === "password") {
      return (
        <PasswordDisplay
          close={closeModal}
          email={email}
          error={error}
          expired={expired}
          message={message}
          password={password}
          confirmation={confirmation}
          resetToken={resetToken}
          username={username}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
          submitResend={() => submitResend()}
          resetValues={() => resetValues()}
          submit={() => props.submit()}
        ></PasswordDisplay>
      );
    } else {
      return null;
    }
  };

  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
          fontSize: "20px",
        }}
        className={classes.Modal}
      >
        {spinnerDisplay()}
        {signInDisplay()}
        {forgotDisplay()}
        {temporaryDisplay()}
        {signUpDisplay()}
        {confirmationDisplay()}
        {passwordDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};

export default Authentication;
