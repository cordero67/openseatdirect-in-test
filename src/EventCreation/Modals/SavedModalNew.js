import React from "react";

import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./SavedModal.module.css";

import { Button } from "semantic-ui-react";

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
    titleText = titleText = props.details.failureMessage;
  }

  let buttonSelection;
  if (props.details.status === "saved" || props.details.status === "live") {
    buttonSelection = (
      <div className={classes.CropBoxControls}>
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            paddingTop: "5px",
          }}
        >
          <Button
            style={{ width: "200px" }}
            content="Continue"
            basic
            color="blue"
            onClick={props.toDashboard}
          />
        </div>
      </div>
    )
  } else if (props.details.status === "error" || props.details.status === "failure") {
    buttonSelection = (
      <div className={classes.CropBoxControls}>
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            paddingTop: "5px",
          }}
        >
          <Button
            style={{ width: "200px" }}
            content="Continue"
            basic
            color="blue"
            onClick={props.editEvent}
          />
        </div>
      </div>
    ) 
  }

  return (
    <Aux>
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
    </Aux>
  );
};

export default SavedModal;
