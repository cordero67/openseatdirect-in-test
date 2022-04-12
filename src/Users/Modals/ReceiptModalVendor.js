import React, { Fragment } from "react";

import { getStartDate } from "../Vendor/Resources/VendorFunctions";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./ReceiptModal.module.css";

const ReceiptModal = (props) => {
  let netTotal = 0;
  let grossTotal = 0;

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
  console.log("UPDATED");

  // populate this ticketOrder array
  props.details.qrTickets.forEach((qrTix) => {
    orderDetails.forEach((ticketType, index) => {
      if (ticketType.ticketId === qrTix.ticketId) {
        orderDetails[index].ticketsSold += 1;
        orderDetails[index].grossTotal += qrTix.fullPrice;
        orderDetails[index].netTotal += qrTix.sellingPrice;

        grossTotal += qrTix.fullPrice;
        netTotal += qrTix.sellingPrice;
      }
    });
  });
  console.log("orderDetails: ", orderDetails);

  let longDateTime;
  [longDateTime] = getStartDate(props.details.startDateTime);

  let shortDateTime;
  [shortDateTime] = getStartDate(props.details.createdAt);

  // LOOKS GOOD: 1/21/21
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
          Previous receipt
        </button>
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            props.loadNext();
          }}
        >
          Next receipt
        </button>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            props.close();
          }}
        >
          Close
        </button>
      </div>
    );
  };

  const ticketsList = () => {
    console.log("orderDetails: ", orderDetails);
    return orderDetails.map((ticket, index) => {
      let adjustedPaymentMethod;
      if (ticket.ticketsSold > 0) {
        if (
          "manualPaymentMethod" in ticket &&
          parseFloat(ticket.unit_price).toFixed(2) !== "0.00"
        ) {
          adjustedPaymentMethod = ticket.manualPaymentMethod;
        } else if ("manualPaymentMethod" in ticket) {
          adjustedPaymentMethod = "comp";
        } else {
          adjustedPaymentMethod = "PayPal Express";
        }

        if (true) {
          return (
            <Fragment key={index}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 280px 70px 70px",
                  gridGap: "10px",
                  width: "510px",
                  height: "28px",
                  paddingTop: "10px",
                }}
              >
                <div style={{ textAlign: "center" }}>{ticket.ticketsSold}</div>
                <div style={{ textAlign: "left" }}>{ticket.ticketName}</div>
                <div style={{ textAlign: "right" }}>
                  {parseFloat(ticket.ticketPrice).toFixed(2)}
                </div>
                <div style={{ textAlign: "right" }}>
                  {parseFloat(ticket.grossTotal).toFixed(2)}
                </div>
              </div>
            </Fragment>
          );
        }
      }
    });
  };

  const paymentTotals = () => {
    const grandTotals = () => {
      if (grossTotal != netTotal) {
        return (
          <Fragment>
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>Sub Total:</div>
              <div style={{ textAlign: "right" }}>
                {parseFloat(grossTotal).toFixed(2)}
              </div>
            </div>
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>less Promos/Discounts:</div>
              <div style={{ textAlign: "right" }}>
                {parseFloat(grossTotal - netTotal).toFixed(2)}
              </div>
            </div>
            <div className={classes.Total}>
              <div style={{ textAlign: "right" }}>Grand Total:</div>
              <div style={{ textAlign: "right" }}>
                {parseFloat(netTotal).toFixed(2)}
              </div>
            </div>
          </Fragment>
        );
      } else {
        return (
          <div className={classes.SubTotal}>
            <div style={{ textAlign: "right" }}>Grand Total:</div>
            <div style={{ textAlign: "right" }}>
              {parseFloat(netTotal).toFixed(2)}
            </div>
          </div>
        );
      }
    };

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
            marginLeft: "275px",
          }}
        >
          {grandTotals()}
        </div>
      </Fragment>
    );
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
            {props.details.firstname}
            {", "}
            {props.details.lastname}
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
            display: "grid",
            gridTemplateColumns: "110px 380px",
            fontSize: "16px",
            textAlign: "left",
            paddingBottom: "10px",
          }}
        >
          <div style={{ fontWeight: "600" }}>Order Date:</div>
          <div>{shortDateTime}</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "110px 380px",
            fontSize: "16px",
            textAlign: "left",
            paddingBottom: "10px",
          }}
        >
          <div style={{ fontWeight: "600" }}>Order Number:</div>
          <div>{props.details.osdOrderId}</div>
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
            gridTemplateColumns: "60px 280px 70px 70px",
            gridGap: "10px",
            width: "510px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            paddingBottom: "10px",
          }}
        >
          <div style={{ textAlign: "center" }}>Quantity</div>
          <div style={{ textAlign: "left" }}>Type</div>
          <div style={{ textAlign: "right" }}>Price</div>
          <div style={{ textAlign: "right" }}>Total</div>
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
        <div>{paymentTotals()}</div>
        <br></br>

        {modalButtons()}

        <br></br>
      </div>
    </Fragment>
  );
};

export default ReceiptModal;
