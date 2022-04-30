import React, { Fragment } from "react";

import classes from "./Components.module.css";

const FreeDisplay = (props) => {
  const topDisplay = (
    <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
      <div>You now have a Free Forever Plan!</div>
      <div style={{ lineHeight: "25px" }}>
        You can issue an unlimited amount of free tickets.
      </div>
      <div>
        More details on this plan{" "}
        <a
          className={classes.BlueText}
          href="https://www.openseatdirect.com/#pricing-plans"
          target="blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </div>
    </div>
  );

  const freeForm = (
    <Fragment>
      <div className={classes.Header}>
        <div>Success!</div>
      </div>
      {topDisplay}
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonBlue}
          onClick={() => {
            props.displayChange("gateway");
            console.log("going to gateway");
          }}
        >
          Upgrade to Pro Plan
        </button>
      </div>
      <div style={{ paddingTop: "20px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Continue
        </button>
      </div>
    </Fragment>
  );

  const closeIcon = () => {
    return (
      <div className={classes.CloseIcon}>
        {props.authOrigin !== true ? (
          <ion-icon
            name="close-circle-outline"
            cursor="pointer"
            onClick={() => {
              props.close();
            }}
          />
        ) : null}
      </div>
    );
  };

  return (
    <Fragment>
      {closeIcon()}
      <div className={classes.BlankCanvas}>{freeForm}</div>
    </Fragment>
  );
};

export default FreeDisplay;
