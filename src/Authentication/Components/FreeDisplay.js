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
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonBlue}
          onClick={() => {
            props.displayChange("gateway");
          }}
        >
          Upgrade to Pro Plan
        </button>
      </div>
      <div style={{ paddingTop: "20px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            window.location.href = "/myaccount";
          }}
        >
          Go to My Dashboard
        </button>
      </div>
    </Fragment>
  );

  return (
    <div className={classes.BlankCanvas}>
      <div className={classes.Header}>
        <div>Success!</div>
      </div>
      <div>
        {topDisplay}
        {freeForm}
      </div>
    </div>
  );
};

export default FreeDisplay;
