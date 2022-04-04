import React, { useState, useEffect, Fragment } from "react";
import OpennodeDisplay from "../../../Authentication/Components/OpennodeDisplay";
import ErrorDisplay from "../../../Authentication/Components/ErrorDisplay";

import Backdrop from "./Backdrop";
import classes from "./AccountModal.module.css";

const Opennode = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const [subValues, setSubValues] = useState({
    accountNum: "",
    sessionToken: "",
  });

  const [display, setDisplay] = useState("opennode"); // spinner, signin, forgot, temporary, signup, confirmation, password, error

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
      setDisplay("opennode");
    }
  };

  useEffect(() => {
    initializeSubValues();
  }, []);

  const closeModal = () => {
    props.closeModal();
  };

  const opennodeDisplay = () => {
    if (display === "opennode") {
      return (
        <OpennodeDisplay
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
          }} ////displayChange={(modal) => setDisplay(modal)} NOT IN MODAL
          submit={() => {
            props.closeModal();
          }}
          //redirect={() => {setDefaultValues()}} NOT IN MODAL
        ></OpennodeDisplay>
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
            setDisplay("opennode");
          }}
          later={() => {
            console.log("LATER");
            closeModal();
            setDisplay("opennode");
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
        {opennodeDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};
export default Opennode;
