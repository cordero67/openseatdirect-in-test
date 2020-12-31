import React, { Fragment } from "react";

import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./WarningModal.module.css";

import { Button } from "semantic-ui-react";

const OrderModal = (props) => {

  const modalContent = () => {
    if (props.type === "orders") {
      return (
        <Fragment>
          <div style={{fontSize: "20px"}}>Past Orders</div>
          <br></br>
          <div style={{fontSize: "16px"}}>There are no past orders associated with this event</div>
        </Fragment>
      )
    } else if (props.type === "tickets") {
      return (
        <Fragment>
          <div style={{fontSize: "20px"}}>Issue Tickets</div>
          <br></br>
          <div style={{fontSize: "16px"}}>There are no tickets available for this event</div>
          <br></br>
          <div style={{fontSize: "16px"}}>You must first create at least one ticket type</div>
        </Fragment>
      )
    } else if (props.type === "analytics") {
      return (
        <Fragment>
          <div style={{fontSize: "20px"}}>Sales Analytics</div>
          <br></br>
          <div style={{fontSize: "20px"}}>Coming soon!</div>
        </Fragment>
      )
    }
  }

  const modalButtons = (
    <Fragment>
      <button
        onClick={props.close}
        style={{
          border: "1px solid #0000CC",
          backgroundColor: "#fff",
          color: "black",
          fontSize: "14px",
          width: "150px",
          height: "40px",
          fontWeight: "500"
        }}
      >
        CONTINUE
      </button>
    </Fragment>
  )

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
        {modalContent()}
        <br></br>
        {modalButtons}
      </div>
    </Fragment>
  );
};

export default OrderModal;
