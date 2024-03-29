import React, { Fragment } from "react";

import { getStartDate } from "../Resources/VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./OrderModal.module.css";

const OrderModal = (props) => {
  console.log("props: ", props);

  let allTotal = 0;
  let cashTotal = 0;
  let cashAppTotal = 0;
  let venmoTotal = 0;
  let paypalTotal = 0;
  let bitcoinTotal = 0;
  let ethereumTotal = 0;
  let dogecoinTotal = 0;
  let otherTotal = 0;

  let longDateTime;
  [longDateTime] = getStartDate(props.dateTime);

  const modalTitle = () => {
    if (props.status === "review") {
      return <Fragment>Review and submit order</Fragment>;
    } else if (props.status === "confirmation") {
      return <Fragment>Order confirmed and tickets issued</Fragment>;
    } else if (props.status === "error") {
      return (
        <div>
          <div style={{ paddingBottom: "10px" }}>
            Your order was not successful
          </div>
          <div style={{ paddingBottom: "10px" }}>
            Please check the order information and resubmit
          </div>
        </div>
      );
    }
  };

  const modalButtons = () => {
    if (props.status === "review") {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 180px",
            gridGap: "40px",
            width: "630px",
            fontWeight: "600",
            paddingLeft: "115px",
          }}
        >
          <button className={classes.ButtonRed} onClick={props.edit}>
            Edit order
          </button>
          <button
            className={classes.ButtonGreen}
            onClick={() => props.submit(allTotal)}
          >
            Submit order
          </button>
        </div>
      );
    } else if (props.status === "confirmation") {
      return (
        <Fragment>
          <button
            className={classes.ButtonGrey}
            onClick={() => props.close("confirmation")}
          >
            Continue
          </button>
        </Fragment>
      );
    } else if (props.status === "error") {
      return (
        <Fragment>
          <button
            className={classes.ButtonGrey}
            onClick={() => props.close("error")}
          >
            Continue
          </button>
        </Fragment>
      );
    }
  };

  const ticketsList = () => {
    console.log("tickets: ", props.details.tickets);
    return props.details.tickets.map((ticket, index) => {
      /*
        let adjustedTicketName;
        let num = 40;

        if (ticket.ticketName.length <= num) {
          adjustedTicketName = ticket.ticketName;
        } else {
          adjustedTicketName = ticket.ticketName.slice(0, num) + '...'
        }
        */
      return (
        <Fragment key={index}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 80px 70px 110px 70px",
              gridGap: "10px",
              width: "630px",
              height: "auto",
              paddingTop: "10px",
            }}
          >
            <div style={{ textAlign: "left" }}>{ticket.ticketName}</div>
            <div style={{ textAlign: "center" }}>{ticket.numTickets}</div>
            <div style={{ textAlign: "right", paddingRight: "10px" }}>
              {parseFloat(ticket.chargedPrice).toFixed(2)}
            </div>
            {parseFloat(ticket.chargedPrice).toFixed(2) !== "0.00" ? (
              <div style={{ textAlign: "left", paddingLeft: "20px" }}>
                {ticket.paymentType}
              </div>
            ) : (
              <div style={{ textAlign: "left", paddingLeft: "20px" }}>comp</div>
            )}
            <div style={{ textAlign: "right", paddingRight: "10px" }}>
              {parseFloat(ticket.subtotal).toFixed(2)}
            </div>
          </div>
        </Fragment>
      );
    });
  };

  const paymentTypeTotals = () => {
    console.log("tickets: ", props.details.tickets);
    props.details.tickets.forEach((ticket, index) => {
      allTotal += ticket.subtotal;
      if (ticket.paymentType === "cash" && ticket.subtotal !== 0) {
        console.log("cash ticket.subtotal: ", ticket.subtotal);
        cashTotal += ticket.subtotal;
      } else if (ticket.paymentType === "CashApp") {
        console.log("Cashapp ticket.subtotal: ", ticket.subtotal);
        cashAppTotal += ticket.subtotal;
      } else if (ticket.paymentType === "Venmo") {
        console.log("Venmo ticket.subtotal: ", ticket.subtotal);
        venmoTotal += ticket.subtotal;
      } else if (ticket.paymentType === "Paypal") {
        console.log("Paypal ticket.subtotal: ", ticket.subtotal);
        paypalTotal += ticket.subtotal;
      } else if (ticket.paymentType === "Bitcoin") {
        console.log("Bitcoin ticket.subtotal: ", ticket.subtotal);
        bitcoinTotal += ticket.subtotal;
      } else if (ticket.paymentType === "Ethereum") {
        console.log("Ethereum ticket.subtotal: ", ticket.subtotal);
        ethereumTotal += ticket.subtotal;
      } else if (ticket.paymentType === "Dogecoin") {
        console.log("Dogecoin ticket.subtotal: ", ticket.subtotal);
        dogecoinTotal += ticket.subtotal;
      } else {
        otherTotal += ticket.subtotal;
      }
    });

    let allTotalBorder = classes.Total;

    console.log("allTotal: ", allTotal);
    console.log("typeof: ", typeof allTotal);

    if (parseInt(allTotal) === 0) {
      console.log("equal to 0");
      allTotalBorder = classes.SubTotal;
    }

    return (
      <Fragment>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "520px 70px",
            gridGap: "10px",
            paddingTop: "5px",
          }}
        ></div>
        <div
          style={{
            marginRight: "8px",
            marginLeft: "440px",
          }}
        >
          {cashTotal > 0 ? (
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>cash Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(cashTotal).toFixed(2)}
              </div>
            </div>
          ) : null}
          {cashAppTotal > 0 ? (
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>CashApp Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(cashAppTotal).toFixed(2)}
              </div>
            </div>
          ) : null}
          {venmoTotal > 0 ? (
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>Venmo Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(venmoTotal).toFixed(2)}
              </div>
            </div>
          ) : null}
          {paypalTotal > 0 ? (
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>PayPal Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(paypalTotal).toFixed(2)}
              </div>
            </div>
          ) : null}
          {bitcoinTotal > 0 ? (
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>Bitcoin Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(bitcoinTotal).toFixed(2)}
              </div>
            </div>
          ) : null}
          {ethereumTotal > 0 ? (
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>Ethereum Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(ethereumTotal).toFixed(2)}
              </div>
            </div>
          ) : null}
          {dogecoinTotal > 0 ? (
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>Dogecoin Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(dogecoinTotal).toFixed(2)}
              </div>
            </div>
          ) : null}
          {otherTotal > 0 ? (
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>other Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(otherTotal).toFixed(2)}
              </div>
            </div>
          ) : null}
          <div className={allTotalBorder}>
            <div style={{ textAlign: "right" }}>Grand Total:</div>
            <div style={{ textAlign: "right", paddingRight: "10px" }}>
              {parseFloat(allTotal).toFixed(2)}
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <Fragment>
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
            fontSize: "28px",
          }}
        >
          {modalTitle()}
        </div>
        <br></br>
        <br></br>
        <div
          style={{
            fontWeight: "600",
            fontSize: "18px",
            textAlign: "left",
          }}
        >
          {props.title}
        </div>

        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            fontWeight: "500",
            paddingTop: "5px",
          }}
        >
          {longDateTime}
        </div>
        <br></br>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 400px",
            fontSize: "16px",
            textAlign: "left",
            paddingBottom: "10px",
          }}
        >
          <div style={{ fontWeight: "600" }}>Recipient:</div>
          <div>
            {props.details.recipient.firstname}{" "}
            {props.details.recipient.lastname}
          </div>
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "80px",
            paddingBottom: "10px",
          }}
        >
          {props.details.recipient.email}
        </div>
        {props.details.recipient.message !== "" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 400px",
              fontSize: "16px",
              textAlign: "left",
              paddingBottom: "10px",
            }}
          >
            <div style={{ fontWeight: "600" }}>Message:</div>
            <div
              style={{
                fontSize: "16px",
                textAlign: "left",
                paddingBottom: "10px",
              }}
            >
              {props.details.recipient.message}
            </div>
          </div>
        ) : null}
        <br></br>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 80px 70px 110px 70px",
            gridGap: "10px",
            width: "630px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            paddingBottom: "10px",
          }}
        >
          <div style={{ textAlign: "left" }}>Ticket Type</div>
          <div style={{ textAlign: "center" }}># Tickets</div>
          <div style={{ textAlign: "center" }}>Price</div>
          <div style={{ paddingLeft: "10px" }}>Payment Type</div>
          <div style={{ textAlign: "center" }}>Total</div>
        </div>

        <div
          style={{
            width: "630px",
            borderBottom: "1px solid black",
            paddingBottom: "10px",
          }}
        >
          {ticketsList()}
        </div>
        <div>{paymentTypeTotals()}</div>
        <br></br>
        {modalButtons()}
        <br></br>
        <br></br>
      </div>
    </Fragment>
  );
};

export default OrderModal;
