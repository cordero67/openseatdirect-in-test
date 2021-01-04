import React, { Fragment } from "react";

import { getStartDate } from "../VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./OrderModal.module.css";

import { Button } from "semantic-ui-react";

const OrderModal = (props) => {

  let allTotal = 0;
  let cashTotal = 0;
  let cashAppTotal = 0;
  let venmoTotal = 0;
  let paypalTotal = 0;
  let bitcoinTotal = 0;
  let ethereumTotal = 0;
  let otherTotal = 0;

  
  let longDateTime;
  [longDateTime] = getStartDate(props.dateTime);
  console.log("longDateTime: ", longDateTime)

  const modalTitle = () => {
    if (props.status === "review") {
      return <Fragment>Review and submit order</Fragment>
    } else if (props.status === "confirmation") {
      return <Fragment>Order confirmed and tickets issued</Fragment>
    } else if (props.status === "error") {
      return (
        <div>
          <div style={{paddingBottom: "10px"}}>
            Your order was not successful
          </div>
          <div style={{paddingBottom: "10px"}}>
            Please check the order information and resubmit
          </div>
        </div>
      )
    }
  }

  const modalButtons = () => {
    return (
      <Fragment>
        <button
          style={{
            border: "1px solid black",
            backgroundColor: "#B80000",
            color: "#fff",
            fontSize: "14px",
            width: "240px",
            height: "40px",
            fontWeight: "500"
          }}
          onClick={props.close}
        >
          CLOSE WINDOW
        </button>
      </Fragment>
    )
  }

  const ticketsList = () => {
    return (
      props.details.tickets.map((ticket, index) => {
        console.log("ticket: ", ticket);

        let adjustedTicketName;
        let num = 30;

        if (ticket.ticketName.length <= num) {
          adjustedTicketName = ticket.ticketName;
        } else {
          adjustedTicketName = ticket.ticketName.slice(0, num) + '...'
        }

        return (
          <Fragment>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "260px 80px 70px 110px 70px",
                gridGap: "10px",
                width: "630px",
                height: "28px",
                paddingTop: "10px"
              }}
            >
              <div style={{textAlign: "left"}}>{adjustedTicketName}</div>
              <div style={{textAlign: "center"}}>{ticket.numTickets}</div>
              <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(ticket.chargedPrice).toFixed(2)}</div>
              {parseFloat(ticket.chargedPrice).toFixed(2) !== "0.00" ?
                <div style={{textAlign: "left", paddingLeft: "20px"}}>{ticket.paymentType}</div> :
                <div style={{textAlign: "left", paddingLeft: "20px"}}>comp</div>
              }
              <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(ticket.subTotal).toFixed(2)}</div>
            </div>
          </Fragment>
        )
      })
    )
  }

  const paymentTypeTotals = () => {
    console.log("tickets: ", props.details.tickets)
    props.details.tickets.forEach((ticket, index) => {
      allTotal += ticket.subTotal;
      if (ticket.paymentType === "cash" && ticket.subTotal !== 0) {
        cashTotal += ticket.subTotal;
      } else if(ticket.paymentType === "CashApp")  {
        cashAppTotal += ticket.subTotal;
      } else if(ticket.paymentType === "Venmo")  {
        venmoTotal += ticket.subTotal;
      } else if(ticket.paymentType === "Paypal")  {
        paypalTotal += ticket.subTotal;
      } else if(ticket.paymentType === "Bitcoin")  {
        bitcoinTotal += ticket.subTotal;
      } else if(ticket.paymentType === "Ethereum")  {
        ethereumTotal += ticket.subTotal;
      } else {
        otherTotal += ticket.subTotal;
      }
    })

    let allTotalBorder = classes.Total;

    console.log("allTotal: ", allTotal)
    console.log("typeof: ", typeof allTotal)

    if (parseInt(allTotal) === 0) {
      console.log("equal to 0")
      allTotalBorder=classes.SubTotal
    }
    /*
    if (allTotal === "0") {
      console.log("equal to '0'")
    }
    
    if (allTotal === "0.00") {
      console.log("equal to '0.00'")
    }
    */

    return (
      <Fragment>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "520px 70px",
          gridGap: "10px",
          paddingTop: "5px"
        }}>
      </div>
      <div
        style={{
          marginRight: "8px",
          marginLeft: "440px"
        }}>
        {cashTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>cash Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(cashTotal).toFixed(2)}</div>
          </div> :
          null
        }
        {cashAppTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>cashApp Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(cashAppTotal).toFixed(2)}</div>
          </div> :
          null
        }
        {venmoTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>Venmo Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(venmoTotal).toFixed(2)}</div>
          </div> :
          null
        }
        {paypalTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>PayPal Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(paypalTotal).toFixed(2)}</div>
          </div> :
          null
        }
        {bitcoinTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>Bitcoin Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(bitcoinTotal).toFixed(2)}</div>
          </div> :
          null
        }
        {ethereumTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>Ethereum Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(ethereumTotal).toFixed(2)}</div>
          </div> :
          null
        }
        {otherTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>other Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(otherTotal).toFixed(2)}</div>
          </div> :
          null
        }
        <div className={allTotalBorder}>
          <div style={{textAlign: "right"}}>Grand Total:</div>
          <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(allTotal).toFixed(2)}</div>
        </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Backdrop show={true} clicked={props.modalClosed}></Backdrop>
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
            textAlign: "left"
          }}
        >
          {props.title}
        </div>
        
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            fontWeight: "500",
            paddingTop: "5px"
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
            paddingBottom: "10px"
          }}
        >
          <div style={{fontWeight: "600"}}>Recipient:</div>
          <div>
            {props.details.recipient.firstName}{" "}{props.details.recipient.lastName}
          </div>
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "80px",
            paddingBottom: "10px"
          }}>
          {props.details.recipient.email}
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "80px",
            paddingBottom: "10px"
          }}>
          {props.details.recipient.message}
        </div>
        <br></br>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 80px 70px 110px 70px",
            gridGap: "10px",
            width: "630px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            paddingBottom: "10px"
          }}
        >
          <div style={{textAlign: "left"}}>Ticket Type</div>
          <div style={{textAlign: "center"}}># Tickets</div>
          <div style={{textAlign: "center"}}>Price</div>
          <div style={{paddingLeft: "10px"}}>Payment Type</div>
          <div style={{textAlign: "center"}}>Total</div>
        </div>

        <div
          style={{
            width: "630px",
            borderBottom: "1px solid black",
            paddingBottom: "10px"
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
