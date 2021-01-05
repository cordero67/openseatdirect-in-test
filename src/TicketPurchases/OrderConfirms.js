import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import dateFormat from "dateformat";

import classes from "./OrderConfirms.module.css";
import { Button } from "semantic-ui-react";

export const OrderConfirmTT = props => {
  let dateRange;
  if (dateFormat(props.transactionInfo.startDateTime, "m d yy", true) === dateFormat(props.transactionInfo.endDateTime, "m d yy", true)) {
    dateRange = <Fragment>{dateFormat(
      props.transactionInfo.startDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )} to {dateFormat(
      props.transactionInfo.endDateTime,
      "shortTime",
      true
    )}</Fragment>
  } else {
    dateRange = <Fragment>{dateFormat(
      props.transactionInfo.startDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )} to {dateFormat(
      props.transactionInfo.endDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )}</Fragment>
  }

const eventLocation = () => {
let cityState;
if (props.transactionInfo.city && props.transactionInfo.state) {
  cityState = `${props.transactionInfo.city}, ${props.transactionInfo.state}`
} else if (props.transactionInfo.city) {
  cityState = `${props.transactionInfo.city}`
} else if (props.transactionInfo.state) {
  cityState = `${props.transactionInfo.state}`
}

return (
  <div>
    <div>
      {props.transactionInfo.eventTitle}
    </div>
    <div>
      {dateRange}
    </div>
    <div>
      {props.transactionInfo.dateTime}
    </div>
    <div>
      {props.transactionInfo.venue}
    </div>
    <div>
      {props.transactionInfo.address1}
    </div>
    <div>
      {cityState}
    </div>
    <div>
      {props.transactionInfo.zipPostalCode}
    </div>
  </div>
)
}

const webinarLink = (
  <div>
    <div style={{ textDecoration: "underline", fontWeight: "600" }}>Webinar Link</div>
    <div>{props.transactionInfo.webinarLink}</div>
  </div>
)

const eventDetails = () => {
    return (
      <div>
        {eventLocation()}
        <br></br>
        {props.transactionInfo.webinarLink ? 
          webinarLink :
          null}
        <br></br>
      </div>
    )
}

return (
  <Fragment>
    <span className={classes.SubSectionHeader}>Order Confirmation</span>
    <br></br>
    <br></br>
    <div className={classes.SubBody}>
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
          {eventDetails()}
        </div>
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
                {item.ticketsSelected * item.adjustedTicketPrice}
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
    <br></br>
    <br></br>
    <div style={{textAlign: "center"}}>
      <Button
        style={{
          backgroundColor: 'white',
          border: "1px solid blue",
          color: "blue",
          fontSize: "14px",
          fontWeigth: "600",
          width: "127px",
          height: "44px",
          margin: "auto",
          textAlign: "center",
          padding: "0px"
        }}
        content="Continue"
        onClick={() => {
          window.location.href = "/events";
        }}
      />
    </div>
  </Fragment>
);
};


export const OrderConfirmTF = props => {
  let dateRange;
  if (dateFormat(props.transactionInfo.startDateTime, "m d yy", true) === dateFormat(props.transactionInfo.endDateTime, "m d yy", true)) {
    dateRange = <Fragment>{dateFormat(
      props.transactionInfo.startDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )} to {dateFormat(
      props.transactionInfo.endDateTime,
      "shortTime",
      true
    )}</Fragment>
  } else {
    dateRange = <Fragment>{dateFormat(
      props.transactionInfo.startDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )} to {dateFormat(
      props.transactionInfo.endDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )}</Fragment>
  }

const eventLocation = () => {
  let cityState;
  if (props.transactionInfo.city && props.transactionInfo.state) {
    cityState = `${props.transactionInfo.city}, ${props.transactionInfo.state}`
  } else if (props.transactionInfo.city) {
    cityState = `${props.transactionInfo.city}`
  } else if (props.transactionInfo.state) {
    cityState = `${props.transactionInfo.state}`
  }

  return (
    <div>
      <div>
        {props.transactionInfo.eventTitle}
      </div>
      <div>
        {dateRange}
      </div>
      <div>
        {props.transactionInfo.dateTime}
      </div>
      <div>
        {props.transactionInfo.venue}
      </div>
      <div>
        {props.transactionInfo.address1}
      </div>
      <div>
        {cityState}
      </div>
      <div>
        {props.transactionInfo.zipPostalCode}
      </div>
    </div>
  )
}

  const webinarLink = (
    <div>
      <div style={{ textDecoration: "underline", fontWeight: "600" }}>Webinar Link</div>
      <div>{props.transactionInfo.webinarLink}</div>
    </div>
  )

  const eventDetails = () => {
      return (
        <div>
          {eventLocation()}
          <br></br>
          {props.transactionInfo.webinarLink ? 
            webinarLink :
            null}
          <br></br>
        </div>
      )
  }

  return (
    <Fragment>
      <span className={classes.SubSectionHeader}>Order in Process</span>
      <br></br>
      <br></br>
      <div className={classes.SubBody}>
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
            {eventDetails()}
          </div>
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
                  {item.ticketsSelected * item.adjustedTicketPrice}
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
          Within 48 hours, OpenSeatDirect will be sending you a message to your
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
          If you do not receive this email by the end of today, please contact the vendor.
          <span style={{ color: "blue", fontWeight: "600" }}>
            {props.transactionInfo.userEmail}
          </span>
          .
        </div>
      </div>
      <br></br>
      <br></br>
      <div style={{textAlign: "center"}}>
        <Button
          style={{
            backgroundColor: 'white',
            border: "1px solid blue",
            color: "blue",
            fontSize: "14px",
            fontWeigth: "700",
            width: "127px",
            height: "44px",
            margin: "auto",
            textAlign: "center",
            padding: "0px"
          }}
          content="Continue"
          onClick={() => {
            window.location.href = "/events";
          }}
        />
      </div>
    </Fragment>
  );
};

