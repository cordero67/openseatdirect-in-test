import React, { Fragment } from "react";

import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./SavedModal.module.css";

const SavedModal = (props) => {
  console.log("item", props.details);

  let titleText;
  if (props.details.status === "saved") {
    titleText = props.details.savedMessage;
  } else if (props.details.status === "live") {
    titleText = props.details.liveMessage;
  } else if (props.details.status === "error") {
    titleText = props.details.errorMessage;
  } else if (props.details.status === "failure") {
    if (!props.details.failureMessage) {
      titleText = "Please fix input errors and resubmit.";
    } else {
      titleText = props.details.failureMessage;
    }
  }

  let buttonSelection;
  if (props.details.status === "saved") {
    buttonSelection = (
      <div className={classes.CropBoxControls}>
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            paddingTop: "5px",
          }}
        >
          <button className={classes.ButtonGrey} onClick={props.toDashboard}>
            CONTINUE
          </button>
        </div>
      </div>
    );
  } else if (props.details.status === "live") {
    buttonSelection = (
      <div className={classes.CropBoxControls}>
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            paddingTop: "5px",
          }}
        >
          <button className={classes.ButtonGrey} onClick={props.toDashboard}>
            CONTINUE
          </button>
        </div>
      </div>
    );
  }
  if (props.details.status === "error" || props.details.status === "failure") {
    buttonSelection = (
      <div className={classes.CropBoxControls}>
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            paddingTop: "5px",
          }}
        >
          <button className={classes.ButtonGrey} onClick={props.closeModal}>
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Backdrop show={props.show}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
        }}
        className={classes.Modal}
      >
        <br></br>
        <div
          style={{
            fontSize: "24px",
            height: "50px",
            textAlign: "center",
            paddingTop: "5px",
          }}
        >
          {titleText}
        </div>
        {buttonSelection}
        <br></br>
      </div>
    </Fragment>
  );
};

export default SavedModal;
