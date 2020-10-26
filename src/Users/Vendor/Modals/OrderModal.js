import React from "react";

import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import classes from "./OrderModal.module.css";

import { Button } from "semantic-ui-react";

const OrderModal = (props) => {
  console.log("item", props.details, props.details.ticketName);
  console.log("ticketName", props.details.ticketName);

  return (
    <Aux>
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

        <Button
          style={{
            marginTop: "5px",
            marginRight: "10px",
            width: "110px",
            height: "30px",
            textAlign: "center",
            paddingTop: "7px",
          }}
          content="Cancel"
          basic
          icon="cancel"
          color="green"
          onClick={props.closeModal}
        />
        <Button
          style={{
            marginTop: "5px",
            marginLeft: "10px",
            width: "110px",
            height: "30px",
            textAlign: "center",
            paddingTop: "7px",
          }}
          content="Delete"
          basic
          color="red"
          onClick={props.deleteTicket}
        />

        <br></br>
      </div>
    </Aux>
  );
};

export default OrderModal;
