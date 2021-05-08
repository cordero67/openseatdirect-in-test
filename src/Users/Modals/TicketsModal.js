import React, { Fragment } from "react";

import { getLongStartDate } from "../Vendor/Resources/VendorFunctions";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./TicketsModal.module.css";

const TicketsModal = (props) => {
  console.log("Ticket Modal props: ", props);

  let ticketDetails = []; // stores all individual ticket information

  props.details.tickets.forEach((qrTix) => {
    props.event.tickets.forEach((ticket) => {
      if (ticket._id === qrTix.ticketId) {
        ticketDetails.push({
          ticketId: ticket._id,
          ticketName: ticket.ticketName,
          ticketPrice: qrTix.fullPrice,
        });
      }
    });
  });

  let longDateTime;
  [longDateTime] = getLongStartDate(props.details.startDateTime);

  const modalButtons = () => {
    if (props.numberEvents > 1) {
      return (
        <div className={classes.ButtonDisplayGrid}>
          <button
            className={classes.ButtonBlue}
            onClick={() => {
              props.loadPrevious();
            }}
          >
            PREVIOUS EVENT
          </button>
          <button
            className={classes.ButtonGreen}
            onClick={() => {
              props.loadNext();
            }}
          >
            NEXT EVENT
          </button>
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
    } else {
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
    }
  };

  const ticketsList = () => {
    return ticketDetails.map((ticket, index) => {
      return (
        <Fragment key={index}>
          <div className={classes.TicketsGrid}>
            {" "}
            <div style={{ textAlign: "left" }}>{ticket.ticketName}</div>
            <div style={{ textAlign: "right" }}>
              {parseFloat(ticket.ticketPrice).toFixed(2)}
            </div>
          </div>
        </Fragment>
      );
    });
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

        <div className={classes.TicketsHeader}>
          <div style={{ textAlign: "left" }}>Type</div>
          <div style={{ textAlign: "right" }}>Price</div>
        </div>

        <div className={classes.TicketsDisplay}>{ticketsList()}</div>
        {modalButtons()}
      </div>
    </Fragment>
  );
};

export default TicketsModal;

//let adjustedTicketName;
//let num = 40;

/*
  //if (ticket.ticketName.length <= num) {
    if (true) {
    adjustedTicketName = ticket.ticketName;
  } else {
    adjustedTicketName = ticket.ticketName.slice(0, num) + '...'
  }

  let adjustedPaymentMethod;

  if ("manualPaymentMethod" in  ticket && parseFloat(ticket.unit_price).toFixed(2) !== "0.00") {
    adjustedPaymentMethod = ticket.manualPaymentMethod;
  } else if ("manualPaymentMethod" in  ticket) {
    adjustedPaymentMethod = "comp"
  } else {
    adjustedPaymentMethod = "PayPal Express"
  }
  */
