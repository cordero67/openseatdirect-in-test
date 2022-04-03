import React, { Fragment } from "react";

import classes from "../AuthenticationModal.module.css";

const ErrorDisplay = (props) => {
  console.log("props: ", props);

  const errorForm = (
    <Fragment>
      <div
        style={{
          fontSize: "16px",
          color: "red",
          paddingBottom: "20px",
          width: "340px",
          height: "40px",
        }}
      >
        Please try again later
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            props.close();
          }}
        >
          CONTINUE
        </button>
      </div>
    </Fragment>
  );

  return (
    <div className={classes.BlankCanvas}>
      <div className={classes.Header}>
        <div>System Error</div>
        <div style={{ textAlign: "right" }}>
          <ion-icon
            style={{ fontWeight: "600", fontSize: "28px", color: "black" }}
            name="close-outline"
            cursor="pointer"
            onClick={() => {
              props.close();
            }}
          />
        </div>
      </div>
      <div>{errorForm}</div>
    </div>
  );
};

export default ErrorDisplay;
