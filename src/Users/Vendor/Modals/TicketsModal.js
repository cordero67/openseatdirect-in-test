import React, { Fragment } from "react";

import { getLongStartDate } from "../Resources/VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./TicketsModal.module.css";

const TicketsModal = (props) => {
  console.log("Ticket Modal props: ", props);

  let allTotal = 0;
  let payPalExpressTotal = 0;
  let cashTotal = 0;
  let cashAppTotal = 0;
  let venmoTotal = 0;
  let paypalTotal = 0;
  let bitcoinTotal = 0;
  let ethereumTotal = 0;
  let otherTotal = 0;

  let longDateTime;
  [longDateTime] = getLongStartDate(props.details.startDateTime);

  // LOOKS GOOD: 1/21/21
  const modalButtons = () => {
    return (
      <div
        style={{
          width: "530px",
          textAlign: "center",
          paddingLeft: "35px",
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

  const ticketsList = () => {
    return props.details.tickets.map((ticket, index) => {
      console.log("ticket: ", ticket);

      let adjustedTicketName;
      let num = 40;

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

      return (
        <Fragment>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "360px 80px 70px",
              gridGap: "10px",
              width: "530px",
              height: "28px",
              paddingTop: "10px",
            }}
          >
            {" "}
            <div>1{ticket.ticketName}</div>
            <div style={{ textAlign: "right", paddingRight: "10px" }}>
              {parseFloat(ticket.fullPrice).toFixed(2)}
            </div>
            <div style={{ textAlign: "right", paddingRight: "10px" }}>
              {parseFloat(ticket.sellingPrice).toFixed(2)}
            </div>
          </div>
        </Fragment>
      );
    });
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
            fontWeight: "600",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          {props.details.eventTitle}
        </div>

        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            textAlign: "center",
            fontWeight: "400",
            paddingTop: "5px",
          }}
        >
          {longDateTime}
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "80px",
            paddingBottom: "10px",
          }}
        ></div>
        <br></br>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 80px 70px",
            gridGap: "10px",
            width: "530px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            paddingBottom: "10px",
          }}
        >
          <div style={{ textAlign: "left" }}>Ticket Type</div>
          <div style={{ textAlign: "center" }}>
            Full<br></br>Price
          </div>
          <div style={{ textAlign: "center" }}>Purchase Price</div>
        </div>

        <div
          style={{
            width: "530px",
            borderBottom: "1px solid black",
            paddingBottom: "10px",
          }}
        >
          {ticketsList()}
        </div>
        <br></br>

        {modalButtons()}

        <br></br>
      </div>
    </Fragment>
  );
};

export default TicketsModal;
