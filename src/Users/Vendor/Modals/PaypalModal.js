import React, { useState, useEffect, Fragment } from "react";
import PaypalDisplay from "../../../Authentication/Components/PaypalDisplay";

import Backdrop from "./Backdrop";
import classes from "./OpennodeModal.module.css";
import { PAYPAL_USE_SANDBOX } from "../../../config";

const PaypalExpress = (props) => {
  console.log("props: ", props);
  console.log("Inside PaypalExpress Modal");
  const [showSpinner, setShowSpinner] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [subValues, setSubValues] = useState({
    //paypalExpress_client_id: "",
    //paypalExpress_client_secret: "",
    accountNum: "",
    sessionToken: "",
  });

  const initializeSubValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));

      let tempValues = { ...subValues };
      //tempValues.paypalExpress_client_id =
      //  tempUser.user.accountId.paypalExpress_client_id;
      //tempValues.paypalExpress_client_secret =
      //  tempUser.user.accountId.paypalExpress_client_secret;
      tempValues.accountNum = tempUser.user.accountId.accountNum;
      tempValues.sessionToken = tempUser.token;
      console.log("tempValues: ", tempValues);
      setSubValues(tempValues);
    }
  };

  useEffect(() => {
    initializeSubValues();
  }, []);

  const handleSubValueChange = (event) => {
    setSubValues({
      ...subValues,
      [event.target.name]: event.target.value,
    });
  };

  const setDefaultValues = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });
    initializeSubValues();
    props.closeModal();
  };

  const paypalDisplay = () => {
    return (
      <PaypalDisplay
        authOrigin={false}
        close={() => {
          setDefaultValues();
        }}
        //initial={initialView} // NOT IN MODAL
        error={error}
        message={message}
        sandbox={PAYPAL_USE_SANDBOX}
        sessionToken={subValues.sessionToken}
        accountNum={subValues.accountNum}
        spinner={showSpinner}
        inputChange={handleSubValueChange}
        spinnerChange={(value) => setShowSpinner(value)}
        //displayChange={(modal) => setDisplay(modal)} NOT IN MODAL
        submission={(input) => {
          setSubmissionStatus(input);
        }}
        submit={() => {
          setDefaultValues();
        }}
        //redirect={() => {setDefaultValues()}} NOT IN MODAL
      ></PaypalDisplay>
    );
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
        {/*errorDisplay()*/}
      </div>
    </Fragment>
  );
};
export default PaypalExpress;
