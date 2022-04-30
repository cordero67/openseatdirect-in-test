import React, { useState, useEffect, Fragment } from "react";
import ConfirmUpdateDisplay from "../../../Authentication/Components/ConfirmUpdateDisplay";
import ResetDisplay from "../../../Authentication/Components/ResetDisplay";
import ErrorDisplay from "../../../Authentication/Components/ErrorDisplay";

import Backdrop from "./Backdrop";
import classes from "./AccountModals.module.css";

const Reset = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const [display, setDisplay] = useState("confirmUpdate"); // spinner, signin, forgot, temporary, signup, confirmation, password, error

  const [values, setValues] = useState({
    email: "",
    password: "",
    temporary: "",
    reissued: false,
    confirmation: "",
    resent: false,
    resetToken: "",
    expired: "",
    sessionToken: "",
    accountNum: "",
  });

  const [redirect, setRedirect] = useState("");

  const {
    email,
    password,
    temporary,
    reissued,
    confirmation,
    resent,
    resetToken,
    expired,
    sessionToken,
    accountNum,
  } = values;

  // LOOKS GOOD
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempValues = { ...values };
      tempValues.sessionToken = tempUser.token;
      setValues(tempValues);
    } else {
      window.location.href = "/auth";
    }
  }, []);

  // LOOKS GOOD
  const resetValues = () => {
    let tempValues = {
      password: "",
      confirmation: "",
      resent: false,
      resetToken: "",
      sessionToken: values.sessionToken,
    };
    setValues(tempValues);
  };

  // LOOKS GOOD
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // LOOKS GOOD
  const closeModal = () => {
    resetValues();
    setDisplay("confirmUpdate");
    props.closeModal();
  };

  const confirmUpdateDisplay = () => {
    if (display === "confirmUpdate") {
      return (
        <ConfirmUpdateDisplay
          close={closeModal} //
          sessionToken={sessionToken} //
          email={email} //
          accountNumber={accountNum} //
          resent={resent} //
          confirmation={confirmation} //
          spinner={showSpinner} //
          inputChange={handleChange} //
          spinnerChange={(value) => setShowSpinner(value)} //
          displayChange={(modal) => setDisplay(modal)} //
          showError={() => {
            //
            console.log("showError");
            setRedirect("confirmUpdate");
            setDisplay("error");
          }}
          values={(input) => setValues(input)} //
        ></ConfirmUpdateDisplay>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    if (display === "error") {
      return (
        <ErrorDisplay
          redirect={redirect}
          now={() => {
            console.log("NOW");
            setDisplay(redirect);
          }}
          later={() => {
            console.log("LATER");
            closeModal();
          }}
        ></ErrorDisplay>
      );
    } else {
      return null;
    }
  };

  const resetDisplay = () => {
    if (display === "reset") {
      return (
        <ResetDisplay
          authOrigin={true}
          close={closeModal} //
          password={password} //
          resetToken={resetToken} //
          sessionToken={sessionToken} //
          spinner={showSpinner} //
          inputChange={handleChange} //
          spinnerChange={(value) => setShowSpinner(value)} //
          displayChange={(modal) => setDisplay(modal)} //
          showError={() => {
            //
            console.log("showError");
            setRedirect("reset");
            setDisplay("error");
          }}
        ></ResetDisplay>
      );
    } else {
      return null;
    }
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
        {confirmUpdateDisplay()}
        {resetDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};

export default Reset;
