import React, { useState, Fragment } from "react";

import SignInDisplay from "./Components/SignInDisplay";
import ForgotDisplay from "./Components/ForgotDisplay";
import ConfirmTempDisplay from "./Components/ConfirmTempDisplay";
import SignUpDisplay from "./Components/SignUpDisplay";
import ConfirmationDisplay from "./Components/ConfirmInitialDisplay";
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
    resetToken: "",
    accountNum: "",
  });

  const {
    email,
    password,
    temporary,
    reissued,
    expired,
    confirmation,
    resent,
    resetToken,
  } = values;

  const [redirect, setRedirect] = useState("");

  const [modalDisplay, setModalDisplay] = useState(props.start); // signin, forgot, temporary, signup, confirmation, password, error

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
      resetToken: "",
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
    setModalDisplay(props.start);
    props.closeModal();
  };

  const signInDisplay = () => {
    if (modalDisplay === "signin") {
      return (
        <SignInDisplay
          authOrigin={false}
          close={closeModal}
          expired={expired}
          email={email}
          password={password}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
          showError={() => {
            console.log("showError");
            setRedirect("signin");
            setModalDisplay("error");
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
          authOrigin={false}
          close={closeModal}
          expired={expired}
          email={email}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
          showError={() => {
            console.log("showError");
            setRedirect("forgot");
            setModalDisplay("error");
          }}
          values={(input) => setValues(input)}
          resetValues={() => resetValues()}
        ></ForgotDisplay>
      );
    } else {
      return null;
    }
  };

  const confirmTempDisplay = () => {
    if (modalDisplay === "temporary") {
      console.log("TEMPORARY");
      return (
        <ConfirmTempDisplay
          authOrigin={false}
          close={closeModal}
          expired={expired}
          email={email}
          reissued={reissued}
          temporary={temporary}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
          showError={() => {
            console.log("showError");
            setRedirect("temporary");
            setModalDisplay("error");
          }}
          values={(input) => setValues(input)}
          resetValues={() => resetValues()}
          submit={() => props.submit()}
        ></ConfirmTempDisplay>
      );
    } else {
      return null;
    }
  };

  const signUpDisplay = () => {
    if (modalDisplay === "signup") {
      return (
        <SignUpDisplay
          authOrigin={false}
          close={closeModal}
          expired={expired}
          email={email}
          password={password}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("signup");
            setModalDisplay("error");
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
          authOrigin={false}
          update={false}
          close={closeModal}
          expired={expired}
          email={email}
          resent={resent}
          confirmation={confirmation}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("confirmation");
            setModalDisplay("error");
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
          authOrigin={false}
          close={closeModal}
          expired={expired}
          email={email}
          password={password}
          resetToken={resetToken}
          spinner={showSpinner}
          inputChange={handleChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setModalDisplay(modal)}
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("password");
            setModalDisplay("error");
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
      return (
        <ErrorDisplay
          redirect={redirect}
          //initial={initialView} // NOT IN MODAL
          now={() => {
            console.log("NOW");
            setModalDisplay(redirect);
          }}
          later={() => {
            if (
              redirect === "signin" ||
              redirect === "forgot" ||
              redirect === "temporary" ||
              redirect === "signup" ||
              redirect === "confirmation" ||
              redirect === "password"
            ) {
              closeModal();
            }
          }}
        ></ErrorDisplay>
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
        {signInDisplay()}
        {forgotDisplay()}
        {confirmTempDisplay()}
        {signUpDisplay()}
        {confirmationDisplay()}
        {passwordDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};

export default Authentication;
