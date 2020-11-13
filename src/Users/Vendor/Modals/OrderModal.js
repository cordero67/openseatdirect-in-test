import React, { Fragment } from "react";

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
    if (props.status === "review") {
      return (
        <Fragment>
          <Button
            style={{
              marginTop: "5px",
              marginRight: "10px",
              width: "120px",
              height: "30px",
              fontWeight: "600",
              textAlign: "center",
              paddingTop: "7px",
            }}
            content="Edit"
            basic
            color="red"
            icon="edit"
            onClick={props.close}
          />
          <Button
            style={{
              marginTop: "5px",
              marginLeft: "10px",
              width: "120px",
              height: "30px",
              fontWeight: "600",
              textAlign: "center",
              paddingTop: "7px",
            }}
            content="  Submit"
            basic
            color="green"
            icon="external alternate"
            onClick={props.submit}
          />
        </Fragment>
      )
    } else if (props.status === "confirmation") {
      return (
        <Fragment>
          <Button
            style={{
              backgroundColor: "#fff",
              border: "1px solid blue",
              color: "blue",
              fontSize: "15px",
              fontWeight: "600",
              width: "120px",
              height: "30px",
              margin: "auto",
              textAlign: "center",
              padding: "0px"
            }}
            content=" Continue"
            icon="arrow alternate circle right outline"
            onClick={props.clicked}
          />
        </Fragment>
      )
    } else if (props.status === "error") {
      return (
        <Fragment>
          <Button
            style={{
              backgroundColor: "#fff",
              border: "1px solid blue",
              color: "blue",
              fontSize: "15px",
              fontWeight: "600",
              width: "120px",
              height: "30px",
              margin: "auto",
              textAlign: "center",
              padding: "0px"
            }}
            content=" Continue"
            icon="angle right"
            onClick={props.close}
          />
        </Fragment>
      )
    }
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
              {ticket.chargedPrice === "COMP" ? <div>COMP</div> : <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(ticket.chargedPrice).toFixed(2)}</div>}
              {ticket.chargedPrice === "COMP" ? <div></div> : <div style={{textAlign: "left", paddingLeft: "20px"}}>{ticket.paymentType}</div>}
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
      if (ticket.paymentType === "CashUSD") {
        cashTotal += ticket.subTotal;
      } else if(ticket.paymentType === "CashApp")  {
        cashAppTotal += ticket.subTotal;
      } else if(ticket.paymentType === "Venmo")  {
        venmoTotal += ticket.subTotal;
      } else if(ticket.paymentType === "Paypal")  {
        paypalTotal += ticket.subTotal;
      } else if(ticket.paymentType === "BitCoin")  {
        bitcoinTotal += ticket.subTotal;
      } else if(ticket.paymentType === "Ethereum")  {
        ethereumTotal += ticket.subTotal;
      } else {
        otherTotal += ticket.subTotal;
      }
    })

    let allTotalBorder;

    if (false) {
      allTotalBorder = "none"
    } else {
      allTotalBorder = "1px solid black"
    }

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
            <div style={{textAlign: "right"}}>USD Total:</div>
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
        <div className={classes.SubTotal}>
          <div style={{textAlign: "right"}}>Grand Total:</div>
          <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(allTotal).toFixed(2)}</div>
        </div>
        </div>
      </Fragment>
    )
  }

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
            textAlign: "left"
          }}
        >
          {props.title}
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
            {props.details.recipient.lastName}, {props.details.recipient.firstName}
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
