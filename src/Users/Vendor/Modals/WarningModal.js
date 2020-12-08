import React, { Fragment } from "react";

import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./OrderModal.module.css";

import { Button } from "semantic-ui-react";

const OrderModal = (props) => {

  const modalContent = () => {
    if (props.type === "orders") {
      return (
        <Fragment>
          <div>Event Orders</div>
          <div>There are no orders associated with this event</div>
        </Fragment>
      )
    } else if (props.type === "tickets") {
      return (
        <Fragment>
          <div>Event Ticekts</div>
          <div>There are no tickets available for this event</div>
          <div>You must first create at least one ticket type</div>
        </Fragment>
      )
    } else if (props.type === "analytics") {
      return (
        <Fragment>
          <div>Sales Analytics</div>
          <div>Coming soon!</div>
        </Fragment>
      )
    }
  }

  const modalButtons = (
    <Fragment>
      <Button
        style={{
          backgroundColor: "#fff",
          border: "1px solid blue",
          color: "blue",
          fontSize: "15px",
          fontWeight: "600",
          width: "120px",
          height: "30px",
          margin: "auto",
          textAlign: "center",
          padding: "0px"
        }}
        content=" Continue"
        icon="angle right"
        onClick={props.close}
      />
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
        {modalButtons}
      </div>
    </Fragment>
  );
};

export default OrderModal;
