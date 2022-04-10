import React, { Fragment } from "react";

import classes from "./Components.module.css";

const ErrorDisplay = (props) => {
  console.log("props: ", props);
  const buttonText = () => {
    if (
      props.redirect === "signin" ||
      props.redirect === "forgot" ||
      props.redirect === "temporary"
    ) {
      return "Log in Later";
    } else if (
      props.redirect === "signup" ||
      props.redirect === "confirmation" ||
      props.redirect === "password"
    ) {
      return "Signup Later";
    } else if (
      props.redirect === "gateway" ||
      props.redirect === "opennode" ||
      props.redirect === "paypal" ||
      props.redirect === "subscriptions"
    ) {
      if (props.initial === "upgrade") {
        return "Upgrade Later";
      } else {
        return "Stay with Free Forever Plan";
      }
    } else if (
      props.redirect === "confirmUpdate" ||
      props.redirect === "reset"
    ) {
      return "Update Later";
    } else {
      return "Try Later";
    }
  };

  const errorForm = () => {
    console.log("INSIDE NEW EEROR FORM");
    return (
      <Fragment>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.ButtonBlue}
            onClick={() => {
              props.now();
            }}
          >
            Try Again Now
          </button>
        </div>
        <div style={{ paddingTop: "20px" }}>
          <button
            className={classes.ButtonGrey}
            onClick={() => {
              props.later();
            }}
          >
            {buttonText()}
          </button>
        </div>
      </Fragment>
    );
  };

  return (
    <div className={classes.BlankCanvas}>
      <div className={classes.Header}>
        <div>System Error</div>
      </div>
      <div>{errorForm()}</div>
    </div>
  );
};

export default ErrorDisplay;