export const FreeConfirmTT = props => {
  let dateRange;
  if (dateFormat(props.transactionInfo.startDateTime, "m d yy", true) === dateFormat(props.transactionInfo.endDateTime, "m d yy", true)) {
    dateRange = <Fragment>{dateFormat(
      props.transactionInfo.startDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )} to {dateFormat(
      props.transactionInfo.endDateTime,
      "shortTime",
      true
    )}</Fragment>
  } else {
    dateRange = <Fragment>{dateFormat(
      props.transactionInfo.startDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )} to {dateFormat(
      props.transactionInfo.endDateTime,
      "ddd, mmm d, yyyy - h:MM TT",
      true
    )}</Fragment>
  }

  const eventLocation = () => {
    let cityState;
    if (props.transactionInfo.city && props.transactionInfo.state) {
      cityState = `${props.transactionInfo.city}, ${props.transactionInfo.state}`
    } else if (props.transactionInfo.city) {
      cityState = `${props.transactionInfo.city}`
    } else if (props.transactionInfo.state) {
      cityState = `${props.transactionInfo.state}`
    }

    return (
      <div>
        <div>
          {props.transactionInfo.eventTitle}
        </div>
        <div>
          {dateRange}
        </div>
        <div>
          {props.transactionInfo.dateTime}
        </div>
        <div>
          {props.transactionInfo.venue}
        </div>
        <div>
          {props.transactionInfo.address1}
        </div>
        <div>
          {cityState}
        </div>
        <div>
          {props.transactionInfo.zipPostalCode}
        </div>
      </div>
    )
  }

  const webinarLink = (
    <div>
      <div style={{ textDecoration: "underline", fontWeight: "600" }}>Webinar Link</div>
      <div>{props.transactionInfo.webinarLink}</div>
    </div>
  )

  const eventDetails = () => {
      return (
        <div>
          {eventLocation()}
          <br></br>
          {props.transactionInfo.webinarLink ? 
            webinarLink :
            null}
          <br></br>
        </div>
      )
  }

  return (
    <Fragment>
      <span className={classes.SubSectionHeader}>Order Confirmation</span>
      <br></br>
      <br></br>
      <div className={classes.SubBody}>
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
            {eventDetails()}
          </div>
          <div style={{ paddingLeft: "30px" }}>
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              Order Details
            </span>
            <br></br>
            Total Number of Tickets: {props.transactionInfo.numTickets}
            <br></br>
            {/*props.transactionInfo.tickets.map(item => {
              return item.ticketsSelected > 0 ? (
                <div key={item.ticketID}>
                  {item.ticketsSelected} X {item.ticketName}: $
                  {item.ticketsSelected * item.adjustedTicketPrice}
                </div>
              ) : null;
            })*/}
            Total Purchase Amount: ${/*props.transactionInfo.totalAmount.toFixed(2)*/}
          </div>
          <br></br>
          OpenSeatDirect will be sending you a message to your email:{" "}
          <span style={{ color: "blue", fontWeight: "600" }}>
            {props.transactionInfo.email}
          </span>
          <br></br>
          <br></br>
          This email will contain a pdf of your ticket(s) to print-at-home or to
          display on your mobile device.
        </div>
      </div>
      <br></br>
      <br></br>
      <div style={{textAlign: "center"}}>
        <Button
          style={{
            backgroundColor: 'white',
            border: "1px solid blue",
            color: "blue",
            fontSize: "14px",
            fontWeigth: "600",
            width: "127px",
            height: "44px",
            margin: "auto",
            textAlign: "center",
            padding: "0px"
          }}
          content="Continue"
          onClick={() => {
            window.location.href = "/events";
          }}
        />
      </div>
    </Fragment>
  );
};

export const OrderConfirmationFF = props => {
  return (
    <Fragment>
      <span className={classes.SubSectionHeader}>Order Confirmation</span>
      <br></br>
      <br></br>
      <div className={classes.SubBody}>
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
                  {item.ticketsSelected * item.adjustedTicketPrice}
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
    </Fragment>
  );
};
