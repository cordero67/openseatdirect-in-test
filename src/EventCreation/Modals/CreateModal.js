import React, { Fragment } from "react";

import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./SavedModal.module.css";

const CreateModal = (props) => {
  console.log("item", props.details);

  let titleText;
  let errorMessage;
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
      titleText = "Please fix following input error";
      errorMessage = props.details.failureMessage;
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

  return <div>Yo bitch</div>;
};

export default CreateModal;

/*
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
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "10px",
          }}
        >
          {titleText}
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "center",
            color: "red",
            paddingTop: "5px",
            paddingBottom: "10px",
          }}
        >
          {errorMessage}
        </div>
        {buttonSelection}
        <br></br>
      </div>
    </Fragment>
    */
