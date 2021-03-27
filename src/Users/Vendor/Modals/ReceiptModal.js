import React, { Fragment } from "react";

import { getStartDate } from "../Resources/VendorFunctions";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import classes from "./ReceiptModal.module.css";

const ReceiptModal = (props) => {
<<<<<<< HEAD
  console.log("selected order: ", props);
=======
  
  console.log("selected order: ", props)
>>>>>>> master

  let allTotal = 0;
  let payPalExpressTotal = 0;
  let cashTotal = 0;
  let cashAppTotal = 0;
  let venmoTotal = 0;
  let paypalTotal = 0;
  let bitcoinTotal = 0;
  let ethereumTotal = 0;
<<<<<<< HEAD
  let dogecoinTotal = 0;
=======
>>>>>>> master
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
<<<<<<< HEAD
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
=======
          gridGap: "40px",
          width: "630px",
          textAlign: "center",
          paddingLeft: "35px"
        }}
      >
        <button className={classes.ButtonBlue}
          onClick={() => {
            props.loadPrevious()
>>>>>>> master
          }}
        >
          PREVIOUS ORDER
        </button>
<<<<<<< HEAD
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            props.loadNext();
=======
        <button className={classes.ButtonGreen}
          onClick={() => {
            props.loadNext()
>>>>>>> master
          }}
        >
          NEXT ORDER
        </button>
<<<<<<< HEAD
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            props.close();
=======
        <button className={classes.ButtonGrey}
          onClick={() => {
            props.close()
>>>>>>> master
          }}
        >
          CLOSE
        </button>
      </div>
<<<<<<< HEAD
    );
  };

  const ticketsList = () => {
    return props.details.order_ticketItems.map((ticket, index) => {
      console.log("ticket: ", ticket);

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

      return (
        <Fragment key={index}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 80px 70px 70px",
              gridGap: "10px",
              width: "510px",
              height: "28px",
              paddingTop: "10px",
            }}
          >
            <div style={{ textAlign: "left" }}>{ticket.ticketName}</div>
            <div style={{ textAlign: "center" }}>{ticket.qty}</div>
            <div style={{ textAlign: "right", paddingRight: "10px" }}>
              {parseFloat(ticket.unit_price).toFixed(2)}
            </div>
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

    props.details.order_ticketItems.forEach((ticket, index) => {
      console.log("TICKET: ", ticket);

      let adjustedPaymentMethod;

      if (
        //"manualPaymentMethod" in ticket &&
        parseFloat(ticket.unit_price).toFixed(2) !== 0
      ) {
        //adjustedPaymentMethod = ticket.manualPaymentMethod;
        adjustedPaymentMethod = "Dogecoin";
      } else if ("manualPaymentMethod" in ticket) {
        adjustedPaymentMethod = "comp";
      } else {
        adjustedPaymentMethod = "PayPal Express";
      }
      console.log("allTotal before: ", allTotal);
      console.log("ticket.subtotal: ", ticket.subtotal);
      console.log("parseFloat(ticket.subtotal): ", parseFloat(ticket.subtotal));
      allTotal += parseFloat(ticket.subtotal);
      console.log("allTotal after: ", allTotal);
      if (adjustedPaymentMethod === "cash" && ticket.subTotal !== 0) {
        cashTotal += ticket.subtotal;
      } else if (adjustedPaymentMethod === "CashApp") {
        cashAppTotal += ticket.subtotal;
      } else if (adjustedPaymentMethod === "Venmo") {
        venmoTotal += ticket.subtotal;
      } else if (adjustedPaymentMethod === "Paypal") {
        paypalTotal += ticket.subtotal;
      } else if (adjustedPaymentMethod === "Bitcoin") {
        bitcoinTotal += ticket.subtotal;
      } else if (adjustedPaymentMethod === "Ethereum") {
        ethereumTotal += ticket.subtotal;
      } else if (adjustedPaymentMethod === "Dogecoin") {
        dogecoinTotal += ticket.subtotal;
      } else if (adjustedPaymentMethod === "PayPal Express") {
        payPalExpressTotal += ticket.subtotal;
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
=======
    )
  }

  const ticketsList = () => {
    return (
      props.details.order_ticketItems.map((ticket, index) => {
        console.log("ticket: ", ticket);

        let adjustedPaymentMethod;

        if ("manualPaymentMethod" in ticket && parseFloat(ticket.unit_price).toFixed(2) !== "0.00") {
          adjustedPaymentMethod = ticket.manualPaymentMethod;
        } else if ("manualPaymentMethod" in ticket) {
          adjustedPaymentMethod = "comp"
        } else {
          adjustedPaymentMethod = "PayPal Express"
        }

        return (
          <Fragment key={index}>
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
              <div style={{textAlign: "left"}}>{ticket.ticketName}</div>
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

  const paymentTypeTotals = () => {
    console.log("tickets: ", props.details.tickets)

    props.details.order_ticketItems.forEach((ticket, index) => {
      console.log("TICKET: ", ticket)

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
>>>>>>> master
    }

    return (
      <Fragment>
<<<<<<< HEAD
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
            marginLeft: "280px",
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
=======
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
>>>>>>> master

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
<<<<<<< HEAD
            textAlign: "left",
=======
            textAlign: "left"
>>>>>>> master
          }}
        >
          {props.details.eventTitle}
        </div>
<<<<<<< HEAD

=======
        
>>>>>>> master
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            fontWeight: "400",
<<<<<<< HEAD
            paddingTop: "5px",
=======
            paddingTop: "5px"
>>>>>>> master
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
<<<<<<< HEAD
            paddingBottom: "10px",
          }}
        >
          <div style={{ fontWeight: "600" }}>Recipient:</div>
          <div>
            {props.details.order_firstName}
            {", "}
            {props.details.order_lastName}
=======
            paddingBottom: "10px"
          }}
        >
          <div style={{fontWeight: "600"}}>Recipient:</div>
          <div>
            {props.details.order_firstName}{", "}{props.details.order_lastName}
>>>>>>> master
          </div>
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "90px",
<<<<<<< HEAD
            paddingBottom: "10px",
          }}
        >
=======
            paddingBottom: "10px"
          }}>
>>>>>>> master
          {props.details.order_email}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "90px 400px",
            fontSize: "16px",
            textAlign: "left",
<<<<<<< HEAD
            paddingBottom: "10px",
          }}
        >
          <div style={{ fontWeight: "600" }}>Order Date:</div>
          <div>{shortDateTime}</div>
