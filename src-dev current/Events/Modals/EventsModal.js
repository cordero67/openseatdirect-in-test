import React, { Fragment } from "react";

import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./EventsModal.module.css";

import { Button } from "semantic-ui-react";

const EventsModal = (props) => {

  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
          fontSize: "20px"
        }}
        className={classes.Modal}
      >
      <br></br>
      <br></br>
        Would you like to setup a vendor account?
        <br></br>
        <br></br>
        <br></br>
        <button
          onClick={() => {
            console.log("clicked YES button");
            props.becomeVendor()
            }}
          style={{
            border: "1px solid #008F00",
            backgroundColor: "#fff",
            color: "black",
            fontSize: "14px",
            width: "150px",
            height: "40px",
            fontWeight: "500"
            }}
          >
            YES
          </button>
          <br></br>
        <br></br>
          <button
          onClick={() => {
            console.log("clicked NOT NOW button");
            props.notNow()
            }}
          style={{
            border: "1px solid #B80000",
            backgroundColor: "#fff",
            color: "black",
            fontSize: "14px",
            width: "150px",
            height: "40px",
            fontWeight: "500"
            }}
          >
            NOT NOW
          </button>
        <br></br>
        <br></br>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "400"
            }}>
          <input
            type="checkbox"
            id="askAgain"
            name="askAgain"
            value={false}
            onChange={() => {
              console.log("Changed checkbox")
              props.changed()
            }}
            />
          <span></span>
          <label style={{paddingLeft: "10px"}}  for="vehicle1">{" "}Don't ask me again</label>
        </div>


        <br></br>
      </div>
    </Fragment>
  );
};

export default EventsModal;
