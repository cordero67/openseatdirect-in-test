import React, { useState, useEffect, Fragment } from "react";
import PaypalDisplay from "../../../Authentication/Components/PaypalDisplayNEW";
import ErrorDisplay from "../../../Authentication/Components/ErrorDisplayNEW";

import Backdrop from "./Backdrop";
import classes from "./AccountModals.module.css";

const PaypalExpress = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const [subValues, setSubValues] = useState({
    accountNum: "",
    sessionToken: "",
  });

  const [display, setDisplay] = useState("paypal"); // spinner, signin, forgot, temporary, signup, confirmation, password, error

  const initializeSubValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));

      let tempValues = { ...subValues };
      tempValues.accountNum = tempUser.user.accountId.accountNum;
      tempValues.sessionToken = tempUser.token;
      console.log("tempValues: ", tempValues);
      setSubValues(tempValues);
      setDisplay("paypal");
    }
  };

  useEffect(() => {
    initializeSubValues();
  }, []);

  const paypalDisplay = () => {
    if (display === "paypal") {
      return (
        <PaypalDisplay
          authOrigin={false}
          close={() => {
            props.closeModal();
          }}
          //initial={initialView} // NOT IN MODAL
          sessionToken={subValues.sessionToken}
          accountNum={subValues.accountNum}
          spinner={showSpinner}
          spinnerChange={(value) => setShowSpinner(value)}
          showError={() => {
            console.log("showError");
            setDisplay("error");
          }}
          //displayChange={(modal) => setDisplay(modal)} NOT IN MODAL
          submit={() => {
            props.closeModal();
          }}
          //redirect={() => {closeModal()}} NOT IN MODAL
        ></PaypalDisplay>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    if (display === "error") {
      return (
        <ErrorDisplay
          now={() => {
            console.log("NOW");
            setDisplay("paypal");
          }}
          later={() => {
            console.log("LATER");
            props.closeModal();
            setDisplay("paypal");
          }}
        ></ErrorDisplay>
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
        {paypalDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};
export default PaypalExpress;
