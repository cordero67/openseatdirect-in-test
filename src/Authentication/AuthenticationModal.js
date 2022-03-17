import React, { useState, Fragment } from "react";

import SignInDisplay from "./Components/SignInDisplay";
import ForgotDisplay from "./Components/ForgotDisplay";
import TemporaryDisplay from "./Components/TemporaryDisplay";
import SignUpDisplay from "./Components/SignUpDisplay";
import ConfirmationDisplay from "./Components/ConfirmationDisplay";
import PasswordDisplay from "./Components/PasswordDisplay";
import ErrorDisplay from "./Components/ErrorDisplay";

import Backdrop from "./Backdrop";
import classes from "./AuthenticationModal.module.css";

const Authentication = (props) => {
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

  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });

  const { message, error } = submissionStatus;

  const [modalSetting, setModalSetting] = useState(props.start); // signin, forgot, temporary, signup, confirmation, password, username, error

  const [showSpinner, setShowSpinner] = useState(false);

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

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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

  const signInDisplay = () => {
    if (modalSetting === "signin") {
      return (
        <SignInDisplay
          close={closeModal}
          email={email}
          error={error}
          expired={expired}
          authOrigin={false}
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
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
          resetValues={() => resetValues()}
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
          reissued={reissued}
          temporary={temporary}
          message={message}
          error={error}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
          submit={() => props.submit()}
        ></TemporaryDisplay>
      );
    } else {
      return null;
    }
  };

  const signUpDisplay = () => {
    if (modalSetting === "signup") {
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
          username={username}
          error={error}
          message={message}
          resent={resent}
          confirmation={confirmation}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          modalChange={(modal) => setModalSetting(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setValues(input)}
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
          message={message}
          password={password}
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
          submit={() => props.submit()}
        ></PasswordDisplay>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    if (modalSetting === "error") {
      return <ErrorDisplay close={closeModal}></ErrorDisplay>;
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
