import React, { useState, useEffect, Fragment } from "react";
import OrganizationDisplay from "../../../Authentication/Components/OrganizationDisplay";
import ErrorDisplay from "../../../Authentication/Components/ErrorDisplayNEW";

import Backdrop from "./Backdrop";
import classes from "./AccountModals.module.css";

const Organization = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const [subValues, setSubValues] = useState({
    accountNum: "",
    sessionToken: "",
  });

  const [display, setDisplay] = useState("paypal"); // spinner, signin, forgot, temporary, signup, confirmation, password, error

  const initializeSubValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("user" in tempUser && "accountId" in tempUser.user) {
        let tempSubValues = {};
        if (tempUser.user.firstname) {
          tempSubValues.firstName = tempUser.user.firstname;
        } else {
          tempSubValues.firstName = "";
        }
        if (tempUser.user.lastname) {
          tempSubValues.lastName = tempUser.user.lastname;
        } else {
          tempSubValues.lastName = "";
        }
        if (tempUser.user.username) {
          tempSubValues.userName = tempUser.user.username;
        } else {
          tempSubValues.userName = "";
        }
        if (tempUser.user.username) {
          tempSubValues.userId = tempUser.user._id;
        } else {
          tempSubValues.userName = "";
        }
        if (tempUser.user.sessionToken) {
          tempSubValues.userId = tempUser.token;
        } else {
          tempSubValues.sessionToken = "";
        }
        setSubValues(tempSubValues);
        console.log("tempSubValues: ", tempSubValues);
      }
    } else {
      console.log("no user object");
    }
  };

  useEffect(() => {
    initializeSubValues();
  }, []);

  const organizationDisplay = () => {
    if (display === "paypal") {
      return (
        <OrganizationDisplay
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
        ></OrganizationDisplay>
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
        {organizationDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};
export default Organization;
