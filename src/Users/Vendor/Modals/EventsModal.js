import React, { Fragment } from "react";

import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import classes from "./EventsModal.module.css";

import { Button } from "semantic-ui-react";

const EventsModal = (props) => {
  console.log("props.details", props.details);

  let titleText = "Select a different event";

  const eventsList = () => {
    console.log("props.details: ", props.details)
    return (
      <div style={{paddingLeft: "20px"}}>
        {props.details.map((event, index) => {
          let currentEventNum = JSON.parse(localStorage.getItem("eventNum"));
          if (currentEventNum !== event.eventNum) {
            return (
              <div
                style={{
                  textAlign: "left",
                  paddingTop: "10px"
                }}
              >
                <button
                  style={{
                    color: "blue",
                    border: "none",
                    backgroundColor: "white",
                    cursor: "pointer",
                    display: "inlineBlock",
                    outline: "none",
                    fontWeight: "400"
                  }}
                  onClick={() => {
                    props.clicked(event.eventNum)
                  }}
                >
                  {event.eventTitle}
                </button>
              </div>
            )
          } else {
            return null;
          }
        })}
        <br></br>
        <br></br>

            <Button
                style={{
                  backgroundColor: "#fff",
                  fontSize: "15px",
                  fontWeight: "600",
                  width: "100px",
                  height: "30px",
                  margin: "auto",
                  textAlign: "center",
                  padding: "0px"
                }}
                icon="close icon"
                content="Cancel"
                basic
                color="red"
                onClick={props.close}
              />
      </div>
    )
  };


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
        <div>{eventsList()}</div>
        <br></br>
      </div>
    </Aux>
  );
};

export default EventsModal;

/*
<i class="plus icon"></i>
<i class="window close outline icon"></i>
*/