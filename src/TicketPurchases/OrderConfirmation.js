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

  let currency = "$";
  if (props.transactionInfo.currency === "¥") {
    currency = "¥"}

  let purchaseTotal;
  if (props.transactionInfo.currency === "¥") {
    purchaseTotal= props.transactionInfo.totalAmount.toFixed(0)
  } else {
    purchaseTotal= props.transactionInfo.totalAmount.toFixed(2)
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
            {props.transactionInfo.address1 ? <Aux>{props.transactionInfo.address1}<br></br></Aux> : null}
            {props.transactionInfo.city ? <Aux>{props.transactionInfo.city},{" "}</Aux> : null}
            {props.transactionInfo.state ? <Aux>{props.transactionInfo.state}{" "}</Aux> : null}
            {props.transactionInfo.zipPostalCode ? <Aux>{props.transactionInfo.zipPostalCode}</Aux> : null}
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
                  {item.ticketsSelected} X {item.ticketName}: {currency}
                  {item.ticketsSelected * item.adjustedTicketPrice}
                </div>
              ) : null;
            })}
            Total Purchase Amount: {currency}{purchaseTotal}
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
  
  let currency = "$";
  if (props.transactionInfo.currency === "¥") {
    currency = "¥"}

  let purchaseTotal;
  if (props.transactionInfo.currency === "¥") {
    purchaseTotal= props.transactionInfo.totalAmount.toFixed(0)
  } else {
    purchaseTotal= props.transactionInfo.totalAmount.toFixed(2)
  }

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
            {dateRange}
            <br></br>
            {props.transactionInfo.venue}
            <br></br>
            {props.transactionInfo.address1 ? <Aux>{props.transactionInfo.address1}<br></br></Aux> : null}
            {props.transactionInfo.city ? <Aux>{props.transactionInfo.city},{" "}</Aux> : null}
            {props.transactionInfo.state ? <Aux>{props.transactionInfo.state}{" "}</Aux> : null}
            {props.transactionInfo.zipPostalCode ? <Aux>{props.transactionInfo.zipPostalCode}</Aux> : null}
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
                  {item.ticketsSelected} X {item.ticketName}: {currency}
                  {item.ticketsSelected * item.adjustedTicketPrice}
                </div>
              ) : null;
            })}
            Total Purchase Amount: {currency}{purchaseTotal}
          </div>
          <br></br>
          We are experiencing a temporary delay in sending you an email containing your attached pdf
          ticket(s) to print-at-home or to display on your mobile device.
          <br></br>
          <br></br>
          If you do not receive your email at "
          <span style={{ color: "blue", fontWeight: "600" }}>
            {props.transactionInfo.paypalEmail}
          </span>
          " by the end of today, please contact the venue.
        </div>
      </div>
    </Aux>
  );
};

// NEED TO REFACTOR AND EDIT
export const OrderConfirmationFF = props => {
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
  
  let currency = "$";
  if (props.transactionInfo.currency === "¥") {
    currency = "¥"}

  let purchaseTotal;
  if (props.transactionInfo.currency === "¥") {
    purchaseTotal= props.transactionInfo.totalAmount.toFixed(0)
  } else {
    purchaseTotal= props.transactionInfo.totalAmount.toFixed(2)
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
          <div style={{ paddingLeft: "30px" }}>
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
            {props.transactionInfo.address1 ? <Aux>{props.transactionInfo.address1}<br></br></Aux> : null}
            {props.transactionInfo.city ? <Aux>{props.transactionInfo.city},{" "}</Aux> : null}
            {props.transactionInfo.state ? <Aux>{props.transactionInfo.state}{" "}</Aux> : null}
            {props.transactionInfo.zipPostalCode ? <Aux>{props.transactionInfo.zipPostalCode}</Aux> : null}
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
                  {item.ticketsSelected} X {item.ticketName}: {currency}
                  {item.ticketsSelected * item.adjustedTicketPrice}
                </div>
              ) : null;
            })}
            Total Purchase Amount: {currency}{purchaseTotal}
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
