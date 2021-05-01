import React, { Fragment } from "react";

import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./TicketModal.module.css";

const TicketModal = (props) => {
  console.log("item", props.details, props.details.ticketName);
  console.log("ticketName", props.details.ticketName);

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
          Confirm ticket deletion
        </div>
        <br></br>
        <br></br>
        <div
          style={{
            fontSize: "16px",
          }}
        >
          Are you sure you want to delete the {props.details.ticketName} ticket?
        </div>
        <br></br>
        <div
          style={{
            display: "grid",
            gridGap: "40px",
            gridTemplateColumns: "150px 150px",
            paddingLeft: "114px",
          }}
        >
          <button className={classes.ButtonGrey} onClick={props.closeModal}>
            CANCEL DELETE
          </button>
          <button className={classes.ButtonRed} onClick={props.deleteTicket}>
            DELETE TICKET
          </button>
        </div>
        <br></br>
      </div>
    </Fragment>
  );
};

export default TicketModal;
