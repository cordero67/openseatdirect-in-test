import React, { useState, useEffect, Fragment } from "react";
import OpennodeDisplay from "../../../Authentication/Components/OpennodeDisplay";

import { API } from "../../../config";

import Backdrop from "./Backdrop";
import classes from "./ResetModal.module.css";

const Opennode = (props) => {
  console.log("props: ", props);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [subValues, setSubValues] = useState({
    inputError: "",
    opennode_invoice_API_KEY: "", // vendors opennode api key
    opennode_auto_settle: "", // vendors request convesion to USD or keep in BTC?
    opennode_dev: "", // Boolean: dev=true for testnet BTC
  });

  const [authValues, setAuthValues] = useState({
    name: "",
    email: "",
    password: "",
    vendorIntent: "",
    temporary: "",
    reissued: false,
    confirmation: "",
    resent: false,
    username: "",
    resetToken: "",
    sessionToken: "",
    userId: "",
    accountNum: "",
  });

  const {
    name,
    email,
    password,
    temporary,
    reissued,
    confirmation,
    resent,
    username,
    resetToken,
    sessionToken,
    userId,
    accountNum,
  } = authValues;

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));

      let tempValues = { ...subValues };
      tempValues.opennode_invoice_API_KEY =
        tempUser.user.accountId.opennode_invoice_API_KEY; // vendors opennode api key
      tempValues.opennode_auto_settle =
        tempUser.user.accountId.opennode_auto_settle; // vendors request convesion to USD or keep in BTC?
      tempValues.opennode_dev = tempUser.user.accountId.opennode_dev;

      console.log("tempValues: ", tempValues);
      setSubValues(tempValues);
    }
  }, []);

  // THIS ASSIGNS THE "paypal_plan_id" VARIABLE TO THE SELECTED PLAN
  const radioChangeSubValues = (event, value, name) => {
    let tempSubValues = { ...subValues };
    tempSubValues[name] = value.value;
    tempSubValues.paypal_plan_id = value.value;
    setSubValues(tempSubValues);
  };

  const handleSubValueChange = (event) => {
    setSubValues({
      ...subValues,
      [event.target.name]: event.target.value,
    });
  };

  const opennodeDisplay2 = () => {
    ////if (display === "opennode") {
    return (
      <OpennodeDisplay
        authOrigin={false}
        close={() => {
          setSubmissionStatus({
            message: "",
            error: false,
          });
          if (
            typeof window !== "undefined" &&
            localStorage.getItem(`user`) !== null
          ) {
            let tempUser = JSON.parse(localStorage.getItem("user"));

            let tempValues = { ...subValues };
            tempValues.opennode_invoice_API_KEY =
              tempUser.user.accountId.opennode_invoice_API_KEY; // vendors opennode api key
            tempValues.opennode_auto_settle =
              tempUser.user.accountId.opennode_auto_settle; // vendors request convesion to USD or keep in BTC?
            tempValues.opennode_dev = tempUser.user.accountId.opennode_dev;

            console.log("tempValues: ", tempValues);
            setSubValues(tempValues);
          }
          props.closeModal();
        }}
        error={error}
        message={message}
        apiKey={subValues.opennode_invoice_API_KEY}
        settle={subValues.opennode_auto_settle}
        dev={subValues.opennode_dev}
        sessionToken={authValues.sessionToken}
        accountNum={authValues.accountNum}
        spinner={showSpinner}
        //spinner={true}
        inputChange={handleSubValueChange}
        spinnerChange={(value) => setShowSpinner(value)}
        ////modalChange={(modal) => setDisplay(modal)}
        submission={(input) => {
          setSubmissionStatus(input);
        }}
        radioChange={(event, value, message) => {
          radioChangeSubValues(event, value, message);
        }}
        ////redirect={() => redirectUser()}
      ></OpennodeDisplay>
    );
    ////} else {
    ////  return null;
    ////}
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
        {opennodeDisplay2()}
        {/*errorDisplay()*/}
      </div>
    </Fragment>
  );
};
export default Opennode;
