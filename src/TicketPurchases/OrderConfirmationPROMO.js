import React from "react";
import dateFormat from "dateformat";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

export const OrderConfirmationTT = props => {
    let dateRange;
    if (dateFormat(props.transactionInfo.startDateTime, "m d yy", true) === dateFormat(props.transactionInfo.endDateTime, "m d yy", true)) {
      dateRange = <Aux>{dateFormat(
        props.transactionInfo.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )} to {dateFormat(
        props.transactionInfo.endDateTime,
        "shortTime",
        true
      )}</Aux>
    } else {
      dateRange = <Aux>{dateFormat(
        props.transactionInfo.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )} to {dateFormat(
        props.transactionInfo.endDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      )}</Aux>
    }

  return (
    <Aux>
      <span className={styles.SubSectionHeader}>Order Confirmation</span>
      <br></br>
      <br></br>
      <div className={styles.SubBody}>
        <div>
          Thank you {props.transactionInfo.firstName}{" "}
          {props.transactionInfo.lastName}, your order was received and
          processed.
          <br></br>
          <br></br>
          <div className={styles.OrderConfirmItems}>
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              Event Details
            </span>
            <br></br>
            {props.transactionInfo.eventTitle}
            <br></br>
            {dateRange}
            <br></br>
            {props.transactionInfo.venue}
            <br></br>
            {props.transactionInfo.address1}
            <br></br>
            {props.transactionInfo.city}, {props.transactionInfo.state}{" "}
            {props.transactionInfo.zipPostalCode}
            <br></br>
          </div>
          <br></br>
          <div className={styles.OrderConfirmItems}>
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              Order Details
            </span>
            <br></br>
            Total Number of Tickets: {props.transactionInfo.numTickets}
            <br></br>
            {props.transactionInfo.tickets.map(item => {
              return item.ticketsSelected > 0 ? (
                <div key={item.ticketID}>
                  {item.ticketsSelected} X {item.ticketName}: $
                  {item.promoTicketPrice.toFixed(2)} per ticket
                </div>
              ) : null;
            })}
            Total Purchase Amount: ${props.transactionInfo.totalAmount.toFixed(2)}
          </div>
          <br></br>
          OpenSeatDirect will be sending you a message to your email:{" "}
          <span style={{ color: "blue", fontWeight: "600" }}>
            {props.transactionInfo.paypalEmail}
          </span>
          <br></br>
          <br></br>
          This email will contain a pdf of your ticket(s) to print-at-home or to
          display on your mobile device.
        </div>
      </div>
    </Aux>
  );
};

export const OrderConfirmationTF = props => {
  return (
    <Aux>
      <span className={styles.SubSectionHeader}>Order in Process</span>
      <br></br>
      <br></br>
      <div className={styles.SubBody}>
        <div>
          Thank you {props.transactionInfo.firstName}{" "}
          {props.transactionInfo.lastName}, your order was received and is in
          process.
          <br></br>
          <br></br>
          <div style={{ paddingLeft: "30px" }}>
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              Event Details
            </span>
            <br></br>
            {props.transactionInfo.eventTitle}
            <br></br>
            {props.transactionInfo.dateTime}
            <br></br>
            {props.transactionInfo.venue}
            <br></br>
            {props.transactionInfo.address1}
            <br></br>
            {props.transactionInfo.city}, {props.transactionInfo.state}{" "}
            {props.transactionInfo.zipPostalCode}
            <br></br>
          </div>
          <br></br>
          <div style={{ paddingLeft: "30px" }}>
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              Order Details
            </span>
            <br></br>
            Total Number of Tickets: {props.transactionInfo.numTickets}
            <br></br>
            {props.transactionInfo.tickets.map(item => {
              return item.ticketsSelected > 0 ? (
                <div key={item.ticketID}>
                  {item.ticketsSelected} X {item.ticketName}: $
                  {item.promoTicketPrice.toFixed(2)} per ticket
                </div>
              ) : null;
            })}
            Total Purchase Amount: ${props.transactionInfo.totalAmount.toFixed(2)}
          </div>
          <br></br>
          OpenSeatDirect is experiencing a temporary delay in creating your pdf
          ticket(s).
          <br></br>
          <br></br>
          Later today, OpenSeatDirect will be sending you a message to your
          email:{" "}
          <span style={{ color: "blue", fontWeight: "600" }}>
            {props.transactionInfo.paypalEmail}
          </span>
          <br></br>
          <br></br>
          This email will contain a pdf of your ticket(s) to print-at-home or to
          display on your mobile device.
          <br></br>
          <br></br>
          If you do not receive this email by the end of today, please contact{" "}
          <span style={{ color: "blue", fontWeight: "600" }}>
            {props.transactionInfo.userEmail}
          </span>
          .
        </div>
      </div>
    </Aux>
  );
};

export const OrderConfirmationFF = props => {
  return (
    <Aux>
      <span className={styles.SubSectionHeader}>Order Confirmation</span>
      <br></br>
      <br></br>
      <div className={styles.SubBody}>
        <div>
          Thank you {props.transactionInfo.firstName}{" "}
          {props.transactionInfo.lastName}, your order was received and
          processed.
          <br></br>
          <br></br>
          <div style={{ paddingLeft: "30px" }}>
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              Event Details
            </span>
            <br></br>
            {props.transactionInfo.eventTitle}
            <br></br>
            {props.transactionInfo.dateTime}
            <br></br>
            {props.transactionInfo.venue}
            <br></br>
            {props.transactionInfo.address1}
            <br></br>
            {props.transactionInfo.city}, {props.transactionInfo.state}{" "}
            {props.transactionInfo.zipPostalCode}
            <br></br>
          </div>
          <br></br>
          <div style={{ paddingLeft: "30px" }}>
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              Order Details
            </span>
            <br></br>
            Total Number of Tickets: {props.transactionInfo.numTickets}
            <br></br>
            {props.transactionInfo.tickets.map(item => {
              return item.ticketsSelected > 0 ? (
                <div key={item.ticketID}>
                  {item.ticketsSelected} X {item.ticketName}: $
                  {item.promoTicketPrice.toFixed(2)} per ticket
                </div>
              ) : null;
            })}
            Total Purchase Amount: ${props.transactionInfo.totalAmount.toFixed(2)}
          </div>
          <br></br>
          OpenSeatDirect will be sending you a message to your email:{" "}
          <span style={{ color: "blue", fontWeight: "600" }}>
            {props.transactionInfo.paypalEmail}
          </span>
          <br></br>
          <br></br>
          This email will contain a pdf of your ticket(s) to print-at-home or to
          display on your mobile device.
        </div>
      </div>
    </Aux>
  );
};
