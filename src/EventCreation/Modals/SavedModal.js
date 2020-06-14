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
  } else if (props.details.status === "declined") {
    titleText = props.details.errorMessage;
  }

  let subText;
  if (props.details.status === "saved" || props.details.status === "live") {
    subText = props.details.subMessage;
  } else if (props.details.status === "declined") {
    subText = null;
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
            content="Back to dashboard"
            basic
            color="blue"
            onClick={props.toDashboard}
          />
        </div>
        <br></br>
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            paddingTop: "5px",
          }}
        >
          <Button
            style={{ width: "200px" }}
            content="Create another event"
            basic
            color="green"
            onClick={props.createEvent}
          />
        </div>
        <br></br>
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            paddingTop: "5px",
          }}
        >
          <Button
            style={{ width: "200px" }}
            content="Edit this event"
            basic
            color="red"
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
            fontSize: "30px",
          }}
        >
          {titleText}
        </div>
        <br></br>
        <br></br>
        <div
          style={{
            fontSize: "20px",
          }}
        >
          {subText}
        </div>
        <br></br>
        {buttonSelection}
        <br></br>
      </div>
    </Aux>
  );
};

export default SavedModal;
