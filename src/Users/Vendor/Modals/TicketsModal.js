import React, { Fragment } from "react";

import { getLongStartDate } from "../Resources/VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./TicketsModal.module.css";

const TicketsModal = (props) => {
  console.log("Ticket Modal props: ", props);

  // create an array of objects to hold transactions by ticket type
  let orderDetails = [];
  props.event.tickets.forEach((ticket) => {
    orderDetails.push({
      ticketId: ticket._id,
      ticketName: ticket.ticketName,
      ticketsSold: 0,
      ticketPrice: ticket.currentTicketPrice,
      grossTotal: 0,
      netTotal: 0,
    });
  });
  console.log("tempOrderDetails: ", orderDetails);

  let longDateTime;
  [longDateTime] = getLongStartDate(props.details.startDateTime);
  /*
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
*/

  const modalButtons = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "160px 160px 160px",
          gridGap: "15px",
          width: "590px",
          textAlign: "center",
          paddingLeft: "0px",
        }}
      >
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
  };

  const ticketName = (ticketId) => {
    return ticketId;
  };

  const ticketsList = () => {
    return props.details.tickets.map((ticket, index) => {
      console.log("ticket: ", ticket);

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

      return (
        <Fragment key={index}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "430px 70px",
              gridGap: "10px",
              width: "510px",
              height: "28px",
              paddingTop: "10px",
            }}
          >
            {" "}
            <div>{ticketName(ticket._id)}</div>
            <div style={{ textAlign: "left" }}>
              {parseFloat(ticket.fullPrice).toFixed(2)}
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
            textAlign: "left",
          }}
        >
          {props.details.eventTitle}
        </div>

        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
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
            gridTemplateColumns: "110px 380px",
            fontSize: "16px",
            textAlign: "left",
            paddingBottom: "10px",
          }}
        >
          <div style={{ fontWeight: "600" }}>Recipient:</div>
          <div>
            {props.details.firstName}
            {", "}
            {props.details.lastName}
          </div>
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "110px",
            paddingBottom: "10px",
          }}
        >
          {props.details.email}
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
            gridTemplateColumns: "430px 70px",
            gridGap: "10px",
            width: "510px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            paddingBottom: "10px",
          }}
        >
          <div style={{ textAlign: "left" }}>Type</div>
          <div style={{ textAlign: "right" }}>Price</div>
        </div>

        <div
          style={{
            width: "510px",
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
