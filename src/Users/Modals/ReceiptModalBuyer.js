import React, { Fragment } from "react";

import { getStartDate } from "../Vendor/Resources/VendorFunctions";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./ReceiptModal.module.css";

const ReceiptModal = (props) => {
  console.log("props: ", props);

  let netTotal = 0;
  let grossTotal = 0;

  let orderDetails = []; // stores all ticket transactions by ticket type

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

  let longDateTime;
  [longDateTime] = getStartDate(props.details.eventId.startDateTime);

  let shortDateTime;
  [shortDateTime] = getStartDate(props.details.createdAt);

  const modalButtons = () => {
    if (props.numberOrders > 1) {
      return (
        <div className={classes.ButtonDisplayGrid}>
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
    } else {
      return (
        <div className={classes.ButtonDisplay}>
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
    }
  };

  const ticketsList = () => {
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
              <div className={classes.TicketsGrid}>
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
        <div style={{ paddingLeft: "275px" }}>{grandTotals()}</div>
      </Fragment>
    );
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
        <div className={classes.EventTitle}>
          {props.details.eventId.eventTitle}
        </div>

        <div className={classes.DateTime}>{longDateTime}</div>
        <div className={classes.OrderDetailsGrid}>
          <div style={{ fontWeight: "600" }}>Recipient:</div>
          <div>
            {props.details.firstname}
            {", "}
            {props.details.lastname}
          </div>
          <div />
          <div>{props.details.email}</div>

          <div style={{ fontWeight: "600" }}>Order Date:</div>
          <div>{shortDateTime}</div>
          <div style={{ fontWeight: "600" }}>Order Number:</div>
          <div>{props.details.osdOrderId}</div>
        </div>

        <div className={classes.TicketsHeader}>
          <div style={{ textAlign: "center" }}>Quantity</div>
          <div style={{ textAlign: "left" }}>Type</div>
          <div style={{ textAlign: "right" }}>Price</div>
          <div style={{ textAlign: "right" }}>Total</div>
        </div>

        <div className={classes.TicketsDisplay}>{ticketsList()}</div>
        <div>{paymentTotals()}</div>

        {modalButtons()}
      </div>
    </Fragment>
  );
};

export default ReceiptModal;
