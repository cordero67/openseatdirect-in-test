import React, { useState, Fragment } from "react";

import QRCode from "qrcode.react";

import { getLongStartDate } from "../Resources/VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./QRCodesModal.module.css";

const ReceiptModal = (props) => {
  console.log("selected order: ", props);
  console.log(props.details.tickets[0].uuid);
  //const [ticketQRCode, setTicketQRCode] = useState(props.details.tickets[0].uuid);
  const [ticketIndex, setTicketIndex] = useState(0);

  let longDateTime;
  [longDateTime] = getLongStartDate(props.details.startDateTime);

  // LOOKS GOOD: 1/21/21
  const modalButtons = () => {
    return (
      <div
        style={{
          width: "330px",
          textAlign: "center",
        }}
      >
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            props.close();
          }}
        >
          CLOSE
        </button>
      </div>
    );
  };

  const loadPreviousTicket = () => {
    let newPosition;
    if (ticketIndex === 0) {
      newPosition = props.details.tickets.length - 1;
    } else {
      newPosition = ticketIndex - 1;
    }
    setTicketIndex(newPosition);
    console.log("newPosition: ,", newPosition);
  };

  const loadNextTicket = () => {
    let newPosition;
    if (ticketIndex === props.details.tickets.length - 1) {
      newPosition = 0;
    } else {
      newPosition = ticketIndex + 1;
    }
    setTicketIndex(newPosition);
    console.log("newPosition: ,", newPosition);
  };

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
        <br></br>
        <div
          style={{
            width: "330px",
            fontWeight: "600",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          {props.details.eventTitle}
        </div>
        <div
          style={{
            width: "330px",
            fontSize: "16px",
            textAlign: "center",
            fontWeight: "400",
            paddingTop: "5px",
          }}
        >
          {longDateTime}
        </div>
        <br></br>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "42px 246px 42px",
            width: "330px",
            height: "220px",
            paddingTop: "10px",
          }}
        >
          <ion-icon
            style={{
              paddingTop: "80px",
              fontSize: "42px",
              border: "none",
              color: "lightgrey",
            }}
            name="chevron-back-outline"
            onClick={() => {
              loadPreviousTicket();
            }}
          />
          <div style={{ textAlign: "center" }}>
            <QRCode
              value={props.details.tickets[ticketIndex].uuid}
              size="96"
              imageSettings={{
                height: "20",
                width: "20%",
              }}
              styles={{ border: "2px solid blue" }}
            />
          </div>
          <ion-icon
            style={{
              paddingTop: "80px",
              fontSize: "42px",
              border: "none",
              color: "lightgrey",
            }}
            name="chevron-forward-outline"
            onClick={() => {
              loadNextTicket();
            }}
          />
        </div>
        <br></br>
        <div>
          Ticket #{ticketIndex + 1} of {props.details.tickets.length}
        </div>
        <br></br>
        {modalButtons()}

        <br></br>
      </div>
    </Fragment>
  );
};

export default ReceiptModal;
