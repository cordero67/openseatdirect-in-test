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
      console.log("returning log in later");
      return "LOG IN LATER";
    } else if (
      props.redirect === "signup" ||
      props.redirect === "confirmation" ||
      props.redirect === "password"
    ) {
      console.log("returning sign up later");
      return "SIGNUP LATER";
    } else if (
      props.redirect === "gateway" ||
      props.redirect === "opennode" ||
      props.redirect === "paypal" ||
      props.redirect === "subscriptions"
    ) {
      console.log("OTHER");
      if (props.initial === "upgrade") {
        console.log("upgrade later");
        return "UPGRADE LATER";
      } else {
        console.log("free forever");
        return "STAY WITH FREE FOREVER PLAN";
      }
    } else {
      console.log("OTHER");
      return "TRY AGAIN LATER";
    }
  };

  const errorForm = () => {
    console.log("INSIDE NEW EEROR FORM");
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
            TRY AGAIN NOW
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
