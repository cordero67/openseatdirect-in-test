import React, { useState, Fragment } from "react";

import QRCode from "qrcode.react";

import { getLongStartDate } from "../Vendor/Resources/VendorFunctions";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./QRCodesModal.module.css";

const ReceiptModal = (props) => {
  console.log("QRCodes Modal props: ", props);

  const [ticketIndex, setTicketIndex] = useState(0);

  let ticketDetails = []; // stores all individual ticket information

  props.details.tickets.forEach((qrTix) => {
    props.event.tickets.forEach((ticket) => {
      if (ticket._id === qrTix.ticketId) {
        ticketDetails.push({
          ticketId: ticket._id,
          ticketName: ticket.ticketName,
          ticketUuid: qrTix.uuid,
        });
      }
    });
  });

  let longDateTime;
  [longDateTime] = getLongStartDate(props.details.startDateTime);

  const modalButtons = () => {
    return (
      <div className={classes.ButtonDisplay}>
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
  };

  const loadNextTicket = () => {
    let newPosition;
    if (ticketIndex === props.details.tickets.length - 1) {
      newPosition = 0;
    } else {
      newPosition = ticketIndex + 1;
    }
    setTicketIndex(newPosition);
  };

  return (
    <Fragment>
      <Backdrop show={props.show} />
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
        }}
        className={classes.Modal}
      >
        <div className={classes.EventTitle}>{props.details.eventTitle}</div>
        <div className={classes.DateTime}>{longDateTime}</div>
        <div className={classes.QRCodeGrid}>
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

        <div>{ticketDetails[ticketIndex].ticketName}</div>
        <div>
          Ticket #{ticketIndex + 1} of {props.details.tickets.length}
        </div>
        {modalButtons()}
      </div>
    </Fragment>
  );
};

export default ReceiptModal;
