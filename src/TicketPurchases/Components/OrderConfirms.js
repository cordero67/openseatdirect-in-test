import React, { Fragment } from "react";
import dateFormat from "dateformat";

import classes from "./OrderConfirms.module.css";

export const OrderConfirm = (props) => {
  const response = () => {
    if (props.orderStatus) {
      return (
        <div style={{ paddingBottom: "20px" }}>
          <div style={{ paddingBottom: "20px" }}>
            OpenSeatDirect will be sending you a message to your email:{" "}
            <span
              style={{
                color: "blue",
                fontWeight: "600",
                paddingBottom: "20px",
              }}
            >
              {props.transactionInfo.email}
            </span>
          </div>
          <div>
            This email will contain a pdf of your ticket(s) to print-at-home or
            to display on your mobile device.
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ paddingBottom: "20px" }}>
          <div style={{ paddingBottom: "20px" }}>
            OpenSeatDirect is experiencing a temporary delay in creating your
            pdf ticket(s).
          </div>

          <div style={{ paddingBottom: "20px" }}>
            Within 48 hours, OpenSeatDirect will be sending you a message to
            your email:{" "}
            <span style={{ color: "blue", fontWeight: "600" }}>
              {props.transactionInfo.paypalEmail}
            </span>
          </div>

          <div style={{ paddingBottom: "20px" }}>
            This email will contain a pdf of your ticket(s) to print-at-home or
            to display on your mobile device.
          </div>

          <div>
            If you do not receive this email by the end of today, please contact
            the vendor.
          </div>
        </div>
      );
    }
  };

  let dateRange;
  if (
    dateFormat(props.transactionInfo.startDateTime, "m d yy", true) ===
    dateFormat(props.transactionInfo.endDateTime, "m d yy", true)
  ) {
    dateRange = (
      <Fragment>
        {dateFormat(
          props.transactionInfo.startDateTime,
          "ddd, mmm d, yyyy - h:MM TT",
          true
        )}{" "}
        to {dateFormat(props.transactionInfo.endDateTime, "shortTime", true)}
      </Fragment>
    );
  } else {
    dateRange = (
      <Fragment>
        {dateFormat(
          props.transactionInfo.startDateTime,
          "ddd, mmm d, yyyy - h:MM TT",
          true
        )}{" "}
        to{" "}
        {dateFormat(
          props.transactionInfo.endDateTime,
          "ddd, mmm d, yyyy - h:MM TT",
          true
        )}
      </Fragment>
    );
  }

  const eventLocation = () => {
    let cityState;
    if (props.transactionInfo.city && props.transactionInfo.state) {
      cityState = `${props.transactionInfo.city}, ${props.transactionInfo.state}`;
    } else if (props.transactionInfo.city) {
      cityState = `${props.transactionInfo.city}`;
    } else if (props.transactionInfo.state) {
      cityState = `${props.transactionInfo.state}`;
    }

    return (
      <div style={{ paddingBottom: "20px" }}>
        <div>{props.transactionInfo.eventTitle}</div>
        <div>{dateRange}</div>
        <div>{props.transactionInfo.dateTime}</div>
        <div>{props.transactionInfo.venue}</div>
        <div>{props.transactionInfo.address1}</div>
        <div>{cityState}</div>
        <div>{props.transactionInfo.zipPostalCode}</div>
      </div>
    );
  };

  const webinarLink = (
    <div>
      <div style={{ textDecoration: "underline", fontWeight: "600" }}>
        Webinar Link
      </div>
      <div style={{ paddingBottom: "20px" }}>
        {props.transactionInfo.webinarLink}
      </div>
    </div>
  );

  const eventDetails = () => {
    return (
      <Fragment>
        <div>{eventLocation()}</div>
        <div>{props.transactionInfo.webinarLink ? webinarLink : null}</div>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div className={classes.SectionHeader}>Order Confirmation</div>
      <div className={classes.Body}>
        <div style={{ paddingBottom: "20px" }}>
          Thank you, your order was received and is in process.
        </div>
        <div style={{ textDecoration: "underline", fontWeight: "600" }}>
          Event Details
        </div>
        {eventDetails()}
        <div
          style={{
            textDecoration: "underline",
            fontWeight: "600",
            paddingBotton: "10px",
          }}
        >
          Order Details
        </div>
        <div style={{ paddingBottom: "20px" }}>
          Total Number of Tickets: {props.transactionInfo.numTickets}
          {props.transactionInfo.tickets.map((item) => {
            return item.ticketsSelected > 0 ? (
              <div key={item.ticketID}>
                {item.ticketsSelected} X {item.ticketName}: $
                {item.ticketsSelected * item.adjustedTicketPrice}
              </div>
            ) : null;
          })}
          Total Purchase Amount: ${props.transactionInfo.totalAmount.toFixed(2)}
        </div>
        {response()}
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          className={classes.ButtonBlue}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          CONTINUE
        </button>
      </div>
    </Fragment>
  );
};

export const OrderConfirmationFF = (props) => {
  return (
    <Fragment>
      <span className={classes.SectionHeader}>Order Confirmation</span>
      <br></br>
      <br></br>
      <div className={classes.Body}>
        <div>
          Thank you, your order was received and processed.
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
            {props.transactionInfo.tickets.map((item) => {
              return item.ticketsSelected > 0 ? (
                <div key={item.ticketID}>
                  {item.ticketsSelected} X {item.ticketName}: $
                  {item.ticketsSelected * item.adjustedTicketPrice}
                </div>
              ) : null;
            })}
            Total Purchase Amount: $
            {props.transactionInfo.totalAmount.toFixed(2)}
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
    </Fragment>
  );
};
