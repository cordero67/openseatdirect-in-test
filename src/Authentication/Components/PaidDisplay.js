import React, { Fragment } from "react";

import classes from "./Components.module.css";

const PaidDisplay = (props) => {
  const topDisplay = (
    <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
      <div>You now have a Pro Plan!</div>
      <div style={{ lineHeight: "25px" }}>
        You can issue an unlimited amount of free tickets.
      </div>
      <div>
        More details on this plan{" "}
        <a
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

  const paidForm = (
    <Fragment>
      <div className={classes.Header}>Success!!!!</div>
      {topDisplay}
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            if (props.initial !== "create") {
              window.location.href = "/";
            } else {
              window.location.href = "/createevent";
            }
          }}
        >
          Finish
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
      <div className={classes.BlankCanvas}>
        <div>{paidForm}</div>
      </div>
    </Fragment>
  );
};

export default PaidDisplay;
