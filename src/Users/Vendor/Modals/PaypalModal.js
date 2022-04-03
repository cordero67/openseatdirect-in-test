import React, { useState, useEffect, Fragment } from "react";
import PaypalDisplay from "../../../Authentication/Components/PaypalDisplay";
import ErrorDisplay from "../../../Authentication/Components/ErrorDisplay";

import Backdrop from "./Backdrop";
import classes from "./OpennodeModal.module.css";
import Spinner from "../../../components/UI/Spinner/Spinner";

import { PAYPAL_USE_SANDBOX } from "../../../config";

const PaypalExpress = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

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

  const handleSubValueChange = (event) => {
    setSubValues({
      ...subValues,
      [event.target.name]: event.target.value,
    });
  };

  const closeModal = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    //initializeSubValues();
    props.closeModal();
  };

  const errorForm = () => {
    return (
      <Fragment>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.ButtonBlue}
            onClick={() => {
              //console.log("redirect: ", redirectDisplay);
              //setRedirectDisplay("");
              setDisplay("paypal");
            }}
          >
            TRY AGAIN NOW
          </button>
        </div>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.ButtonGrey}
            onClick={() => {
              closeModal();
            }}
          >
            TRY AGAIN LATER
          </button>
        </div>
      </Fragment>
    );
  };

  const errorDisplay2 = () => {
    let height = {};
    if (!error) {
      height = { height: "164px" };
    }
    if (display === "error") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas}>
            <div className={classes.Header}>
              <div>System Error</div>
            </div>
            <div>{errorForm()}</div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const paypalDisplay = () => {
    if (display === "paypal") {
      return (
        <PaypalDisplay
          authOrigin={false}
          close={() => {
            closeModal();
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
          showError={(display) => {
            console.log("showError");
            setDisplay("error");
          }}
          //displayChange={(modal) => setDisplay(modal)} NOT IN MODAL
          submit={() => {
            closeModal();
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
