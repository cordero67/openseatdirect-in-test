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
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            window.location.href = "/myaccount";
          }}
        >
          Go to my Dashboard
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
        {paidForm}
      </div>
    </div>
  );
};

export default PaidDisplay;
