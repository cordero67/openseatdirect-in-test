import React, { Fragment } from "react";

import { getStartDate } from "../Resources/VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./BuyerReceiptModal.module.css";

const ReceiptModal = (props) => {
  
  console.log("selected order: ", props)

  let allTotal = 0;
  let payPalExpressTotal = 0;
  let cashTotal = 0;
  let cashAppTotal = 0;
  let venmoTotal = 0;
  let paypalTotal = 0;
  let bitcoinTotal = 0;
  let ethereumTotal = 0;
  let otherTotal = 0;

  let longDateTime;
  [longDateTime] = getStartDate(props.details.startDateTime);

  let shortDateTime;
  [shortDateTime] = getStartDate(props.details.order_createdAt);

  // LOOKS GOOD: 1/21/21
  const modalButtons = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "160px 160px 160px",
          gridGap: "40px",
          width: "630px",
          textAlign: "center",
          paddingLeft: "35px"
        }}
      >
        <button className={classes.ButtonBlue}
          onClick={() => {
            props.loadPrevious()
          }}
        >
          LOAD PREVIOUS
        </button>
        <button className={classes.ButtonGreen}
          onClick={() => {
            props.loadNext()
          }}
        >
          LOAD NEXT
        </button>
        <button className={classes.ButtonGrey}
          onClick={() => {
            props.close()
          }}
        >
          CLOSE
        </button>
      </div>
    )
  }
  /*
  const ticketsList = () => {
    return (
      props.details.order_ticketItems.map((ticket, index) => {
        console.log("ticket: ", ticket);

        let adjustedTicketName;
        let num = 40;

        //if (ticket.ticketName.length <= num) {
          if (true) {
          adjustedTicketName = ticket.ticketName;
        } else {
          adjustedTicketName = ticket.ticketName.slice(0, num) + '...'
        }

        let adjustedPaymentMethod;

        if ("manualPaymentMethod" in  ticket && parseFloat(ticket.unit_price).toFixed(2) !== "0.00") {
          adjustedPaymentMethod = ticket.manualPaymentMethod;
        } else if ("manualPaymentMethod" in  ticket) {
          adjustedPaymentMethod = "comp"
        } else {
          adjustedPaymentMethod = "PayPal Express"
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
              <div style={{textAlign: "center"}}>{ticket.qty}</div>
              <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(ticket.unit_price).toFixed(2)}</div>
              <div style={{textAlign: "left", paddingLeft: "10px"}}>{adjustedPaymentMethod}</div>
              <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(ticket.item_total_price).toFixed(2)}</div>
            </div>
          </Fragment>
        )
      })
    )
  }
  */
 /*
  const paymentTypeTotals = () => {
    console.log("tickets: ", props.details.tickets)

    props.details.order_ticketItems.forEach((ticket, index) => {

      let adjustedPaymentMethod;
  
      if ("manualPaymentMethod" in  ticket && parseFloat(ticket.unit_price).toFixed(2) !== "0.00") {
        adjustedPaymentMethod = ticket.manualPaymentMethod;
      } else if ("manualPaymentMethod" in  ticket) {
        adjustedPaymentMethod = "comp"
      } else {
        adjustedPaymentMethod = "PayPal Express"
      }

      allTotal += ticket.item_total_price;
      if (adjustedPaymentMethod === "cash" && ticket.subTotal !== 0) {
        cashTotal += ticket.item_total_price;
      } else if(adjustedPaymentMethod === "CashApp")  {
        cashAppTotal += ticket.item_total_price;
      } else if(adjustedPaymentMethod === "Venmo")  {
        venmoTotal += ticket.item_total_price;
      } else if(adjustedPaymentMethod === "Paypal")  {
        paypalTotal += ticket.item_total_price;
      } else if(adjustedPaymentMethod === "Bitcoin")  {
        bitcoinTotal += ticket.item_total_price;
      } else if(adjustedPaymentMethod === "Ethereum")  {
        ethereumTotal += ticket.item_total_price;
      } else if(adjustedPaymentMethod === "PayPal Express")  {
        payPalExpressTotal += ticket.item_total_price;
      } else {
        otherTotal += ticket.item_total_price;
      }
    })
  
    let allTotalBorder = classes.Total;

    console.log("allTotal: ", allTotal)
    console.log("typeof: ", typeof allTotal)

    if (parseInt(allTotal) === 0) {
      console.log("equal to 0")
      allTotalBorder = classes.SubTotal
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
          marginLeft: "400px"
        }}>
        {payPalExpressTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>PayPal Express Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(payPalExpressTotal).toFixed(2)}</div>
          </div> :
          null
        }
        {cashTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>cash Total:</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(cashTotal).toFixed(2)}</div>
          </div> :
          null
        }
        {cashAppTotal > 0 ?
          <div className={classes.SubTotal}>
            <div style={{textAlign: "right"}}>CashApp Total:</div>
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
*/
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
            textAlign: "left"
          }}
        >
          {props.details.eventTitle}
        </div>
        
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            fontWeight: "400",
            paddingTop: "5px"
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
            paddingBottom: "10px"
          }}
        >
          <div style={{fontWeight: "600"}}>Recipient:</div>
          <div>
            {props.details.order_firstName}{", "}{props.details.order_lastName}
          </div>
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "90px",
            paddingBottom: "10px"
          }}>
          {props.details.order_email}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "90px 400px",
            fontSize: "16px",
            textAlign: "left",
            paddingBottom: "10px"
          }}
        >
          <div style={{fontWeight: "600"}}>Order Date:</div>
          <div>
            {shortDateTime}
          </div>
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "80px",
            paddingBottom: "10px"
          }}>
          {/*"message" in props.details.recipient ? props.details.recipient.message : null*/}
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
          <div style={{textAlign: "left", paddingLeft: "10px"}}>Payment Type</div>
          <div style={{textAlign: "center"}}>Total</div>
        </div>

        <div
          style={{
            width: "630px",
            borderBottom: "1px solid black",
            paddingBottom: "10px"
            }}
          >
          {/*ticketsList()*/}
        </div>
        <div>{/*paymentTypeTotals()*/}</div>
        <br></br>

        {modalButtons()}

        <br></br>
      </div>
    </Fragment>
  );
};

export default ReceiptModal;
