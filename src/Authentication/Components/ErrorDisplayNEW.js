import React, { Fragment } from "react";

import classes from "./ComponentsNEW.module.css";

const ErrorDisplay = (props) => {
  console.log("props: ", props);
  const buttonText = () => {
    if (
      props.redirect === "signin" ||
      props.redirect === "forgot" ||
      props.redirect === "temporary"
    ) {
      return "Log in later";
    } else if (
      props.redirect === "signup" ||
      props.redirect === "confirmation" ||
      props.redirect === "password"
    ) {
      return "Signup later";
    } else if (
      props.redirect === "gateway" ||
      props.redirect === "opennode" ||
      props.redirect === "paypal" ||
      props.redirect === "subscriptions"
    ) {
      if (props.initial === "upgrade") {
        return "Upgrade later";
      } else {
        return "Stay with Free Forever Plan";
      }
    } else if (
      props.redirect === "confirmUpdate" ||
      props.redirect === "reset"
    ) {
      return "Update later";
    } else {
      return "Try later";
    }
  };

  const errorForm = () => {
    console.log("INSIDE NEW EEROR FORM");
    return (
      <Fragment>
        <div className={classes.ErrorHeader}>System Error</div>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.ButtonBlue}
            onClick={() => {
              props.now();
            }}
          >
            Try again now
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
      <div>{errorForm()}</div>
    </div>
  );
};

export default ErrorDisplay;
