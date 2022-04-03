import React, { useState, useEffect, Fragment } from "react";
import OpennodeDisplay from "../../../Authentication/Components/OpennodeDisplay";

import Backdrop from "./Backdrop";
import classes from "./OpennodeModal.module.css";

const Opennode = (props) => {
  console.log("props: ", props);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [subValues, setSubValues] = useState({
    opennode_invoice_API_KEY: "", // vendors opennode api key
    opennode_auto_settle: "", // vendors request convesion to USD or keep in BTC?
    opennode_dev: "", // Boolean: dev=true for testnet BTC
    accountNum: "",
  });

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
      tempValues.accountNum = tempUser.user.accountId.accountNum;
      tempValues.sessionToken = tempUser.token;
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

  const opennodeDisplay = () => {
    return (
      <OpennodeDisplay
        authOrigin={false}
        close={() => props.closeModal()}
        //initial={initialView} // NOT IN MODAL
        error={error}
        message={message}
        dev={subValues.opennode_dev}
        sessionToken={subValues.sessionToken}
        accountNum={subValues.accountNum}
        spinner={showSpinner}
        inputChange={handleSubValueChange}
        spinnerChange={(value) => setShowSpinner(value)}
        ////displayChange={(modal) => setDisplay(modal)} NOT IN MODAL
        submission={(input) => {
          setSubmissionStatus(input);
        }}
        submit={() => {
          props.closeModal();
        }}
        //redirect={() => {setDefaultValues()}} NOT IN MODAL
      ></OpennodeDisplay>
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
        {opennodeDisplay()}
        {/*errorDisplay()*/}
      </div>
    </Fragment>
  );
};
export default Opennode;