=======
            paddingBottom: "10px"
          }}
        >
          <div style={{fontWeight: "600"}}>Order Date:</div>
          <div>
            {shortDateTime}
          </div>
>>>>>>> master
        </div>
        <div
          style={{
            fontSize: "16px",
            textAlign: "left",
            paddingLeft: "80px",
<<<<<<< HEAD
            paddingBottom: "10px",
          }}
        >
=======
            paddingBottom: "10px"
          }}>
>>>>>>> master
          {/*"message" in props.details.recipient ? props.details.recipient.message : null*/}
        </div>
        <br></br>

        <div
          style={{
            display: "grid",
<<<<<<< HEAD
            gridTemplateColumns: "260px 80px 70px 70px",
            gridGap: "10px",
            width: "510px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            paddingBottom: "10px",
          }}
        >
          <div style={{ textAlign: "left" }}>Ticket Type</div>
          <div style={{ textAlign: "center" }}># Tickets</div>
          <div style={{ textAlign: "center" }}>Price</div>
          <div style={{ textAlign: "center" }}>Total</div>
=======
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
>>>>>>> master
        </div>

        <div
          style={{
<<<<<<< HEAD
            width: "510px",
            borderBottom: "1px solid black",
            paddingBottom: "10px",
          }}
        >
=======
            width: "630px",
            borderBottom: "1px solid black",
            paddingBottom: "10px"
            }}
          >
>>>>>>> master
          {ticketsList()}
        </div>
        <div>{paymentTypeTotals()}</div>
        <br></br>

        {modalButtons()}

        <br></br>
      </div>
    </Fragment>
  );
};

export default ReceiptModal;
