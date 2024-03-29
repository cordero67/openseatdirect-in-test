import React, { Fragment } from "react";

import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./WarningModal.module.css";

const WarningModal = (props) => {
  const modalContent = () => {
    if (props.type === "orders") {
      return (
        <Fragment>
          <div style={{ fontSize: "20px" }}>Past Orders</div>
          <div
            style={{
              fontSize: "16px",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            There are no past orders associated with this event
          </div>
        </Fragment>
      );
    } else if (props.type === "tickets") {
      return (
        <Fragment>
          <div style={{ fontSize: "20px" }}>Issue Tickets</div>
          <div style={{ fontSize: "16px", paddingTop: "20px" }}>
            There are no tickets available for this event
          </div>
          <div
            style={{
              fontSize: "16px",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            You must first create at least one ticket type
          </div>
        </Fragment>
      );
    } else if (props.type === "analytics") {
      return (
        <Fragment>
          <div style={{ fontSize: "20px" }}>Sales Analytics</div>
          <div
            style={{
              fontSize: "16px",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            No ticket sales have been made for this event
          </div>
        </Fragment>
      );
    }
  };

  const modalButtons = (
    <button className={classes.ButtonGrey} onClick={props.close}>
      Continue
    </button>
  );

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

export default WarningModal;
