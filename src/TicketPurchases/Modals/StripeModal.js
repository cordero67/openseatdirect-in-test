import React, { Fragment } from "react";

import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./StripeModal.module.css";

const StripeModal = (props) => {
  //console.log("item", props.details, props.details.ticketName);
  //console.log("ticketName", props.details.ticketName);

  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed}></Backdrop>
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
            fontSize: "32px",
          }}
        >
          Unsuccessfull Order
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div
          style={{
            fontSize: "16px",
          }}
        >
          Missing {props.details}
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <button className={classes.ButtonGrey} onClick={props.closeModal}>
            CONTINUE
          </button>
        </div>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </Fragment>
  );
};

export default StripeModal;
