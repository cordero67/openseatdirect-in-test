import React, { Fragment } from "react";

import { getStartDate } from "../Resources/VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./ReceiptModal.module.css";

const ReceiptModal = (props) => {
  console.log("selected order: ", props);

  let netTotal = 0;
  let grossTotal = 0;
  let payPalExpressTotal = 0;
  let cashTotal = 0;
  let cashAppTotal = 0;
  let venmoTotal = 0;
  let paypalTotal = 0;
  let bitcoinTotal = 0;
  let ethereumTotal = 0;
  let dogecoinTotal = 0;
  let otherTotal = 0;

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
  console.log("tempOrdorderDetailsrs: ", orderDetails);

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
          PREVIOUS ORDER
        </button>
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            props.loadNext();
          }}
        >
          NEXT ORDER
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

  const ticketsList = () => {
    return orderDetails.map((ticket, index) => {
      let adjustedPaymentMethod;

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

      if (ticket.ticketsSold > 0) {
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
    });
  };

  const paymentTotals = () => {
    const grandTotals = () => {
      if (grossTotal != netTotal) {
        return (
          <Fragment>
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>Sub Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(grossTotal).toFixed(2)}
              </div>
            </div>
            <div className={classes.SubTotal}>
              <div style={{ textAlign: "right" }}>less Promos/Discounts:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(grossTotal - netTotal).toFixed(2)}
              </div>
            </div>
            <div className={classes.Total}>
              <div style={{ textAlign: "right" }}>Grand Total:</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(netTotal).toFixed(2)}
              </div>
            </div>
          </Fragment>
        );
      } else {
        return (
          <div className={classes.SubTotal}>
            <div style={{ textAlign: "right" }}>Grand Total:</div>
            <div style={{ textAlign: "right", paddingRight: "10px" }}>
              {parseFloat(netTotal).toFixed(2)}
            </div>
          </div>
        );
      }
    };

    if (props.details.isOffline) {
      console.log("OFFLINE PAYMENT");
      props.details.offlinePayment.forEach((payment) => {
        console.log(payment.amt, "---", payment.payMethod);
        if (payment.payMethod === "cash") {
          cashTotal += payment.amt;
        } else if (payment.payMethod === "CashApp") {
          cashAppTotal += payment.amt;
        } else if (payment.payMethod === "Venmo") {
          venmoTotal += payment.amt;
        } else if (payment.payMethod === "Paypal") {
          paypalTotal += payment.amt;
        } else if (payment.payMethod === "Bitcoin") {
          bitcoinTotal += payment.amt;
        } else if (payment.payMethod === "Ethereum") {
          ethereumTotal += payment.amt;
        } else if (payment.payMethod === "Dogecoin") {
          dogecoinTotal += payment.amt;
        } else if (payment.payMethod === "PayPal Express") {
          payPalExpressTotal += payment.amt;
        } else {
          otherTotal += payment.amt;
        }
      });
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
            marginLeft: "275px",
          }}
        >
          {grandTotals()}
          <div
            style={{
              borderTop: "1px solid black",
            }}
          >
            {payPalExpressTotal > 0 ? (
              <div className={classes.SubTotal}>
                <div style={{ textAlign: "right" }}>PayPal Express Total:</div>
                <div style={{ textAlign: "right", paddingRight: "10px" }}>
                  {parseFloat(payPalExpressTotal).toFixed(2)}
                </div>
              </div>
            ) : null}
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
          </div>
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
            gridTemplateColumns: "90px 400px",
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
            paddingLeft: "90px",
            paddingBottom: "10px",
          }}
        >
          {props.details.email}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "90px 400px",
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
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "80px",
            paddingBottom: "10px",
          }}
        >
          {/*"message" in props.details.recipient ? props.details.recipient.message : null*/}
        </div>
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
