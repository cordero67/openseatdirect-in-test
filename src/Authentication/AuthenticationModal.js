import React, { useState, Fragment } from "react";

import SignInDisplay from "./Components/SignInDisplay";
import ForgotDisplay from "./Components/ForgotDisplay";
import TemporaryDisplay from "./Components/TemporaryDisplay";
import SignUpDisplay from "./Components/SignUpDisplay";
import ConfirmationDisplay from "./Components/ConfirmationDisplay";
import PasswordDisplay from "./Components/PasswordDisplay";
import ErrorDisplay from "./Components/ErrorDisplay";

import Backdrop from "../components/UI/Backdrop/Backdrop";
import classes from "./AuthenticationModal.module.css";

const Authentication = (props) => {
  const [values, setValues] = useState({
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
    redirect: "",
  });

  const { message, error, redirect } = submissionStatus;

  const [modalDisplay, setModalDisplay] = useState(props.start); // signin, forgot, temporary, signup, confirmation, password, username, error

  const [showSpinner, setShowSpinner] = useState(false);

  const resetValues = () => {
    setValues({
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
    setModalDisplay(props.start);
    props.closeModal();
  };

  const signInDisplay = () => {
    if (modalDisplay === "signin") {
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
          displayChange={(modal) => setModalDisplay(modal)}
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
    if (modalDisplay === "forgot") {
      return (
        <ForgotDisplay
          close={closeModal}
          email={email}
          error={error}
          expired={expired}
          authOrigin={false}
          message={message}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
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
    if (modalDisplay === "temporary") {
      console.log("TEMPORARY");
      return (
        <TemporaryDisplay
          close={closeModal}
          email={email}
          reissued={reissued}
          temporary={temporary}
          message={message}
          error={error}
          authOrigin={false}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
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
    if (modalDisplay === "signup") {
      return (
        <SignUpDisplay
          close={closeModal}
          email={email}
          error={error}
          authOrigin={false}
          expired={expired}
          message={message}
          password={password}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
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
    if (modalDisplay === "confirmation") {
      return (
        <ConfirmationDisplay
          close={closeModal}
          email={email}
          username={username}
          error={error}
          message={message}
          authOrigin={false}
          resent={resent}
          confirmation={confirmation}
          spinner={showSpinner}
          inputChange={handleChange}
          //updateSub={updateSubValues} NOT IN MODAL
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
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
    if (modalDisplay === "password") {
      return (
        <PasswordDisplay
          close={closeModal}
          email={email}
          username={username}
          error={error}
          message={message}
          authOrigin={false}
          password={password}
          resetToken={resetToken}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
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
    if (modalDisplay === "error") {
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
